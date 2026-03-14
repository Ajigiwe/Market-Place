import { db } from "@/lib/db";
import { orders, users, orderItems, products } from "@/lib/schema";
import { eq, desc, sql } from "drizzle-orm";
import { protectRole } from "@/lib/auth-utils";
import Link from "next/link";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ShieldAlert,
  User,
  CreditCard
} from "lucide-react";

export default async function AdminOrdersPage() {
  await protectRole(["ADMIN"]);

  const allOrders = await db
    .select({
      order: orders,
      user: users,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/admin" className="p-1 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </Link>
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Global Transactions</span>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Orders Monitor</h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">Tracking and managing every transaction across the platform.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH ORDERS..." 
              className="pl-11 pr-6 py-2.5 bg-card border border-border rounded-xl text-[10px] font-black tracking-widest uppercase outline-none focus:ring-2 focus:ring-ring transition-all w-64 shadow-sm"
            />
          </div>
          <button className="px-4 py-2.5 bg-card border border-border rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-muted transition-all shadow-sm">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-card rounded-[32px] border border-border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-border bg-muted/20 flex justify-between items-center">
           <h2 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
             <ShieldAlert className="w-4 h-4 text-primary" /> Platform Ledger
           </h2>
           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 bg-muted px-3 py-1 rounded-full border border-border">
             {allOrders.length} total transactions
           </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/10 text-muted-foreground text-[10px] font-black uppercase tracking-widest border-b border-border">
                <th className="px-8 py-5">Order ID</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Date & Time</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {allOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center">
                    <div className="max-w-xs mx-auto space-y-3 opacity-20">
                      <ShoppingBag className="w-12 h-12 mx-auto" />
                      <p className="font-black text-xs uppercase tracking-widest">No transactions found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                allOrders.map(({ order, user }) => (
                  <tr key={order.id} className="hover:bg-muted/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-muted-foreground/40" />
                        </div>
                        <p className="text-xs font-bold text-foreground font-mono">#{order.id.slice(0, 12)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/5 rounded-full flex items-center justify-center text-[10px] font-black text-primary border border-primary/10">
                          {user?.name?.charAt(0) || user?.email.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground leading-none">{user?.name || "Anonymous"}</p>
                          <p className="text-[9px] text-muted-foreground/60 font-medium mt-1 lowercase tracking-tighter">{user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-xs font-black text-foreground">GH₵{order.total.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        {order.status === "COMPLETED" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                        {order.status === "PENDING" && <Clock className="w-3.5 h-3.5 text-amber-500" />}
                        {order.status === "CANCELLED" && <XCircle className="w-3.5 h-3.5 text-destructive" />}
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                          order.status === "COMPLETED" 
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                            : order.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-xs font-bold text-muted-foreground tabular-nums">
                        {new Date(order.createdAt!).toLocaleDateString()}
                        <span className="text-[10px] opacity-40 ml-2">
                          {new Date(order.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link 
                        href={`/dashboard/admin/orders/${order.id}`}
                        className="text-[9px] font-black uppercase tracking-widest px-4 py-2 hover:bg-muted rounded-full transition-all text-primary border border-transparent hover:border-border"
                      >
                        Inspect
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
