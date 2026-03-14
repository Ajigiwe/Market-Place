import { db } from "./lib/db";
import { categories } from "./lib/schema";

async function seed() {
  console.log("Seeding categories...");
  await db.insert(categories).values([
    { id: "1", name: "Electronics", slug: "electronics" },
    { id: "2", name: "Clothing", slug: "clothing" },
    { id: "3", name: "Home & Garden", slug: "home-and-garden" },
    { id: "4", name: "Digital Services", slug: "digital-services" },
  ]).onConflictDoNothing();
  console.log("Seeding finished!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
