import { db } from "@/lib/db";
import { orders, orderItems, products, users } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { protectRole } from "@/lib/auth-utils";
import Link from "next/link";

export default async function SellerOrdersPage() {
  const session = await protectRole(["SELLER", "ADMIN"]);

  // Fetch orders that contain at least one product belonging to this seller
  const sellerOrders = await db
    .select({
      id: orders.id,
      total: orders.total,
      status: orders.status,
      createdAt: orders.createdAt,
      buyerName: users.name,
      buyerEmail: users.email,
    })
    .from(orders)
    .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .innerJoin(users, eq(orders.userId, users.id))
    .where(eq(products.sellerId, session.user?.id as string))
    .groupBy(orders.id)
    .orderBy(desc(orders.createdAt));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-border pb-6">
        <div>
          <nav className="mb-2">
            <Link href="/dashboard/seller" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              &larr; Back to Dashboard
            </Link>
          </nav>
          <h1 className="text-3xl font-bold text-foreground">Customer Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">Incoming orders from your buyers.</p>
        </div>
        <div className="text-right">
           <span className="px-3 py-1.5 bg-secondary rounded-md text-xs font-semibold text-secondary-foreground border border-border">
             {sellerOrders.length} Orders
           </span>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr className="text-muted-foreground">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Buyer</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sellerOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                sellerOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{order.buyerName}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{order.buyerEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{order.createdAt?.toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">GH₵{order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "COMPLETED" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/dashboard/seller/orders/${order.id}`}
                        className="text-primary hover:underline transition-colors font-medium text-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
