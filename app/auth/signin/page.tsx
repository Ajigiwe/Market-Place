"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError("Invalid credentials. Access denied.");
    } else if (result?.url) {
      window.location.href = result.url;
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[400px] bg-card rounded-[32px] p-6 sm:p-8 border border-border shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mb-1 uppercase italic">Welcome Back</h1>
          <p className="text-muted-foreground text-xs font-medium">Sign in to access the platform.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 text-destructive text-[10px] font-black uppercase tracking-widest rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[9px] uppercase tracking-widest font-black text-muted-foreground/60 pl-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="HELLO@EXAMPLE.COM"
              className="w-full bg-muted text-foreground border border-border rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-ring transition-all text-sm font-medium placeholder:text-muted-foreground/30"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[9px] uppercase tracking-widest font-black text-muted-foreground/60 pl-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-muted text-foreground border border-border rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-ring transition-all text-sm font-medium placeholder:text-muted-foreground/30"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10 transition-all active:scale-95"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground font-medium">
            New to the platform?{" "}
            <Link href="/auth/signup" className="text-primary font-black uppercase tracking-widest hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
