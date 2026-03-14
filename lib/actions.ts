"use server";

import { db } from "@/lib/db";
import { products, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { protectRole } from "./auth-utils";

export async function createProduct(formData: FormData) {
  const session = await protectRole(["ADMIN", "SELLER"]);

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;
  const imageUrl = formData.get("image") as string | null;

  await db.insert(products).values({
    id: crypto.randomUUID(),
    name,
    description,
    price,
    stock,
    categoryId,
    image: imageUrl,
    sellerId: session.user?.id as string,
  });

  revalidatePath("/products");
  revalidatePath("/dashboard/seller");
}

export async function updateProduct(id: string, formData: FormData) {
  const session = await protectRole(["ADMIN", "SELLER"]);

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const imageUrl = formData.get("image") as string | null;

  const updateData: any = { 
    name, 
    description, 
    price, 
    stock, 
    updatedAt: new Date() 
  };
  
  if (imageUrl !== undefined) {
    updateData.image = imageUrl;
  }

  await db
    .update(products)
    .set(updateData)
    .where(eq(products.id, id));

  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
}

export async function deleteProduct(id: string) {
  await protectRole(["ADMIN", "SELLER"]);

  await db.delete(products).where(eq(products.id, id));

  revalidatePath("/products");
}

export async function updateProfile(formData: FormData) {
  const session = await protectRole(["BUYER", "SELLER", "ADMIN"]);
  const name = formData.get("name") as string;
  
  await db
    .update(users)
    .set({ name, updatedAt: new Date() })
    .where(eq(users.id, session.user?.id as string));
    
  revalidatePath("/dashboard/profile");
}
