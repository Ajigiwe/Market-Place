import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import { protectRole } from "@/lib/auth-utils";
import { createProduct } from "@/lib/actions";
import Link from "next/link";
import { ArrowLeft, Sparkles, Box, ShieldCheck, Zap } from "lucide-react";

export default async function NewProductPage() {
  await protectRole(["ADMIN", "SELLER"]);
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Add New Product</h1>
        <p className="text-muted-foreground text-sm">
          List new items in the collection. Accurate details help buyers find what they're looking for.
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <form action={createProduct} className="p-8 space-y-8">
          
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Product Name</label>
              <input
                id="name"
                name="name"
                required
                placeholder="e.g. Handmade Ceramic Mug"
                className="block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder="Describe the unique features of this item..."
                className="block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm resize-y"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-foreground mb-2">Product Image (Optional)</label>
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
                  required
                  placeholder="0.00"
                  className="block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-foreground mb-2">Stock Quantity</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  required
                  placeholder="0"
                  className="block w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-foreground mb-2">Category</label>
              <select
                id="categoryId"
                name="categoryId"
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
              Publish Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
