import { db } from "@/lib/db";
import { products, categories, users, reviews } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import ReviewForm from "@/components/ReviewForm";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const [product] = await db
    .select({
      product: products,
      category: categories,
      seller: users,
    })
    .from(products)
    .where(eq(products.id, id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(users, eq(products.sellerId, users.id))
    .limit(1);

  if (!product) {
    notFound();
  }

  const productReviews = await db
    .select({
      review: reviews,
      user: users,
    })
    .from(reviews)
    .where(eq(reviews.productId, id))
    .leftJoin(users, eq(reviews.userId, users.id))
    .orderBy(desc(reviews.createdAt));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <nav className="mb-10">
        <Link
          href="/products"
          className="text-sm font-bold text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
        >
          ← Back to collection
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
        {/* Product Image */}
        <div className="aspect-[4/5] bg-card rounded-[40px] border border-border shadow-sm flex items-center justify-center p-16 overflow-hidden relative">
          {product.product.image ? (
             <img src={product.product.image} alt={product.product.name} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full bg-muted rounded-3xl" />
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col h-full pt-4">
          <div className="mb-8">
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
              {product.category?.name || "General"}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-2">
              {product.product.name}
            </h1>
            <p className="text-3xl font-bold text-foreground tracking-tight">
              ${product.product.price.toFixed(2)}
            </p>
          </div>

          <div className="mb-10 flex items-center gap-2 text-yellow-400">
             <span className="text-sm font-bold text-foreground mr-2">4.8</span>
             {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
             <span className="text-sm font-medium text-muted-foreground ml-2">({productReviews.length} Reviews)</span>
          </div>

          <div className="mb-12 space-y-8">
            <div className="p-6 bg-muted rounded-3xl border border-border">
              <h3 className="text-sm font-bold text-foreground mb-3">Product Description</h3>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {product.product.description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
              <div>
                <p className="text-[10px] uppercase font-black text-muted-foreground/40 tracking-widest mb-1">Seller</p>
                <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                   <div className="w-5 h-5 rounded-full bg-muted" />
                   {product.seller?.name || "Independent"}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-muted-foreground/40 tracking-widest mb-1">Stock status</p>
                <p className={`text-sm font-bold ${product.product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                   {product.product.stock > 0 ? `Available (${product.product.stock})` : "Out of Stock"}
                </p>
              </div>
            </div>
          </div>

          <AddToCartButton 
            product={product.product} 
            disabled={product.product.stock === 0} 
            className="w-full !py-3.5 sm:!py-5 !rounded-full !text-xs sm:!text-sm !font-black !shadow-2xl !shadow-primary/10 transition-all active:scale-[0.98]"
          />
        </div>
      </div>

      {/* Modern Reviews Section */}
      <div className="pt-24 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between gap-16">
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight mb-12 text-foreground">Customer Feedback / {productReviews.length}</h2>
            
            <div className="space-y-8 mb-24">
              {productReviews.length === 0 ? (
                <div className="p-10 bg-muted rounded-[32px] text-center border border-border">
                  <p className="text-muted-foreground font-medium">Be the first to share your thoughts on this selection.</p>
                </div>
              ) : (
                productReviews.map(({ review, user }) => (
                  <div key={review.id} className="p-8 bg-card rounded-[32px] border border-border shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between items-start gap-4 sm:gap-0 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs uppercase text-foreground">
                          {user?.name?.[0] || "A"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground leading-none mb-1">{user?.name || "Unverified User"}</p>
                          <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">
                            {review.createdAt?.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-yellow-400 text-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-medium text-sm">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <aside className="w-full lg:w-[400px] shrink-0">
             <div className="sticky top-32 p-1 bg-primary rounded-[40px]">
                <ReviewForm productId={id} />
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
