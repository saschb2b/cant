"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-session";
import {
  getCourseById,
  updateCourse,
  deleteCourse,
  type CourseStatus,
} from "@/lib/courses";

async function assertOwner(courseId: string) {
  const session = await getSession();
  if (!session || session.user.role !== "recruiter") {
    throw new Error("Unauthorized");
  }
  const course = getCourseById(courseId);
  if (!course || course.userId !== session.user.id) {
    throw new Error("Not found");
  }
  return course;
}

export async function updateCourseStatusAction(
  courseId: string,
  status: CourseStatus,
) {
  await assertOwner(courseId);
  updateCourse(courseId, { status });
}

export async function deleteCourseAction(courseId: string) {
  await assertOwner(courseId);
  deleteCourse(courseId);
  redirect("/dashboard");
}
