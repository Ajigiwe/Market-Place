"use server";

import { db } from "@/lib/db";
import { products, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { protectRole } from "./auth-utils";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function createProduct(formData: FormData) {
  const session = await protectRole(["ADMIN", "SELLER"]);

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;
  const imageFile = formData.get("image") as File | null;
  
  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {}
    
    const filename = `${crypto.randomUUID()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);
    imageUrl = `/uploads/${filename}`;
  }

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
  const imageFile = formData.get("image") as File | null;

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {}
    
    const filename = `${crypto.randomUUID()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);
    imageUrl = `/uploads/${filename}`;
  }

  const updateData: any = { name, description, price, stock, updatedAt: new Date() };
  if (imageUrl) {
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
