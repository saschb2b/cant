"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-session";
import {
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  duplicateAssessment,
  type AssessmentStatus,
} from "@/lib/assessments";

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

export async function updateAssessmentStatusAction(
  assessmentId: string,
  status: AssessmentStatus,
) {
  await assertOwner(assessmentId);
  updateAssessment(assessmentId, { status });
}

export async function deleteAssessmentAction(assessmentId: string) {
  await assertOwner(assessmentId);
  deleteAssessment(assessmentId);
  redirect("/dashboard");
}

export async function duplicateAssessmentAction(assessmentId: string) {
  const { session } = await assertOwner(assessmentId);
  const newAssessment = duplicateAssessment(assessmentId, session.user.id);
  if (!newAssessment) throw new Error("Failed to duplicate");
  redirect(`/dashboard/assessments/${newAssessment.id}`);
}
