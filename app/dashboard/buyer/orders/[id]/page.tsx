import { getOrderDetail } from "@/lib/order-actions";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const { id } = await params;
  let order;
  try {
    order = await getOrderDetail(id);
  } catch (e) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <nav className="mb-8 pl-1">
        <Link 
          href="/dashboard/buyer" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
        >
          &larr; Back to Order History
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 bg-card rounded-lg border border-border">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 gap-4 border-b border-border pb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">Order Details</h1>
                <p className="text-muted-foreground text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider">
                  {order.status}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {(order.orderItems as any[]).map((item: any) => (
                <div key={item.id} className="flex gap-4 items-center border-b border-border/50 pb-6 last:border-0 last:pb-0">
                  <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-sm mb-1">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} &times; GH₵{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground text-sm">GH₵{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-border">
               <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                    <p className="text-2xl font-bold text-foreground">GH₵{order.total.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt as Date).toLocaleDateString()}
                  </p>
               </div>
            </div>
          </div>
          
          <div className="p-8 bg-muted/30 rounded-lg border border-border">
             <h3 className="text-sm font-semibold text-foreground mb-4">Shipping Information</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                   <p className="text-muted-foreground mb-1">Method</p>
                   <p className="font-medium text-foreground">Standard Delivery</p>
                </div>
                <div>
                   <p className="text-muted-foreground mb-1">Estimated Arrival</p>
                   <p className="font-medium text-foreground">3 - 5 Business Days</p>
                </div>
             </div>
          </div>
        </div>

        <aside className="space-y-6">
           <div className="p-6 bg-card rounded-lg border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">GH₵{order.total.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-muted-foreground italic">Included</span>
                 </div>
                 <div className="pt-3 border-t border-border flex justify-between items-end">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-lg font-bold text-foreground">GH₵{order.total.toFixed(2)}</span>
                 </div>
              </div>
            <Link 
              href={`/orders/${order.id}/invoice`}
              target="_blank"
              className="w-full block text-center py-2.5 bg-secondary text-secondary-foreground rounded-md font-medium text-sm transition-colors hover:bg-secondary/80 focus:ring-2 focus:ring-ring focus:outline-none"
            >
               Download Invoice
            </Link>
           </div>
           
           <div className="p-6 bg-muted/30 rounded-lg border border-border text-center">
              <p className="text-sm text-muted-foreground">
                Need help? Contact support and reference order <span className="font-medium">#{order.id.slice(0, 8).toUpperCase()}</span>.
              </p>
           </div>
        </aside>
      </div>
    </div>
  );
}
