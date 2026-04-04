import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(path.join(dbDir, "auth.db"));

// Screening assessment tables
db.exec(`
  CREATE TABLE IF NOT EXISTS assessment (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    userId TEXT NOT NULL REFERENCES user(id),
    timeLimitSeconds INTEGER,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

// Add timeLimitSeconds column for existing databases
try {
  db.exec(`ALTER TABLE assessment ADD COLUMN timeLimitSeconds INTEGER`);
} catch {
  // Column already exists
}

db.exec(`
  CREATE TABLE IF NOT EXISTS assessment_category (
    id TEXT PRIMARY KEY,
    assessmentId TEXT NOT NULL REFERENCES assessment(id) ON DELETE CASCADE,
    appSlug TEXT NOT NULL,
    categorySlug TEXT NOT NULL,
    questionCount INTEGER,
    difficulty TEXT,
    createdAt TEXT NOT NULL,
    UNIQUE(assessmentId, appSlug, categorySlug)
  );
`);

// Candidate session: one per candidate per assessment attempt
db.exec(`
  CREATE TABLE IF NOT EXISTS candidate_session (
    id TEXT PRIMARY KEY,
    assessmentId TEXT NOT NULL REFERENCES assessment(id) ON DELETE CASCADE,
    candidateName TEXT NOT NULL,
    candidateEmail TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'in_progress',
    score INTEGER,
    totalQuestions INTEGER,
    startedAt TEXT NOT NULL,
    finishedAt TEXT,
    seed TEXT NOT NULL,
    reviewStatus TEXT NOT NULL DEFAULT 'pending'
  );
`);

// Individual answers: one per question per session
db.exec(`
  CREATE TABLE IF NOT EXISTS candidate_answer (
    id TEXT PRIMARY KEY,
    sessionId TEXT NOT NULL REFERENCES candidate_session(id) ON DELETE CASCADE,
    challengeId TEXT NOT NULL,
    chosenSide TEXT NOT NULL,
    correct INTEGER NOT NULL,
    answeredAt TEXT NOT NULL,
    UNIQUE(sessionId, challengeId)
  );
`);

// Add reviewStatus column for existing databases
try {
  db.exec(
    `ALTER TABLE candidate_session ADD COLUMN reviewStatus TEXT NOT NULL DEFAULT 'pending'`,
  );
} catch {
  // Column already exists
}
