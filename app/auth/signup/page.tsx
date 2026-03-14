import { signUp } from "@/lib/auth-actions";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[400px] bg-card rounded-[32px] p-6 sm:p-8 border border-border shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mb-1 uppercase italic">Create Account</h1>
          <p className="text-muted-foreground text-xs font-medium">Join our curated marketplace today.</p>
        </div>

        <form action={signUp} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[9px] uppercase tracking-widest font-black text-muted-foreground/60 pl-1">Full Name</label>
            <input
              name="name"
              type="text"
              required
              placeholder="JONATHAN DOE"
              className="w-full bg-muted text-foreground border border-border rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-ring transition-all text-sm font-medium placeholder:text-muted-foreground/30"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[9px] uppercase tracking-widest font-black text-muted-foreground/60 pl-1">Email Address</label>
            <input
              name="email"
              type="email"
              required
              placeholder="HELLO@EXAMPLE.COM"
              className="w-full bg-muted text-foreground border border-border rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-ring transition-all text-sm font-medium placeholder:text-muted-foreground/30"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[9px] uppercase tracking-widest font-black text-muted-foreground/60 pl-1">Password</label>
            <input
              name="password"
              type="password"
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
              Create Profile
            </button>
          </div>
        </form>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground font-medium">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary font-black uppercase tracking-widest hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
