"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import {
  getAssessmentById,
  getCategoriesByAssessment,
} from "@/lib/assessments";
import {
  createCandidateSession,
  getCandidateSession,
  getAnswersBySession,
  saveAnswer,
  getAnswerCount,
  finishSession,
} from "@/lib/candidate-sessions";
import {
  getAssessmentChallenges,
  countAssessmentQuestions,
} from "@/lib/assessment-challenges";

// eslint-disable-next-line @typescript-eslint/require-await
export async function startSessionAction(
  assessmentId: string,
  formData: FormData,
): Promise<void> {
  const name = (formData.get("name") as string | null)?.trim();
  const email = (formData.get("email") as string | null)?.trim();

  if (!name || !email) return;

  const assessment = getAssessmentById(assessmentId);
  if (assessment?.status !== "active") return;

  const categories = getCategoriesByAssessment(assessmentId);
  const availableQuestions = countAssessmentQuestions(categories);
  const totalQuestions =
    assessment.questionCount != null && assessment.questionCount > 0
      ? Math.min(assessment.questionCount, availableQuestions)
      : availableQuestions;
  const seed = randomUUID();

  const session = createCandidateSession(
    assessmentId,
    name,
    email,
    totalQuestions,
    seed,
  );

  redirect(`/s/${assessmentId}/play?session=${session.id}`);
}

export async function submitAnswerAction(
  sessionId: string,
  challengeId: string,
  chosenSide: "left" | "right",
): Promise<{ correct: boolean; answerCount: number; total: number }> {
  const session = getCandidateSession(sessionId);
  if (session?.status !== "in_progress") {
    return { correct: false, answerCount: 0, total: 0 };
  }

  const assessment = getAssessmentById(session.assessmentId);
  if (!assessment) return { correct: false, answerCount: 0, total: 0 };

  const categories = getCategoriesByAssessment(session.assessmentId);
  const challenges = await getAssessmentChallenges(categories, session.seed);
  const challenge = challenges.find((c) => c.id === challengeId);
  if (!challenge) return { correct: false, answerCount: 0, total: 0 };

  const correct = chosenSide === challenge.correctSide;
  saveAnswer(sessionId, challengeId, chosenSide, correct);

  const answerCount = getAnswerCount(sessionId);
  const total = session.totalQuestions ?? challenges.length;

  // Auto-finish if all questions answered
  if (answerCount >= total) {
    const score = scoreSession(sessionId);
    finishSession(sessionId, score);
  }

  return { correct, answerCount, total };
}

function scoreSession(sessionId: string): number {
  const answers = getAnswersBySession(sessionId);
  return answers.filter((a) => a.correct === 1).length;
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function finishSessionAction(sessionId: string): Promise<void> {
  const session = getCandidateSession(sessionId);
  if (session?.status !== "in_progress") return;

  finishSession(sessionId, scoreSession(sessionId));
  redirect(`/s/${session.assessmentId}/done?session=${sessionId}`);
}
