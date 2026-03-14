"use client";

export default function PrintButton() {
  return (
    <div className="mt-12 text-center no-print">
      <button 
        onClick={() => window.print()}
        className="px-8 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-full hover:bg-primary transition-all shadow-xl shadow-slate-200"
      >
        Print or Save as PDF
      </button>
    </div>
  );
}
