import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    // Get user ID from server-side session (more reliable)
    const session = await auth();
    const userId = session?.user?.id || (session?.user as any)?.id;

    if (!userId) {
      // Fallback: try to get from request body
      const body = await req.json().catch(() => ({}));
      const bodyUserId = body.userId;
      
      if (!bodyUserId) {
        // Last resort: look up user by email
        const email = session?.user?.email;
        if (email) {
          const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
          if (user) {
            await db.update(users).set({ role: "SELLER" }).where(eq(users.id, user.id));
            return NextResponse.json({ success: true });
          }
        }
        return NextResponse.json({ error: "Could not identify user" }, { status: 400 });
      }
      
      await db.update(users).set({ role: "SELLER" }).where(eq(users.id, bodyUserId));
      return NextResponse.json({ success: true });
    }

    await db
      .update(users)
      .set({ role: "SELLER" })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
