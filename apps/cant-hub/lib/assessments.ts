import "server-only";
import { randomUUID } from "node:crypto";
import { db } from "./db";

export type AssessmentStatus = "draft" | "active" | "archived";

export interface Assessment {
  id: string;
  title: string;
  description: string | null;
  status: AssessmentStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function getAssessmentsByUser(userId: string): Assessment[] {
  return db
    .prepare(
      "SELECT * FROM assessment WHERE userId = ? ORDER BY updatedAt DESC",
    )
    .all(userId) as unknown as Assessment[];
}

export function getAssessmentById(id: string): Assessment | undefined {
  return db
    .prepare("SELECT * FROM assessment WHERE id = ?")
    .get(id) as unknown as Assessment | undefined;
}

export function createAssessment(
  userId: string,
  title: string,
  description?: string,
): Assessment {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO assessment (id, title, description, status, userId, createdAt, updatedAt) VALUES (?, ?, ?, 'draft', ?, ?, ?)",
  ).run(id, title, description ?? null, userId, now, now);
  return getAssessmentById(id)!;
}

export function updateAssessment(
  id: string,
  data: {
    title?: string;
    description?: string;
    status?: AssessmentStatus;
  },
): Assessment | undefined {
  const assessment = getAssessmentById(id);
  if (!assessment) return undefined;

  const title = data.title ?? assessment.title;
  const description = data.description ?? assessment.description;
  const status = data.status ?? assessment.status;
  const now = new Date().toISOString();

  db.prepare(
    "UPDATE assessment SET title = ?, description = ?, status = ?, updatedAt = ? WHERE id = ?",
  ).run(title, description, status, now, id);
  return getAssessmentById(id);
}

export function deleteAssessment(id: string): boolean {
  const result = db.prepare("DELETE FROM assessment WHERE id = ?").run(id);
  return result.changes > 0;
}
