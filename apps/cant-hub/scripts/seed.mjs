/**
 * Seeds the local auth database with test accounts.
 * Run: node apps/cant-hub/scripts/seed.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const dbDir = path.join(import.meta.dirname, "..", "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new DatabaseSync(path.join(dbDir, "auth.db"));

// Ensure tables exist (including role column for user roles)
db.exec(`
  CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    emailVerified INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    role TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    expiresAt TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    userId TEXT NOT NULL REFERENCES user(id)
  );

  CREATE TABLE IF NOT EXISTS account (
    id TEXT PRIMARY KEY,
    accountId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    userId TEXT NOT NULL REFERENCES user(id),
    accessToken TEXT,
    refreshToken TEXT,
    idToken TEXT,
    accessTokenExpiresAt TEXT,
    refreshTokenExpiresAt TEXT,
    scope TEXT,
    password TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS verification (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt TEXT NOT NULL,
    createdAt TEXT,
    updatedAt TEXT
  );
`);

const now = new Date().toISOString();

const users = [
  {
    id: "test-recruiter-001",
    name: "Test Recruiter",
    email: "recruiter@test.local",
    role: "recruiter",
  },
  {
    id: "test-developer-001",
    name: "Test Developer",
    email: "developer@test.local",
    role: "developer",
  },
  {
    id: "test-new-user-001",
    name: "Test New User",
    email: "newuser@test.local",
    role: null,
  },
];

const insert = db.prepare(`
  INSERT OR REPLACE INTO user (id, name, email, emailVerified, role, createdAt, updatedAt)
  VALUES (?, ?, ?, 1, ?, ?, ?)
`);

for (const user of users) {
  insert.run(user.id, user.name, user.email, user.role, now, now);
}

// Create long-lived sessions for local dev (expires in 1 year)
const expiresAt = new Date(
  Date.now() + 365 * 24 * 60 * 60 * 1000,
).toISOString();

const sessions = [
  {
    id: "session-recruiter",
    token: "test-session-recruiter",
    userId: "test-recruiter-001",
  },
  {
    id: "session-developer",
    token: "test-session-developer",
    userId: "test-developer-001",
  },
  {
    id: "session-new-user",
    token: "test-session-new-user",
    userId: "test-new-user-001",
  },
];

const insertSession = db.prepare(`
  INSERT OR REPLACE INTO session (id, expiresAt, token, createdAt, updatedAt, userId)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const session of sessions) {
  insertSession.run(
    session.id,
    expiresAt,
    session.token,
    now,
    now,
    session.userId,
  );
}

console.log("Seeded test accounts:");
for (const user of users) {
  console.log(
    `  ${user.name} (${user.email}) - role: ${user.role ?? "(none, needs onboarding)"}`,
  );
}
console.log("\nSession tokens:");
console.log("  Recruiter:  test-session-recruiter");
console.log("  Developer:  test-session-developer");
console.log("  New user:   test-session-new-user");
console.log(
  '\nSet cookie "better-auth.session_token=<token>" to log in as a test user.',
);
