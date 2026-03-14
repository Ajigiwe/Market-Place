"use server";

import { db } from "@/lib/db";
import { reviews } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { protectRole } from "./auth-utils";

export async function createReview(productId: string, rating: number, comment: string) {
  const session = await protectRole(["BUYER", "SELLER", "ADMIN"]);

  await db.insert(reviews).values({
    id: crypto.randomUUID(),
    userId: session.user?.id as string,
    productId,
    rating,
    comment,
  });

  revalidatePath(`/products/${productId}`);
}
