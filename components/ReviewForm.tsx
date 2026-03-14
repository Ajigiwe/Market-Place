"use client";

import { useState } from "react";
import { createReview } from "@/lib/review-actions";

export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createReview(productId, rating, comment);
      setComment("");
      alert("Your feedback has been recorded.");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-card rounded-[32px] border border-border shadow-2xl">
      <h3 className="text-lg font-bold text-foreground mb-6 pr-4">Share your Experience</h3>
      
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/60 mb-4">Rating</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl transition-all hover:scale-110 ${star <= rating ? "text-yellow-400" : "text-muted"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows={3}
          className="w-full bg-muted text-foreground border border-border rounded-2xl p-5 text-sm font-medium focus:ring-2 focus:ring-ring outline-none transition-all placeholder:text-muted-foreground/30"
          placeholder="Tell other buyers what you think..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/10 transition-all active:scale-[0.98] disabled:opacity-30"
      >
        {isSubmitting ? "Submitting..." : "Post Review"}
      </button>
    </form>
  );
}
