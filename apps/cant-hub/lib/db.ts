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
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);
