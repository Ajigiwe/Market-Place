import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function protectRole(roles: string[]) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const userRole = (session.user as any).role;

  if (!roles.includes(userRole)) {
    redirect("/"); // Or a "forbidden" page
  }

  return session;
}
