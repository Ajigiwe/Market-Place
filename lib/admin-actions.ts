"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { protectRole } from "@/lib/auth-utils";

export async function toggleUserStatus(userId: string, currentStatus: string) {
  try {
    await protectRole(["ADMIN"]);
    
    const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    
    await db
      .update(users)
      .set({ status: newStatus })
      .where(eq(users.id, userId));
      
    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle user status:", error);
    return { error: "Failed to update user status" };
  }
}
