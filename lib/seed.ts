import { db } from "./db";
import { categories, users, products } from "./schema";
import { randomUUID } from "node:crypto";

async function seed() {
  console.log("Seeding data...");

  // 1. Seed Admin User
  const adminId = randomUUID();
  await db.insert(users).values({
    id: adminId,
    name: "Super Admin",
    email: "admin@marketplace.com",
    password: "admin123", // Plain text to match auth logic
    role: "ADMIN",
    status: "ACTIVE",
  }).onConflictDoNothing();
  console.log("- Admin user created (admin@marketplace.com / admin123)");

  // 2. Seed Categories
  const categoryData = [
    { id: "cat_1", name: "Electronics", slug: "electronics" },
    { id: "cat_2", name: "Clothing", slug: "clothing" },
    { id: "cat_3", name: "Home & Garden", slug: "home-and-garden" },
    { id: "cat_4", name: "Digital Services", slug: "digital-services" },
  ];

  for (const cat of categoryData) {
    await db.insert(categories).values(cat).onConflictDoNothing();
  }
  console.log("- Categories seeded");

  // 3. Seed Mock Products
  const productData = [
    {
      id: randomUUID(),
      name: "Premium Wireless Headphones",
      description: "High-fidelity audio with noise cancellation technology.",
      price: 1299.99,
      stock: 50,
      categoryId: "cat_1",
      sellerId: adminId,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    },
    {
      id: randomUUID(),
      name: "Minimalist Leather Watch",
      description: "Elegant design with genuine Italian leather strap.",
      price: 450.00,
      stock: 25,
      categoryId: "cat_2",
      sellerId: adminId,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    },
    {
      id: randomUUID(),
      name: "Smart Home Assistant",
      description: "Voice-controlled hub for your connected home devices.",
      price: 890.50,
      stock: 100,
      categoryId: "cat_1",
      sellerId: adminId,
      image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&q=80",
    },
  ];

  for (const prod of productData) {
    await db.insert(products).values(prod as any).onConflictDoNothing();
  }
  console.log("- Mock products seeded");

  console.log("Seeding finished successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
