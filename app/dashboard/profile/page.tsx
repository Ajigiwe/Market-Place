import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { updateProfile } from "@/lib/actions";
import { User, Mail, Package, ArrowRight, Clock } from "lucide-react";
import { getBuyerOrders } from "@/lib/order-actions";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const orders = await getBuyerOrders();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pb-24">
      <div className="mb-12 border-b border-border pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
          <p className="text-muted-foreground text-sm font-medium">Manage your profile and track your activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Profile Settings */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-6 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Profile Settings
            </h2>
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              <form action={updateProfile} className="p-8">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        defaultValue={session.user?.name || ""}
                        className="block w-full !pl-10 pr-3 py-2.5 border border-border rounded-xl bg-background text-sm font-bold text-foreground placeholder-muted-foreground/30 focus:border-primary outline-none transition-all"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        defaultValue={session.user?.email || ""}
                        disabled
                        className="block w-full !pl-10 pr-3 py-2.5 border border-border rounded-xl bg-muted/30 text-sm font-bold text-muted-foreground cursor-not-allowed"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest rounded-full hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/10"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-7">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-6 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" /> Order History
          </h2>
          
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-muted/10 border border-dashed border-border rounded-[32px]">
                <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-sm font-bold text-muted-foreground mb-6 uppercase tracking-widest">No orders yet</p>
                <Link 
                  href="/products" 
                  className="px-8 py-3 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest rounded-full hover:opacity-90 transition-all shadow-lg shadow-primary/10"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <Link 
                  key={order.id} 
                  href={`/dashboard/buyer/orders/${order.id}`}
                  className="group flex items-center p-4 sm:p-5 bg-card border border-border rounded-[24px] hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 gap-4"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted/30 rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <h3 className="text-[10px] sm:text-xs font-black text-foreground uppercase tracking-tight truncate">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shrink-0 ${
                        order.status === 'COMPLETED' || order.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-700' 
                          : order.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground">
                      {order.createdAt?.toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-black tracking-tighter text-foreground whitespace-nowrap">GH₵{order.total.toFixed(2)}</p>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">{order.orderItems.length} items</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
