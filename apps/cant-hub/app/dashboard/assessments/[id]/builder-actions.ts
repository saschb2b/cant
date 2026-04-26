"use server";

import { getSession } from "@/lib/auth-session";
import {
  getAssessmentById,
  updateAssessment,
  setAssessmentCategories,
  type CategoryInput,
} from "@/lib/assessments";

export async function saveAssessmentBuilderAction(
  assessmentId: string,
  data: {
    timeLimitMinutes: number | null;
    questionCount: number | null;
    categories: CategoryInput[];
  },
) {
  const session = await getSession();
  if (session?.user.role !== "recruiter") {
    throw new Error("Unauthorized");
  }
  const assessment = getAssessmentById(assessmentId);
  if (assessment?.userId !== session.user.id) {
    throw new Error("Not found");
  }

  updateAssessment(assessmentId, {
    timeLimitSeconds: data.timeLimitMinutes ? data.timeLimitMinutes * 60 : null,
    questionCount: data.questionCount,
  });
  setAssessmentCategories(assessmentId, data.categories);
}
