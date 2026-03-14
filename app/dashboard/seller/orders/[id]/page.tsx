import { db } from "@/lib/db";
import { orders, orderItems, products, users } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { protectRole } from "@/lib/auth-utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { updateOrderStatus } from "@/lib/order-actions";

export default async function SellerOrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await protectRole(["SELLER", "ADMIN"]);
  const { id } = await params;

  const [orderData] = await db
    .select({
      order: orders,
      buyer: users,
    })
    .from(orders)
    .where(eq(orders.id, id))
    .innerJoin(users, eq(orders.userId, users.id))
    .limit(1);

  if (!orderData) notFound();

  const sellerItems = await db
    .select({
      item: orderItems,
      product: products,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(
      and(
        eq(orderItems.orderId, id),
        eq(products.sellerId, session.user?.id as string)
      )
    );

  if (sellerItems.length === 0) notFound();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <nav className="mb-8 pl-1">
        <Link
          href="/dashboard/seller/orders"
          className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
        >
          &larr; Back to Orders
        </Link>
      </nav>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 p-6 bg-card border border-border rounded-lg">
        <div>
           <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-foreground">Order Details</h1>
           </div>
           <p className="text-muted-foreground text-sm">
             Buyer: <span className="font-medium text-foreground">{orderData.buyer.name}</span> &bull; Ref: #{orderData.order.id.slice(0, 8).toUpperCase()}
           </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
             <p className="text-xs text-muted-foreground mb-1">Status</p>
             <p className="font-semibold text-foreground uppercase tracking-wider">{orderData.order.status}</p>
          </div>
          {orderData.order.status !== "COMPLETED" && (
            <form action={updateOrderStatus.bind(null, orderData.order.id, "COMPLETED")}>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity">
                Mark Complete
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-foreground mb-4 pl-1">Order Items</h3>
            {sellerItems.map(({ item, product }: any) => (
              <div key={item.id} className="p-6 bg-card border border-border rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">{product.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="font-semibold text-foreground">GH₵{(item.quantity * item.price).toFixed(2)}</p>
                   <p className="text-xs text-muted-foreground mt-0.5">@ GH₵{item.price.toFixed(2)}/ea</p>
                </div>
              </div>
            ))}
         </div>

         <aside className="space-y-6 h-fit lg:sticky lg:top-8">
            <div className="p-6 bg-secondary rounded-lg border border-border">
               <h3 className="text-sm font-semibold text-secondary-foreground mb-4">Revenue Summary</h3>
               <div className="flex justify-between items-end mb-6">
                  <span className="text-3xl font-bold text-secondary-foreground">
                    GH₵{sellerItems.reduce((acc: number, { item }: any) => acc + item.quantity * item.price, 0).toFixed(2)}
                  </span>
               </div>
               <div className="pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Buyer Details</p>
                  <p className="font-medium text-secondary-foreground text-sm">{orderData.buyer.name}</p>
                  <p className="text-sm text-muted-foreground mb-6">{orderData.buyer.email}</p>
                  <Link 
                    href={`/orders/${orderData.order.id}/invoice`}
                    target="_blank"
                    className="w-full block text-center py-2.5 bg-secondary-foreground text-secondary rounded-md font-medium text-xs transition-colors hover:opacity-90 uppercase tracking-widest"
                  >
                     Print Invoice
                  </Link>
               </div>
            </div>
         </aside>
      </div>
    </div>
  );
}
