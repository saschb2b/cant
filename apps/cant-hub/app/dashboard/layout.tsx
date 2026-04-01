import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in?callbackUrl=/dashboard");
  }

  if (!session.user.role) {
    redirect("/onboarding");
  }

  if (session.user.role !== "recruiter") {
    redirect("/");
  }

  return <>{children}</>;
}
