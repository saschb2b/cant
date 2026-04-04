"use server";

import { getSession } from "@/lib/auth-session";
import { createAssessment } from "@/lib/assessments";

export async function createAssessmentAction(formData: FormData) {
  const session = await getSession();
  if (session?.user.role !== "recruiter") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || undefined;

  if (!title.trim()) {
    throw new Error("Title is required");
  }

  const assessment = createAssessment(
    session.user.id,
    title.trim(),
    description?.trim(),
  );
  return { id: assessment.id };
}
