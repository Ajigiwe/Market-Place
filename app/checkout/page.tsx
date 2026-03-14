"use client";

import { CreditCard, Banknote, ArrowLeft, ShieldCheck, Lock, Sparkles } from "lucide-react";
import { useCart } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/lib/toast-store";
import Link from "next/link";

import { createOrder } from "@/lib/order-actions";

export default function CheckoutPage() {
  const { clearCart, items } = useCart();
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const addToast = useToast((state: any) => state.addToast);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const order = await createOrder(items, total);
      clearCart();
      addToast("Order placed successfully!", "success");
      router.push("/dashboard/profile");
    } catch (error) {
      addToast("Failed to place order. Please try again.", "error");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 bg-dot-pattern opacity-5" />
      <div className="absolute -top-24 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 -left-12 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20 relative z-10">
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-6">
            <Link href="/cart" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all group overflow-hidden relative">
              <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform" />
              <ArrowLeft className="w-4 h-4 relative z-10" />
            </Link>
            <div>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">
                <Lock className="w-3 h-3" /> Secure Checkout
              </div>
              <h1 className="text-3xl font-black tracking-tight uppercase">Checkout</h1>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-16">
            {/* Shipping Section */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20">01</div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Shipping Address</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="group md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1.5 transition-colors group-focus-within:text-primary">Full Name</label>
                  <input required placeholder="John Doe" className="w-full bg-transparent border-b border-border py-2.5 text-sm font-bold focus:border-primary outline-none transition-colors px-0 rounded-none" />
                </div>
                <div className="group md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1.5 transition-colors group-focus-within:text-primary">Email Address</label>
                  <input required type="email" placeholder="john@example.com" className="w-full bg-transparent border-b border-border py-2.5 text-sm font-bold focus:border-primary outline-none transition-colors px-0 rounded-none" />
                </div>
                <div className="group md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1.5 transition-colors group-focus-within:text-primary">Street Address</label>
                  <input required placeholder="House No, Street Name" className="w-full bg-transparent border-b border-border py-2.5 text-sm font-bold focus:border-primary outline-none transition-colors px-0 rounded-none" />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1.5 transition-colors group-focus-within:text-primary">City</label>
                  <input required placeholder="Accra" className="w-full bg-transparent border-b border-border py-2.5 text-sm font-bold focus:border-primary outline-none transition-colors px-0 rounded-none" />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1.5 transition-colors group-focus-within:text-primary">Phone Number</label>
                  <input required placeholder="+233..." className="w-full bg-transparent border-b border-border py-2.5 text-sm font-bold focus:border-primary outline-none transition-colors px-0 rounded-none" />
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20">02</div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Payment Method</h2>
              </div>
              
              <div className="p-1 gap-4 rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent flex flex-col md:flex-row md:items-center justify-between group hover:border-primary/30 transition-all duration-500">
                <div className="flex items-center gap-5 p-4">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-primary/5 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
                    <Banknote className="w-6 h-6 text-primary relative z-10" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-foreground">Cash on Delivery</p>
                    <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] mt-0.5">Pay when you receive</p>
                  </div>
                </div>
                <div className="px-6 py-4 flex items-center gap-3">
                  <div className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/10">
                    Selected
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="glass-effect p-8 lg:p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Order Summary</h2>
                    <Sparkles className="w-4 h-4 text-primary/40" />
                  </div>
                  
                  <div className="space-y-8 mb-10 max-h-[260px] overflow-y-auto pr-4 scrollbar-none">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between items-start gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-xs font-black text-foreground truncate uppercase tracking-tight">{item.name}</p>
                          <p className="text-[9px] font-bold text-muted-foreground mt-1 flex items-center gap-2">
                             Quantity <span className="text-primary">{item.quantity}</span>
                          </p>
                        </div>
                        <span className="text-xs font-black text-foreground shrink-0 tabular-nums">GH₵{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4 pt-8 border-t border-border/50 mb-10">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground font-black uppercase tracking-widest">Delivery</span>
                      <span className="text-primary font-black uppercase">Free</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[13px] font-black uppercase tracking-[0.2em] text-foreground">Total</span>
                      <span className="text-4xl font-black text-primary tracking-tighter drop-shadow-sm tabular-nums">GH₵{total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="vibrant-shadow w-full py-3.5 sm:py-5 bg-primary text-primary-foreground rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] transition-all hover:scale-[1.03] hover:brightness-110 active:scale-[0.97] disabled:opacity-30 disabled:pointer-events-none group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </button>
                  
                  <div className="mt-8 flex items-center justify-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                     <ShieldCheck className="w-4 h-4 text-primary" />
                     <span className="text-[9px] font-black uppercase tracking-[0.2em]">Secure Encryption</span>
                  </div>
                </div>
              </div>

              {/* Secure Banner */}
              <div className="mt-6 flex items-center gap-4 px-6 opacity-30">
                <div className="h-[1px] flex-1 bg-border" />
                <div className="text-[8px] font-black uppercase tracking-[0.3em]">Marketplace 2026</div>
                <div className="h-[1px] flex-1 bg-border" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
