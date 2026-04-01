"use server";

import { getSession } from "@/lib/auth-session";
import { createCourse } from "@/lib/courses";

export async function createCourseAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.user.role !== "recruiter") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || undefined;

  if (!title?.trim()) {
    throw new Error("Title is required");
  }

  const course = createCourse(
    session.user.id,
    title.trim(),
    description?.trim(),
  );
  return { id: course.id };
}
