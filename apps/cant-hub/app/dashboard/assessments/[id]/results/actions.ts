"use server";

import { getSession } from "@/lib/auth-session";
import { getAssessmentById } from "@/lib/assessments";
import {
  getCandidateSession,
  getSessionsByAssessment,
  updateReviewStatus,
  type ReviewStatus,
} from "@/lib/candidate-sessions";

async function assertOwner(assessmentId: string) {
  const session = await getSession();
  if (session?.user.role !== "recruiter") {
    throw new Error("Unauthorized");
  }
  const assessment = getAssessmentById(assessmentId);
  if (assessment?.userId !== session.user.id) {
    throw new Error("Not found");
  }
  return { session, assessment };
}

export async function updateReviewStatusAction(
  sessionId: string,
  reviewStatus: ReviewStatus,
) {
  const candidateSession = getCandidateSession(sessionId);
  if (!candidateSession) {
    throw new Error("Session not found");
  }
  await assertOwner(candidateSession.assessmentId);
  updateReviewStatus(sessionId, reviewStatus);
}

export async function exportCsvAction(assessmentId: string): Promise<string> {
  await assertOwner(assessmentId);
  const sessions = getSessionsByAssessment(assessmentId);

  const header = "Name,Email,Score,Percentage,Time (seconds),Date,Status";
  const rows = sessions.map((s) => {
    const score = s.score ?? 0;
    const total = s.totalQuestions ?? 0;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const timeSec =
      s.startedAt && s.finishedAt
        ? Math.round(
            (new Date(s.finishedAt).getTime() -
              new Date(s.startedAt).getTime()) /
              1000,
          )
        : "";
    const date = s.startedAt ? new Date(s.startedAt).toISOString() : "";
    // Escape fields that may contain commas
    const name = `"${s.candidateName.replace(/"/g, '""')}"`;
    const email = `"${s.candidateEmail.replace(/"/g, '""')}"`;
    return `${name},${email},${String(score)}/${String(total)},${String(pct)}%,${String(timeSec)},${date},${s.reviewStatus}`;
  });

  return [header, ...rows].join("\n");
}
