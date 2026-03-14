"use client";

import { useCart } from "@/lib/store";
import { useToast } from "@/lib/toast-store";

export default function AddToCartButton({ 
  product, 
  disabled, 
  className = "" 
}: { 
  product: any; 
  disabled?: boolean;
  className?: string;
}) {
  const addItem = useCart((state: any) => state.addItem);
  const addToast = useToast((state: any) => state.addToast);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    addToast("item added to cart");
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled}
      className={`px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none ${className}`}
    >
      {disabled ? "Sold Out" : "Add to Cart"}
    </button>
  );
}
