"use client";

import { useToast } from "@/lib/toast-store";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Toaster() {
  const { toasts, removeToast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-[280px] px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`group relative flex items-center gap-2.5 p-3 rounded-xl border shadow-xl transition-all duration-500 animate-in fade-in slide-in-from-top-2 ${
            toast.type === "success" 
              ? "bg-primary backdrop-blur-md text-white border-white/10" 
              : toast.type === "error"
              ? "bg-destructive backdrop-blur-md text-white border-white/10"
              : "bg-slate-900/95 backdrop-blur-md text-white border-white/10"
          }`}
        >
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            {toast.type === "success" && <CheckCircle2 className="w-3.5 h-3.5 !text-white" />}
            {toast.type === "error" && <AlertCircle className="w-3.5 h-3.5 !text-white" />}
            {toast.type === "info" && <Info className="w-3.5 h-3.5 !text-white" />}
          </div>
          
          <p className="flex-1 text-[11px] font-black tracking-wide uppercase leading-none !text-white py-0.5">
            {toast.message}
          </p>

          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded-lg opacity-60 group-hover:opacity-100 transition-opacity hover:bg-white/20 !text-white"
          >
            <X className="w-3 h-3" />
          </button>
          
          {/* Progress bar effect */}
          <div className="absolute bottom-0 left-0 h-0.5 bg-white/30 rounded-full animate-progress-shrink w-full" />
        </div>
      ))}
    </div>
  );
}
