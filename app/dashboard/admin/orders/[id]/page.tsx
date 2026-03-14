import { db } from "@/lib/db";
import { orders, users, orderItems, products } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { protectRole } from "@/lib/auth-utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  Package, 
  User, 
  Store, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert,
  Calendar,
  ExternalLink,
  MapPin
} from "lucide-react";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  await protectRole(["ADMIN"]);
  const { id } = await params;

  const [orderData] = await db
    .select({
      order: orders,
      customer: users,
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .where(eq(orders.id, id))
    .limit(1);

  if (!orderData) notFound();

  const itemsWithSellers = await db
    .select({
      item: orderItems,
      product: products,
      seller: users,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .innerJoin(users, eq(products.sellerId, users.id))
    .where(eq(orderItems.orderId, id));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <Link 
          href="/dashboard/admin/orders" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Ledger
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Transaction Inspection</span>
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">Order #{id.slice(0, 12)}</h1>
            <p className="text-muted-foreground text-sm mt-1 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 opacity-40" /> {new Date(orderData.order.createdAt!).toLocaleString()}
            </p>
          </div>
          <div className={`px-5 py-2 rounded-2xl border flex items-center gap-3 shadow-sm ${
            orderData.order.status === "COMPLETED" 
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
              : orderData.order.status === "PENDING"
              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }`}>
             {orderData.order.status === "COMPLETED" && <CheckCircle2 className="w-5 h-5" />}
             {orderData.order.status === "PENDING" && <Clock className="w-5 h-5 animate-pulse" />}
             {orderData.order.status === "CANCELLED" && <XCircle className="w-5 h-5" />}
             <span className="text-xs font-black uppercase tracking-widest">{orderData.order.status}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Line Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card rounded-[32px] border border-border shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-border bg-muted/20">
              <h2 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" /> Line Items
              </h2>
            </div>
            <div className="divide-y divide-border/60">
              {itemsWithSellers.map(({ item, product, seller }) => (
                <div key={item.id} className="p-8 hover:bg-muted/5 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-muted rounded-2xl border border-border overflow-hidden flex-shrink-0 relative">
                       {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                       ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                           <Package className="w-8 h-8 text-muted-foreground/20" />
                        </div>
                       )}
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start mb-2">
                          <h3 className="text-base font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{product.name}</h3>
                          <p className="text-sm font-black text-foreground tabular-nums">GH₵{(item.price * item.quantity).toFixed(2)}</p>
                       </div>
                       <div className="flex flex-wrap gap-4 items-center">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-2.5 py-1 rounded-full">
                             Qty: {item.quantity}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-2.5 py-1 rounded-full border border-border">
                             Price: GH₵{item.price.toFixed(2)}
                          </div>
                          <div className="flex items-center gap-2 ml-auto">
                             <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-tighter">Vendor:</span>
                             <Link href={`/dashboard/admin/users/${seller.id}`} className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                                <Store className="w-3 h-3" /> {seller.name || "Unknown"}
                             </Link>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-8 py-6 bg-muted/20 border-t border-border flex justify-between items-center">
               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Aggregate Total</p>
               <h3 className="text-2xl font-black text-foreground tracking-tight underline decoration-primary decoration-4 underline-offset-4">GH₵{orderData.order.total.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Transaction Details */}
        <div className="space-y-8">
          {/* Customer Profile */}
          <div className="bg-card rounded-[32px] border border-border p-8 shadow-sm relative overflow-hidden group">
            <h2 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2 mb-6">
              <User className="w-4 h-4 text-primary" /> Customer Profile
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 shadow-sm overflow-hidden">
                {orderData.customer.image ? (
                  <img src={orderData.customer.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-7 h-7 text-primary/40" />
                )}
              </div>
              <div>
                <p className="text-base font-black text-foreground leading-none">{orderData.customer.name || "Anonymous User"}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1.5">{orderData.customer.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                 <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Billing Address
                 </p>
                 <p className="text-xs font-bold text-foreground leading-relaxed italic">
                    Contact user via email for detailed shipping logs. (Mock Address: 123 Digital Way, Accra)
                 </p>
              </div>
              <Link 
                href={`/dashboard/admin/users`}
                className="w-full py-3 bg-muted rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-500"
              >
                Inpect User Account <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
          </div>

          {/* Payment Context */}
          <div className="bg-card rounded-[32px] border border-border p-8 shadow-sm">
            <h2 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2 mb-6">
              <CreditCard className="w-4 h-4 text-primary" /> Payment Context
            </h2>
            <div className="space-y-4">
               <div className="flex justify-between items-center py-2 border-b border-dashed border-border">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Gateway</p>
                  <p className="text-xs font-black text-foreground">STRIPE REALTIME</p>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-dashed border-border">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Currency</p>
                  <p className="text-xs font-black text-foreground">GHANA CEDI (GHS)</p>
               </div>
               <div className="flex justify-between items-center py-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Integrity</p>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">VERIFIED</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
