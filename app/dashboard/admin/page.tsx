import { db } from "@/lib/db";
import { products, orders, users, orderItems } from "@/lib/schema";
import { eq, sql, desc } from "drizzle-orm";
import { protectRole } from "@/lib/auth-utils";
import Link from "next/link";
import { 
  ShieldAlert, 
  Users, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  Activity,
  UserCheck,
  PackageSearch
} from "lucide-react";

export default async function AdminDashboard() {
  const session = await protectRole(["ADMIN"]);

  // 1. Global Platform Revenue (Completed Orders)
  const platformRevenueRes = await db
    .select({
      revenue: sql<number>`sum(${orderItems.quantity} * ${orderItems.price})`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(eq(orders.status, "COMPLETED"));

  const totalRevenue = platformRevenueRes[0]?.revenue || 0;

  // 2. User Statistics
  const allUsers = await db.select().from(users);
  const sellers = allUsers.filter(u => u.role === "SELLER");
  const buyers = allUsers.filter(u => u.role === "BUYER");
  const admins = allUsers.filter(u => u.role === "ADMIN");

  // 3. Platform Growth (Total Orders & Products)
  const totalOrdersCount = await db.select({ count: sql<number>`count(*)` }).from(orders).then(r => r[0].count);
  const totalProductsCount = await db.select({ count: sql<number>`count(*)` }).from(products).then(r => r[0].count);

  // 4. Recent Platform Activity
  const recentOrders = await db
    .select()
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
    .limit(5);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Platform Authority</span>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Super Admin</h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">Monitoring platform-wide performance and user safety.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/dashboard/admin/users" 
            className="px-6 py-2.5 bg-card border border-border rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-muted transition-all flex items-center gap-2 shadow-sm"
          >
            <Users className="w-3.5 h-3.5" /> Manage Users
          </Link>
          <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 border border-emerald-500/20 shadow-sm animate-pulse">
            <Activity className="w-3 h-3" /> Live Monitor
          </div>
        </div>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { 
            label: "Total Revenue", 
            value: `GH₵${totalRevenue.toLocaleString()}`, 
            Icon: DollarSign, 
            color: "text-amber-600",
            bg: "bg-amber-500/10",
            sub: "All-time Sales"
          },
          { 
            label: "Platform Users", 
            value: allUsers.length, 
            Icon: Users, 
            color: "text-indigo-600",
            bg: "bg-indigo-500/10",
            sub: `${sellers.length} Sellers active`
          },
          { 
            label: "Global Orders", 
            value: totalOrdersCount, 
            Icon: ShoppingBag, 
            color: "text-emerald-600",
            bg: "bg-emerald-500/10",
            sub: "Total processed"
          },
          { 
            label: "Total Inventory", 
            value: totalProductsCount, 
            Icon: PackageSearch, 
            color: "text-rose-600",
            bg: "bg-rose-500/10",
            sub: "Unique listings"
          },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-card rounded-[32px] border border-border shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-500">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-foreground tracking-tight mb-1">{stat.value}</h3>
              <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tighter">{stat.sub}</p>
            </div>
            <div className={`absolute top-6 right-6 w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center transition-transform duration-700 group-hover:scale-125 group-hover:rotate-6`}>
              <stat.Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Role Split */}
        <div className="lg:col-span-1 bg-card rounded-[32px] border border-border p-8 shadow-sm">
           <h2 className="text-lg font-black text-foreground mb-6 uppercase tracking-tight flex items-center gap-2">
             <UserCheck className="w-5 h-5 text-primary" /> Role Distribution
           </h2>
           <div className="space-y-6">
             <div className="space-y-2">
               <div className="flex justify-between items-end">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Buyers</p>
                 <p className="text-sm font-bold text-foreground">{buyers.length}</p>
               </div>
               <div className="h-2 bg-muted rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500/50 transition-all duration-1000" style={{ width: `${(buyers.length / (allUsers.length || 1)) * 100}%` }} />
               </div>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between items-end">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Sellers</p>
                 <p className="text-sm font-bold text-foreground">{sellers.length}</p>
               </div>
               <div className="h-2 bg-muted rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500/50 transition-all duration-1000" style={{ width: `${(sellers.length / (allUsers.length || 1)) * 100}%` }} />
               </div>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between items-end">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Admins</p>
                 <p className="text-sm font-bold text-foreground">{admins.length}</p>
               </div>
               <div className="h-2 bg-muted rounded-full overflow-hidden">
                 <div className="h-full bg-rose-500/50 transition-all duration-1000" style={{ width: `${(admins.length / (allUsers.length || 1)) * 100}%` }} />
               </div>
             </div>
           </div>
           
           <div className="mt-10 p-6 bg-muted/30 rounded-2xl border border-dashed border-border text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed text-center">
                User base is growing at <span className="text-emerald-500">+12%</span> this week
              </p>
           </div>
        </div>

        {/* Global Sales Activity */}
        <div className="lg:col-span-2 bg-card rounded-[32px] border border-border overflow-hidden shadow-sm">
           <div className="px-8 py-6 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-black text-foreground uppercase tracking-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Live Transactions
              </h2>
              <Link href="/dashboard/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All</Link>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-muted/30 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                   <th className="px-8 py-4">Transaction ID</th>
                   <th className="px-6 py-4">User</th>
                   <th className="px-6 py-4">Amount</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-8 py-4 text-right">Time</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border">
                 {recentOrders.map(({ order, user }) => (
                   <tr key={order.id} className="hover:bg-muted/10 transition-colors group">
                     <td className="px-8 py-6">
                       <p className="text-xs font-bold text-foreground font-mono">#{order.id.slice(0, 12)}</p>
                     </td>
                     <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                            {user!.name?.charAt(0) || user!.email.charAt(0)}
                          </div>
                          <p className="text-xs font-bold text-foreground leading-none">{user!.name || "Anonymous"}</p>
                        </div>
                     </td>
                     <td className="px-6 py-6">
                        <p className="text-xs font-black text-foreground">GH₵{order.total.toFixed(2)}</p>
                     </td>
                     <td className="px-6 py-6">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                          order.status === "COMPLETED" 
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}>
                          {order.status}
                        </span>
                     </td>
                     <td className="px-8 py-6 text-right">
                        <p className="text-[10px] font-bold text-muted-foreground tabular-nums">
                          {new Date(order.createdAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}
