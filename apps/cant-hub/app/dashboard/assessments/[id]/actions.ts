"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-session";
import {
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  type AssessmentStatus,
} from "@/lib/assessments";

async function assertOwner(assessmentId: string) {
  const session = await getSession();
  if (!session || session.user.role !== "recruiter") {
    throw new Error("Unauthorized");
  }
  const assessment = getAssessmentById(assessmentId);
  if (!assessment || assessment.userId !== session.user.id) {
    throw new Error("Not found");
  }
  return assessment;
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
