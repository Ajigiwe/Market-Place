"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, User, FileText, Hash, Store, Phone, CheckCircle, Loader2 } from "lucide-react";

export default function VerificationPage() {
  const { data: session, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/verify-seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id }),
      });

      if (res.ok) {
        await update({ role: "SELLER" });
        router.push("/sell");
      } else {
        alert("Verification failed. Please try again.");
        setIsSubmitting(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[420px] bg-card rounded-[32px] p-6 sm:p-8 border border-border shadow-sm">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mb-1 uppercase italic">Verify Identity</h1>
          <p className="text-muted-foreground font-medium text-[10px] uppercase tracking-wider">Quick verification to start selling.</p>
        </div>

        {isSubmitting ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verifying...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 pl-1">
                <User className="w-3 h-3" /> Full Name
              </label>
              <input
                name="fullName"
                type="text"
                required
                placeholder="AS SHOWN ON YOUR ID"
                className="w-full bg-muted text-foreground border border-border rounded-full px-5 py-2.5 outline-none focus:ring-2 focus:ring-ring transition-all font-medium placeholder:text-muted-foreground/30 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 pl-1">
                <FileText className="w-3 h-3" /> ID Type
              </label>
              <select
                name="idType"
                required
                className="w-full bg-muted text-foreground border border-border rounded-full px-5 py-2.5 outline-none focus:ring-2 focus:ring-ring transition-all font-medium text-xs appearance-none"
              >
                <option value="national_id">National ID</option>
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver&apos;s License</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 pl-1">
                <Hash className="w-3 h-3" /> ID Number
              </label>
              <input
                name="idNumber"
                type="text"
                required
                pattern="GH-\d{6}-\d{1}"
                title="Format must be GH-xxxxxx-x (e.g. GH-123456-7)"
                placeholder="GH-123456-7"
                className="w-full bg-muted text-foreground border border-border rounded-full px-5 py-2.5 outline-none focus:ring-2 focus:ring-ring transition-all font-medium placeholder:text-muted-foreground/30 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 pl-1">
                <Store className="w-3 h-3" /> Store Name
              </label>
              <input
                name="businessName"
                type="text"
                required
                placeholder="YOUR DISPLAY NAME"
                className="w-full bg-muted text-foreground border border-border rounded-full px-5 py-2.5 outline-none focus:ring-2 focus:ring-ring transition-all font-medium placeholder:text-muted-foreground/30 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 pl-1">
                <Phone className="w-3 h-3" /> Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                required
                placeholder="+233 XX XXX XXXX"
                className="w-full bg-muted text-foreground border border-border rounded-full px-5 py-2.5 outline-none focus:ring-2 focus:ring-ring transition-all font-medium placeholder:text-muted-foreground/30 text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Submit & Verify
              </button>
            </div>

            <p className="text-[9px] text-muted-foreground/40 text-center font-bold uppercase tracking-tighter">
              Instant Approval • Secured Encryption
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
