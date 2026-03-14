"use client";

import { useCart } from "@/lib/store";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, Sparkles, ShieldCheck } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
        
        <div className="w-20 h-20 glass-effect rounded-3xl flex items-center justify-center mb-10 shadow-xl">
           <ShoppingBag className="w-10 h-10 text-primary/40" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground mb-4 uppercase leading-none">Your Bag is Empty</h1>
        <p className="text-sm text-muted-foreground mb-12 max-w-xs font-medium leading-relaxed">
          Looks like you haven't added anything to your bag yet. Let's find something special for you.
        </p>
        <Link
          href="/products"
          className="pill-btn inline-flex items-center gap-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background Ornamentation */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 bg-dot-pattern opacity-5" />
      <div className="absolute top-1/4 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-24 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-16 gap-6">
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
              <Sparkles className="w-3 h-3" /> Exclusive Collection
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase leading-none">Your Bag</h1>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hidden sm:block">
            {items.length} items selected
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-border/50 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
                  <div className="w-14 h-14 sm:w-24 sm:h-24 bg-muted/30 rounded-2xl sm:rounded-[32px] flex flex-shrink-0 items-center justify-center relative overflow-hidden group-hover:bg-primary/5 transition-colors">
                    <ShoppingBag className="w-5 h-5 sm:w-8 sm:h-8 text-muted-foreground/20 group-hover:text-primary/20 transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-lg font-black tracking-tight uppercase mb-0.5 sm:mb-1 leading-tight truncate">{item.name}</h3>
                    <p className="text-[9px] sm:text-xs font-bold text-muted-foreground/60 tracking-wider">Unit: GH₵{item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-3 sm:gap-12 mt-1 sm:mt-0">
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                    <div className="flex items-center gap-2.5 sm:gap-6 bg-white rounded-full px-2.5 sm:px-5 py-1.5 sm:py-2.5 border border-border shadow-sm group-hover:border-primary/20 transition-all">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                      <span className="text-[10px] sm:text-xs font-black w-4 sm:w-6 text-center tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-8 ml-auto sm:ml-0">
                      <span className="text-xs sm:text-base font-black tracking-tighter tabular-nums text-right">GH₵{(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 transition-all flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Link 
              href="/products" 
              className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors mt-8"
            >
              <ArrowLeft className="w-3 h-3" />
              Continue Shopping
            </Link>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="glass-effect p-10 rounded-[48px] shadow-2xl relative overflow-hidden group">
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                
                <div className="relative z-10">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-10">Summary</h2>
                  
                  <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-center group/row">
                      <span className="text-[11px] font-bold text-muted-foreground group-hover/row:text-primary transition-colors">Subtotal</span>
                      <span className="text-sm font-black tabular-nums">GH₵{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center group/row">
                      <span className="text-[11px] font-bold text-muted-foreground group-hover/row:text-primary transition-colors">Delivery</span>
                      <span className="text-[11px] font-black uppercase tracking-widest text-primary">Free</span>
                    </div>
                    <div className="pt-6 border-t border-border flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-[0.2em]">Total</span>
                      <span className="text-4xl font-black tracking-tighter text-primary drop-shadow-sm tabular-nums">GH₵{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="vibrant-shadow block w-full py-3.5 sm:py-5 bg-primary text-primary-foreground rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:scale-[1.03] hover:brightness-110 active:scale-[0.97] text-center relative overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    Checkout
                  </Link>

                  <div className="mt-8 flex items-center justify-center gap-4 opacity-30">
                     <ShieldCheck className="w-4 h-4 text-primary" />
                     <span className="text-[8px] font-black uppercase tracking-[0.2em]">Authenticity Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
