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
  timeLimitSeconds: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentCategory {
  id: string;
  assessmentId: string;
  appSlug: string;
  categorySlug: string;
  questionCount: number | null;
  difficulty: string | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Assessment CRUD
// ---------------------------------------------------------------------------

export function getAssessmentsByUser(userId: string): Assessment[] {
  const rows = db
    .prepare(
      "SELECT * FROM assessment WHERE userId = ? ORDER BY updatedAt DESC",
    )
    .all(userId) as unknown as Assessment[];
  return rows.map((r) => ({ ...r }));
}

export function getAssessmentById(id: string): Assessment | undefined {
  const row = db
    .prepare("SELECT * FROM assessment WHERE id = ?")
    .get(id) as unknown as Assessment | undefined;
  return row ? { ...row } : undefined;
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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- just inserted
  return getAssessmentById(id)!;
}

export function updateAssessment(
  id: string,
  data: {
    title?: string;
    description?: string;
    status?: AssessmentStatus;
    timeLimitSeconds?: number | null;
  },
): Assessment | undefined {
  const assessment = getAssessmentById(id);
  if (!assessment) return undefined;

  const title = data.title ?? assessment.title;
  const description = data.description ?? assessment.description;
  const status = data.status ?? assessment.status;
  const timeLimitSeconds =
    data.timeLimitSeconds !== undefined
      ? data.timeLimitSeconds
      : assessment.timeLimitSeconds;
  const now = new Date().toISOString();

  db.prepare(
    "UPDATE assessment SET title = ?, description = ?, status = ?, timeLimitSeconds = ?, updatedAt = ? WHERE id = ?",
  ).run(title, description, status, timeLimitSeconds, now, id);
  return getAssessmentById(id);
}

export function deleteAssessment(id: string): boolean {
  const result = db.prepare("DELETE FROM assessment WHERE id = ?").run(id);
  return result.changes > 0;
}

export function duplicateAssessment(
  sourceId: string,
  userId: string,
): Assessment | undefined {
  const source = getAssessmentById(sourceId);
  if (!source) return undefined;

  const newId = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO assessment (id, title, description, status, userId, timeLimitSeconds, createdAt, updatedAt) VALUES (?, ?, ?, 'draft', ?, ?, ?, ?)",
  ).run(
    newId,
    `Copy of ${source.title}`,
    source.description,
    userId,
    source.timeLimitSeconds,
    now,
    now,
  );

  // Copy categories
  const categories = getCategoriesByAssessment(sourceId);
  for (const cat of categories) {
    db.prepare(
      "INSERT INTO assessment_category (id, assessmentId, appSlug, categorySlug, questionCount, difficulty, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).run(
      randomUUID(),
      newId,
      cat.appSlug,
      cat.categorySlug,
      cat.questionCount,
      cat.difficulty,
      now,
    );
  }

  return getAssessmentById(newId);
}

// ---------------------------------------------------------------------------
// Assessment category CRUD
// ---------------------------------------------------------------------------

export function getCategoriesByAssessment(
  assessmentId: string,
): AssessmentCategory[] {
  const rows = db
    .prepare(
      "SELECT * FROM assessment_category WHERE assessmentId = ? ORDER BY createdAt ASC",
    )
    .all(assessmentId) as unknown as AssessmentCategory[];
  // node:sqlite returns null-prototype objects; spread into plain objects
  // so they can be passed from Server Components to Client Components.
  return rows.map((r) => ({ ...r }));
}

export interface CategoryInput {
  appSlug: string;
  categorySlug: string;
  questionCount?: number | null;
  difficulty?: string | null;
}

export function setAssessmentCategories(
  assessmentId: string,
  categories: CategoryInput[],
): void {
  db.prepare("DELETE FROM assessment_category WHERE assessmentId = ?").run(
    assessmentId,
  );

  const now = new Date().toISOString();
  const insert = db.prepare(
    "INSERT INTO assessment_category (id, assessmentId, appSlug, categorySlug, questionCount, difficulty, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );

  for (const cat of categories) {
    insert.run(
      randomUUID(),
      assessmentId,
      cat.appSlug,
      cat.categorySlug,
      cat.questionCount ?? null,
      cat.difficulty ?? null,
      now,
    );
  }

  // Touch the assessment's updatedAt
  db.prepare("UPDATE assessment SET updatedAt = ? WHERE id = ?").run(
    now,
    assessmentId,
  );
}
