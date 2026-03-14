"use server";

import { db } from "./db";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = "BUYER";

  if (!name || !email || !password) {
    throw new Error("Missing credentials");
  }

  // Check if user already exists
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    throw new Error("Identity already registered");
  }

  // Create user (Note: Using plain text password to match existing auth logic)
  await db.insert(users).values({
    id: randomUUID(),
    name,
    email,
    password,
    role: role as any,
  });

  redirect("/api/auth/signin?callbackUrl=/");
}

export async function upgradeToSeller(userId: string) {
  await db
    .update(users)
    .set({ role: "SELLER" })
    .where(eq(users.id, userId));
  
  redirect("/sell");
}
