import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { protectRole } from "@/lib/auth-utils";
import { ShieldAlert, User, ShieldCheck, Mail, Calendar, UserPlus, Ban, Unlock } from "lucide-react";
import { toggleUserStatus } from "@/lib/admin-actions";

export default async function AdminUsersPage() {
  await protectRole(["ADMIN"]);

  const allUsers = await db.select().from(users);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">System Users</span>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Identity Management</h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">Manage platform memberships, roles, and security protocols.</p>
        </div>
      </div>

      <div className="bg-card rounded-[32px] border border-border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-border bg-muted/20 flex justify-between items-center">
           <h2 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
             <User className="w-4 h-4" /> Platform Directory
           </h2>
           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 bg-muted px-3 py-1 rounded-full border border-border">
             {allUsers.length} total profiles
           </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/10 text-muted-foreground text-[10px] font-black uppercase tracking-widest border-b border-border">
                <th className="px-8 py-5">Member</th>
                <th className="px-6 py-5">Email Address</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Current Role</th>
                <th className="px-6 py-5">Joined Date</th>
                <th className="px-8 py-5 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {allUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 shadow-sm overflow-hidden">
                        {user.image ? (
                          <img src={user.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-primary/40" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground leading-none">{user.name || "UNNAMED USER"}</p>
                        <p className="text-[10px] text-muted-foreground/60 font-medium mt-1 uppercase tracking-tighter">ID: {user.id.slice(0, 12)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-xs font-medium text-foreground flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground/40" /> {user.email}
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                      user.status === "ACTIVE" 
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      user.role === "ADMIN" 
                        ? "bg-rose-500/10 text-rose-600 border-rose-500/20" 
                        : user.role === "SELLER"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-xs font-bold text-muted-foreground flex items-center gap-2 tabular-nums">
                      <Calendar className="w-3.5 h-3.5 opacity-40" /> {new Date(user.createdAt!).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                      <form action={async () => {
                        "use server";
                        await toggleUserStatus(user.id, user.status || "ACTIVE");
                      }}>
                        <button className={`p-2 rounded-xl border transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${
                          user.status === "ACTIVE"
                            ? "hover:bg-destructive hover:text-destructive-foreground border-transparent hover:border-destructive"
                            : "hover:bg-emerald-500 hover:text-white border-transparent hover:border-emerald-500"
                        }`}>
                          {user.status === "ACTIVE" ? (
                            <><Ban className="w-3.5 h-3.5" /> Block Access</>
                          ) : (
                            <><Unlock className="w-3.5 h-3.5" /> Restore Access</>
                          )}
                        </button>
                      </form>
                      <button className="text-[10px] font-black uppercase tracking-widest p-2 hover:bg-muted rounded-lg transition-all text-primary border border-transparent hover:border-border">
                         Manage Role
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
