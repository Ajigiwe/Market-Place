"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/lib/store";
import { ShoppingBag, LogOut, UserPlus, LogIn, Package, LayoutGrid, Store, Search, User, Menu, X, ShieldAlert } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const items = useCart((state) => state.items);
  const cartIconCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-10">
          <Link href="/" className="text-xl font-black tracking-tighter text-foreground">
            Market<span className="text-primary">Place</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
        
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-3">
          <Link href="/cart" className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Cart</span>
            {cartIconCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center rounded-full shadow-lg">
                {cartIconCount}
              </span>
            )}
          </Link>
          
          <div className="hidden sm:block w-px h-6 bg-border mx-1" />

          {session ? (
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <Link
                href="/dashboard/buyer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </Link>
              {(session?.user as any)?.role === "ADMIN" && (
                <Link
                  href="/dashboard/admin"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-primary hover:bg-primary/10 transition-all border border-primary/20"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Up</span>
              </Link>
              <Link
                href="/auth/signin"
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-sm transition-all hover:opacity-90 active:scale-95"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
            </div>
          )}

          {/* Hamburger Menu Toggle (Mobile) */}
          <button 
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors ml-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-4 shadow-xl">
          <div className="flex flex-col gap-2">
            <Link 
              href="/products" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-all"
            >
              <Search className="w-4 h-4" /> Browse Products
            </Link>
            {(session?.user as any)?.role === "SELLER" || (session?.user as any)?.role === "ADMIN" ? (
              <Link 
                href="/dashboard/seller" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-all"
              >
                <Store className="w-4 h-4" /> Seller Dashboard
              </Link>
            ) : (
              <Link 
                href="/sell" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-all"
              >
                <Store className="w-4 h-4" /> Start Selling
              </Link>
            )}
            
            <div className="h-px bg-border my-2" />

            {session ? (
              <>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-all"
                >
                  <User className="w-4 h-4" /> Profile
                </Link>
                <Link
                  href="/dashboard/buyer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-all"
                >
                  <Package className="w-4 h-4" /> Orders
                </Link>
                {(session?.user as any)?.role === "ADMIN" && (
                  <Link 
                    href="/dashboard/admin" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 transition-all border border-primary/20"
                  >
                    <ShieldAlert className="w-4 h-4" /> Super Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all w-full text-left"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-all"
                >
                  <UserPlus className="w-4 h-4" /> Sign Up
                </Link>
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-sm transition-all"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
