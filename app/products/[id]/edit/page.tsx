import { db } from "@/lib/db";
import { products, categories } from "@/lib/schema";
import { updateProduct } from "@/lib/actions";
import { protectRole } from "@/lib/auth-utils";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Box, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await protectRole(["ADMIN", "SELLER"]);
  const { id } = await params;
  
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!product) notFound();

  const allCategories = await db.select().from(categories);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <nav className="mb-8">
        <Link
          href="/dashboard/seller"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </nav>

      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Edit Product</h1>
        <p className="text-muted-foreground text-sm">
          Update existing item details. Accurate information ensures the best experience for your buyers.
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <form 
          action={async (formData) => {
            "use server";
            await updateProduct(product.id, formData);
          }} 
          className="p-8 space-y-8"
        >
          <input type="hidden" name="id" value={product.id} />
          
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Product Name</label>
              <input
                id="name"
                name="name"
                defaultValue={product.name}
                required
                className="block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                defaultValue={product.description || ""}
                required
                rows={4}
                className="block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm resize-y"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-foreground mb-2">Product Image (Optional - leave blank to keep current)</label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">Price (GH₵)</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={product.price}
                  required
                  className="block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-foreground mb-2">Stock Quantity</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  defaultValue={product.stock}
                  required
                  className="block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-foreground mb-2">Category</label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={product.categoryId || ""}
                required
                className="block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              >
                {allCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
