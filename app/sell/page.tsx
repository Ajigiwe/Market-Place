import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, Package, DollarSign, Store, Clock, Rocket, User } from "lucide-react";

export default async function SellLandingPage() {
  const session = await auth();
  
  if (!session) redirect("/auth/signin");

  const isSeller = (session.user as any).role === "SELLER" || (session.user as any).role === "ADMIN";

  if (isSeller) {
    redirect("/dashboard/seller");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold mb-8 inline-flex items-center gap-2">
            <Rocket className="w-3.5 h-3.5" /> Start Selling
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            Turn your products<br />
            <span className="text-primary">into profit.</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium mb-10 max-w-lg leading-relaxed">
            Verify your identity and start listing products in minutes. Reach thousands of buyers on our marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/sell/verify" 
              className="pill-btn !text-center inline-flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" /> Get Verified
            </Link>
            <Link 
              href="/products" 
              className="px-8 py-4 bg-background text-foreground rounded-full font-bold text-sm border border-border transition-all hover:bg-muted text-center"
            >
              Browse Products
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="bg-card rounded-[40px] border border-border/60 shadow-2xl p-8 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Store className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Seller Status</p>
                  <p className="text-sm font-bold text-foreground">Awaiting Activation</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-amber-500/20">
                <Clock className="w-3 h-3" /> Verification Pending
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Total Sales</p>
                  <p className="text-xl font-black text-foreground">GH₵0<span className="text-xs opacity-40">.00</span></p>
                </div>
                <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Active Products</p>
                  <p className="text-xl font-black text-foreground text-primary/40">0</p>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-foreground">Sample Product Listing</p>
                    <p className="text-[9px] text-muted-foreground">Draft • Electronics</p>
                  </div>
                </div>
                <div className="w-12 h-2 bg-primary/10 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-primary/30" />
                </div>
              </div>
            </div>

            <div className="py-4 border-t border-dashed border-border flex justify-between items-center opacity-60">
              <p className="text-[10px] font-medium text-muted-foreground italic">"Your store reaches 10k+ buyers..."</p>
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground/40">
                    <User className="w-3 h-3" />
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </div>
          
          <div className="absolute -bottom-6 -left-6 p-4 bg-card rounded-2xl shadow-xl border border-border">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                 <DollarSign className="w-4 h-4 text-green-600" />
               </div>
               <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Revenue Target</p>
                  <p className="text-xs font-bold text-foreground">GH₵5,000.00+</p>
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-card rounded-3xl border border-border shadow-sm transition-all hover:shadow-lg hover:shadow-primary/5">
           <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
             <Shield className="w-5 h-5 text-primary" />
           </div>
           <h3 className="text-base font-bold text-foreground mb-2">Verified Sellers</h3>
           <p className="text-sm text-muted-foreground font-medium leading-relaxed">Submit your ID and get verified instantly. We keep the marketplace safe for everyone.</p>
        </div>
        <div className="p-8 bg-card rounded-3xl border border-border shadow-sm transition-all hover:shadow-lg hover:shadow-primary/5">
           <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
             <Package className="w-5 h-5 text-primary" />
           </div>
           <h3 className="text-base font-bold text-foreground mb-2">Easy Listings</h3>
           <p className="text-sm text-muted-foreground font-medium leading-relaxed">Add products with a simple form. Set your price, upload photos, and go live.</p>
        </div>
        <div className="p-8 bg-card rounded-3xl border border-border shadow-sm transition-all hover:shadow-lg hover:shadow-primary/5">
           <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
             <DollarSign className="w-5 h-5 text-primary" />
           </div>
           <h3 className="text-base font-bold text-foreground mb-2">Track Sales</h3>
           <p className="text-sm text-muted-foreground font-medium leading-relaxed">Monitor orders, manage inventory, and grow your revenue from your seller dashboard.</p>
        </div>
      </div>
    </div>
  );
}
