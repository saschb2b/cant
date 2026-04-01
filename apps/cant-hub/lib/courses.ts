import "server-only";
import { randomUUID } from "node:crypto";
import { db } from "./db";

export type CourseStatus = "draft" | "active" | "archived";

export interface Course {
  id: string;
  title: string;
  description: string | null;
  status: CourseStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function getCoursesByUser(userId: string): Course[] {
  return db
    .prepare("SELECT * FROM course WHERE userId = ? ORDER BY updatedAt DESC")
    .all(userId) as unknown as Course[];
}

export function getCourseById(id: string): Course | undefined {
  return db.prepare("SELECT * FROM course WHERE id = ?").get(id) as unknown as
    | Course
    | undefined;
}

export function createCourse(
  userId: string,
  title: string,
  description?: string,
): Course {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO course (id, title, description, status, userId, createdAt, updatedAt) VALUES (?, ?, ?, 'draft', ?, ?, ?)",
  ).run(id, title, description ?? null, userId, now, now);
  return getCourseById(id)!;
}

export function updateCourse(
  id: string,
  data: { title?: string; description?: string; status?: CourseStatus },
): Course | undefined {
  const course = getCourseById(id);
  if (!course) return undefined;

  const title = data.title ?? course.title;
  const description = data.description ?? course.description;
  const status = data.status ?? course.status;
  const now = new Date().toISOString();

  db.prepare(
    "UPDATE course SET title = ?, description = ?, status = ?, updatedAt = ? WHERE id = ?",
  ).run(title, description, status, now, id);
  return getCourseById(id);
}

export function deleteCourse(id: string): boolean {
  const result = db.prepare("DELETE FROM course WHERE id = ?").run(id);
  return result.changes > 0;
}
