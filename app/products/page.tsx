import { db } from "@/lib/db";
import { products, categories } from "@/lib/schema";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import { ShoppingBag, Search, Filter, Sparkles, LayoutGrid } from "lucide-react";
import { eq } from "drizzle-orm";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;
  
  // Find category by slug if filtering
  let activeCategoryId: string | undefined;
  if (categorySlug) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });
    activeCategoryId = category?.id;
  }

  // Fetch products (filtered if category exists)
  const allProducts = activeCategoryId
    ? await db.select().from(products).where(eq(products.categoryId, activeCategoryId))
    : await db.select().from(products);
    
  const allCategories = await db.select().from(categories);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-3">
            <ShoppingBag className="w-4 h-4" /> Marketplace
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Curated Collection
          </h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            Discover a handpicked selection of premium items. From electronics to everyday essentials, find exactly what you need.
          </p>
        </div>
        
        {/* Search/Filter Bar Placeholder */}
        <div className="w-full md:w-auto flex items-center gap-3">
          <div className="relative flex-1 md:w-80 group">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 group-focus-within:text-primary transition-colors pointer-events-none" />
             <input 
               placeholder="Search collection..." 
               style={{ paddingLeft: '64px' }}
               className="w-full pr-4 py-3.5 bg-background border-2 border-border/60 rounded-2xl text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-sm placeholder:text-muted-foreground/30"
             />
          </div>
          <button className="p-3.5 bg-background border-2 border-border/60 rounded-2xl hover:border-primary/40 hover:bg-muted/30 transition-all shadow-sm group">
            <Filter className="w-5 h-5 text-foreground/60 group-hover:text-primary transition-colors" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-2 scrollbar-none">
        <Link 
          href="/products"
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
            !categorySlug 
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" 
              : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
          }`}
        >
          All Items
        </Link>
        {allCategories.map(cat => (
          <Link 
            key={cat.id} 
            href={`/products?category=${cat.slug}`}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              categorySlug === cat.slug
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" 
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {allProducts.length === 0 ? (
        <div className="py-32 text-center bg-card rounded-[48px] border border-dashed border-border group overflow-hidden relative">
          <div className="relative z-10">
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
              <LayoutGrid className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">No products found in this category</h2>
            <p className="text-muted-foreground font-medium max-w-xs mx-auto">Try selecting a different category or browsing all items.</p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-4">
          {allProducts.map((product) => (
            <div key={product.id} className="group relative">
              <Link href={`/products/${product.id}`} className="block mb-1.5">
                <div className="aspect-square bg-card rounded-xl overflow-hidden border border-border shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-md flex items-center justify-center p-3 relative">
                   {product.image ? (
                     <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                   ) : (
                     <div className="w-full h-full bg-muted/10 rounded-lg transition-colors group-hover:bg-muted/30" />
                   )}
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-5 h-5 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-sm">
                        <Sparkles className="w-2.5 h-2.5 text-primary" />
                      </div>
                   </div>
                </div>
                <div className="mt-2 px-0.5">
                  <div className="flex justify-between items-start gap-1">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-1">{product.name}</h3>
                    <p className="text-primary font-black text-sm tracking-tighter">GH₵{product.price.toFixed(2).split('.')[0]}<span className="text-[10px] opacity-60">.{product.price.toFixed(2).split('.')[1]}</span></p>
                  </div>
                  <p className="text-muted-foreground text-[9px] font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-primary rounded-full" /> In Stock
                  </p>
                </div>
              </Link>
              <div className="px-0.5 flex justify-center">
                <AddToCartButton 
                  product={product as any} 
                  className="w-full sm:w-fit px-4 sm:px-8 !rounded-xl !py-1.5 sm:!py-2 !text-[9px] sm:!text-[10px] !font-black !uppercase !tracking-widest !shadow-none border border-border/50 hover:!bg-primary hover:!text-primary-foreground hover:!border-primary transition-all" 
                />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
