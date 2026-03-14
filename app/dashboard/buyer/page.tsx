import { getBuyerOrders } from "@/lib/order-actions";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";

export default async function BuyerDashboard() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  
  const orders = await getBuyerOrders();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12 border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Order History</h1>
        <p className="text-muted-foreground">View and track your previous orders.</p>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center bg-muted/30 rounded-lg border border-border">
           <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
           <p className="text-muted-foreground mb-6">You have no orders yet.</p>
           <Link 
             href="/products" 
             className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:opacity-90 transition-opacity"
           >
             Browse Products
           </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link 
              key={order.id} 
              href={`/dashboard/buyer/orders/${order.id}`}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-card border border-border rounded-lg hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-center justify-center w-12 h-12 bg-muted rounded-md text-muted-foreground font-medium">
                   <Package className="w-5 h-5 mb-1" />
                   <span className="text-[10px] uppercase">{order.orderItems.length} items</span>
                </div>
                <div>
                   <h3 className="font-semibold text-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                   <p className="text-sm text-muted-foreground mt-1">
                     Placed on {order.createdAt?.toLocaleDateString()}
                   </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-8 border-t border-border pt-4 md:border-t-0 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-xs text-muted-foreground mb-1">Total</p>
                  <p className="font-semibold text-foreground">GH₵{order.total.toFixed(2)}</p>
                </div>
                <div>
                   <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full uppercase tracking-wider">
                     {order.status}
                   </span>
                </div>
                <div className="hidden md:flex text-muted-foreground">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

