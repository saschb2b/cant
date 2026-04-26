import "server-only";
import { randomUUID } from "node:crypto";
import { getDb } from "./db";

export type SessionStatus = "in_progress" | "completed";
export type ReviewStatus = "pending" | "proceed" | "rejected";

export interface CandidateSession {
  id: string;
  assessmentId: string;
  candidateName: string;
  candidateEmail: string;
  status: SessionStatus;
  score: number | null;
  totalQuestions: number | null;
  startedAt: string;
  finishedAt: string | null;
  seed: string;
  reviewStatus: ReviewStatus;
}

export interface CandidateAnswer {
  id: string;
  sessionId: string;
  challengeId: string;
  chosenSide: "left" | "right";
  correct: number;
  answeredAt: string;
}

// ---------------------------------------------------------------------------
// Session CRUD
// ---------------------------------------------------------------------------

export function createCandidateSession(
  assessmentId: string,
  candidateName: string,
  candidateEmail: string,
  totalQuestions: number,
  seed: string,
): CandidateSession {
  const id = randomUUID();
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO candidate_session (id, assessmentId, candidateName, candidateEmail, status, totalQuestions, startedAt, seed)
     VALUES (?, ?, ?, ?, 'in_progress', ?, ?, ?)`,
    )
    .run(
      id,
      assessmentId,
      candidateName,
      candidateEmail,
      totalQuestions,
      now,
      seed,
    );
  const session = getCandidateSession(id);
  if (!session) throw new Error(`Failed to create candidate session ${id}`);
  return session;
}

export function getCandidateSession(id: string): CandidateSession | undefined {
  const row = getDb()
    .prepare("SELECT * FROM candidate_session WHERE id = ?")
    .get(id) as unknown as CandidateSession | undefined;
  return row ? { ...row } : undefined;
}

export function getSessionsByAssessment(
  assessmentId: string,
): CandidateSession[] {
  const rows = getDb()
    .prepare(
      "SELECT * FROM candidate_session WHERE assessmentId = ? ORDER BY startedAt DESC",
    )
    .all(assessmentId) as unknown as CandidateSession[];
  return rows.map((r) => ({ ...r }));
}

export function finishSession(id: string, score: number): void {
  const now = new Date().toISOString();
  getDb()
    .prepare(
      "UPDATE candidate_session SET status = 'completed', score = ?, finishedAt = ? WHERE id = ?",
    )
    .run(score, now, id);
}

// ---------------------------------------------------------------------------
// Answer CRUD
// ---------------------------------------------------------------------------

export function saveAnswer(
  sessionId: string,
  challengeId: string,
  chosenSide: "left" | "right",
  correct: boolean,
): void {
  const id = randomUUID();
  const now = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT OR REPLACE INTO candidate_answer (id, sessionId, challengeId, chosenSide, correct, answeredAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(id, sessionId, challengeId, chosenSide, correct ? 1 : 0, now);
}

export function getAnswersBySession(sessionId: string): CandidateAnswer[] {
  const rows = getDb()
    .prepare(
      "SELECT * FROM candidate_answer WHERE sessionId = ? ORDER BY answeredAt ASC",
    )
    .all(sessionId) as unknown as CandidateAnswer[];
  return rows.map((r) => ({ ...r }));
}

export function getAnswerCount(sessionId: string): number {
  const row = getDb()
    .prepare(
      "SELECT COUNT(*) as count FROM candidate_answer WHERE sessionId = ?",
    )
    .get(sessionId) as unknown as { count: number };
  return row.count;
}

// ---------------------------------------------------------------------------
// Review status
// ---------------------------------------------------------------------------

export function updateReviewStatus(
  sessionId: string,
  reviewStatus: ReviewStatus,
): void {
  getDb()
    .prepare("UPDATE candidate_session SET reviewStatus = ? WHERE id = ?")
    .run(reviewStatus, sessionId);
}
