import { db } from "@/lib/db";
import { products, categories } from "@/lib/schema";
import Link from "next/link";
import { ShoppingBag, Store, Shield, Truck, CreditCard, Sparkles, FolderOpen, ArrowRight, Mail, Monitor, Home as HomeIcon, Zap, Palette, LayoutGrid } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

export default async function Home() {
  const latestProducts = await db.select().from(products).limit(4);
  const featuredCategories = await db.select().from(categories).limit(4);

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="relative px-6 pt-20 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-8 px-4">
          <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" /> Discover quality products
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.95] max-w-4xl">
            Shop smarter,<br />
            <span className="text-primary italic">sell easier.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed font-medium">
            A marketplace where verified sellers meet engaged buyers. Browse premium products or start your own store today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-4 w-full sm:w-auto">
            <Link href="/products" className="pill-btn !py-3.5 !px-8 inline-flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
              <ShoppingBag className="w-4 h-4" /> Shop Now
            </Link>
            <Link href="/sell" className="px-8 py-3.5 bg-background border-2 border-border rounded-full font-black text-[10px] uppercase tracking-widest text-foreground transition-all hover:bg-muted hover:border-primary/20 hover:-translate-y-1 active:scale-95 shadow-lg inline-flex items-center justify-center gap-3">
              <Store className="w-4 h-4" /> Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 pt-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Categories</h2>
          </div>
          <p className="text-muted-foreground text-sm mb-10">Browse by department</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCategories.map((cat, i) => {
              const styles = [
                { bg: "bg-blue-50 dark:bg-blue-950/30", icon: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400", border: "border-blue-100 dark:border-blue-900/30" },
                { bg: "bg-purple-50 dark:bg-purple-950/30", icon: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400", border: "border-purple-100 dark:border-purple-900/30" },
                { bg: "bg-emerald-50 dark:bg-emerald-950/30", icon: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-900/30" },
                { bg: "bg-amber-50 dark:bg-amber-950/30", icon: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400", border: "border-amber-100 dark:border-amber-900/30" },
              ];
              const style = styles[i % styles.length];
              const icons = [
                <Monitor key="m" className="w-6 h-6" />,
                <Palette key="s" className="w-6 h-6" />,
                <HomeIcon key="h" className="w-6 h-6" />,
                <Zap key="z" className="w-6 h-6" />,
              ];
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  className={`group h-44 rounded-3xl overflow-hidden ${style.bg} p-6 flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1 border ${style.border}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${style.icon}`}>
                    {icons[i % icons.length]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{cat.name}</h3>
                    <p className="text-xs font-medium text-muted-foreground mt-1 group-hover:text-primary transition-colors flex items-center gap-1">
                      Browse <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Products */}
      <section className="px-6 pt-4 pb-24 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold tracking-tight text-foreground">New Arrivals</h2>
              </div>
              <p className="text-muted-foreground text-sm mt-1">Just added this week</p>
            </div>
            <Link href="/products" className="text-sm font-bold text-primary hover:underline inline-flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-4">
            {latestProducts.map((product) => (
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
        </div>
      </section>

      {/* Why Us */}
      <section className="px-6 py-20 bg-muted/50 border-y border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">Verified Sellers</h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">Every seller passes ID verification to keep the marketplace trusted.</p>
              </div>
           </div>
           <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">Free Shipping</h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">All orders ship free with tracking. No surprises at checkout.</p>
              </div>
           </div>
           <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">Secure Payments</h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">Encrypted transactions protect every purchase you make.</p>
              </div>
           </div>
        </div>
      </section>



      {/* Newsletter */}
      <section className="px-6 py-20 bg-muted/50 border-t border-border">
         <div className="max-w-md mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Stay Updated</h2>
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-6">Get notified about new products and deals.</p>
            <form className="flex flex-col sm:flex-row gap-3">
               <input 
                 type="email" 
                 placeholder="your@email.com" 
                 className="flex-1 bg-background text-foreground border border-border rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-ring transition-all text-sm placeholder:text-muted-foreground/30"
               />
               <button className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/10">
                 Subscribe
               </button>
            </form>
         </div>
      </section>
    </main>
  );
}
