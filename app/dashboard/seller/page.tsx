import { db } from "@/lib/db";
import { products, orders, orderItems } from "@/lib/schema";
import { eq, and, sql } from "drizzle-orm";
import { protectRole } from "@/lib/auth-utils";
import Link from "next/link";
import { deleteProduct } from "@/lib/actions";
import { Package, Tag, TrendingUp, DollarSign } from "lucide-react";

export default async function SellerDashboard() {
  const session = await protectRole(["SELLER", "ADMIN"]);
  const sellerId = session.user?.id as string;

  const sellerProducts = await db
    .select()
    .from(products)
    .where(eq(products.sellerId, sellerId));

  // Calculate real stats
  const completedOrdersWithSellerProducts = await db
    .selectDistinct({
      orderId: orders.id,
    })
    .from(orders)
    .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(
      and(
        eq(orders.status, "COMPLETED"),
        eq(products.sellerId, sellerId)
      )
    );

  const totalSalesCount = completedOrdersWithSellerProducts.length;

  const sellerRevenueRes = await db
    .select({
      revenue: sql<number>`sum(${orderItems.quantity} * ${orderItems.price})`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(
      and(
        eq(orders.status, "COMPLETED"),
        eq(products.sellerId, sellerId)
      )
    );

  const totalRevenue = sellerRevenueRes[0]?.revenue || 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Seller Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage your products and track sales performance.</p>
        </div>
        <div className="flex gap-4">
           <Link 
            href="/dashboard/seller/orders" 
            className="px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-md font-medium text-sm hover:bg-secondary/80 transition-colors flex items-center gap-2"
          >
            <Package className="w-4 h-4" /> Orders
          </Link>
          <Link 
            href="/products/new" 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Tag className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { 
            label: "Active Products", 
            value: sellerProducts.length, 
            Icon: Tag,
            color: "text-indigo-600",
            bg: "bg-indigo-500/10",
            border: "border-indigo-500/20"
          },
          { 
            label: "Orders Fulfilled", 
            value: totalSalesCount, 
            Icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20"
          },
          { 
            label: "Total Revenue", 
            value: `GH₵${totalRevenue.toFixed(2)}`, 
            Icon: DollarSign,
            color: "text-amber-600",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20"
          },
        ].map((stat, i) => (
          <div key={i} className={`p-6 bg-card rounded-[24px] border border-border shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-300`}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-foreground tracking-tight">{stat.value}</h3>
            </div>
            <div className={`w-14 h-14 ${stat.bg} ${stat.border} border rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
              <stat.Icon className={`w-7 h-7 ${stat.color} drop-shadow-sm`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
           <h2 className="font-semibold text-foreground">Inventory List</h2>
           <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">{sellerProducts.length} items</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr className="text-muted-foreground">
                <th className="px-6 py-3 font-medium">Product Name</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Stock Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sellerProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No products added yet.
                  </td>
                </tr>
              ) : (
                sellerProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md flex-shrink-0 border border-border" />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded-md flex-shrink-0" />
                        )}
                        <div>
                           <p className="font-medium text-foreground">{product.name}</p>
                           <p className="text-xs text-muted-foreground mt-0.5">ID: {product.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">GH₵{product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                        product.stock > 10 
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" 
                          : "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                      }`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-sm">
                        <Link href={`/products/${product.id}/edit`} className="text-primary hover:underline transition-all">
                          Edit
                        </Link>
                        <form action={async () => {
                          "use server";
                          await deleteProduct(product.id);
                        }}>
                          <button className="text-destructive hover:underline transition-all">
                            Delete
                          </button>
                        </form>
                      </div>
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
