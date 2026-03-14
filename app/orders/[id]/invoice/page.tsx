import { getOrderDetail } from "@/lib/order-actions";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import PrintButton from "@/components/PrintButton";

export default async function InvoicePage({ params }: { params: { id: string } }) {
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
    <div className="min-h-screen bg-white p-8 sm:p-16 text-slate-900 font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-border-none { border: none !important; }
          @page { margin: 2cm; }
        }
      `}} />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-16 border-b-2 border-slate-100 pb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-4 text-primary">MarketPlace</h1>
            <div className="text-sm font-bold text-slate-500 space-y-1">
              <p>Accra, Ghana</p>
              <p>support@marketplace.com</p>
              <p>www.marketplace.com</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-5xl font-black text-slate-200 uppercase tracking-tighter mb-4">Invoice</h2>
            <div className="text-sm font-bold space-y-1">
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Reference</p>
              <p className="text-slate-900">#{order.id.toUpperCase()}</p>
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mt-4">Date Issued</p>
              <p className="text-slate-900">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GH', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-16 mb-16">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Customer Details</p>
            <div className="text-sm">
              <p className="font-black text-slate-900 text-lg mb-1">{session.user?.name}</p>
              <p className="font-bold text-slate-500">{session.user?.email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Payment Information</p>
            <div className="text-sm">
              <p className="font-black text-slate-900 mb-1">Method: Cash on Delivery</p>
              <p className="font-bold text-primary">Status: {order.status}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-16">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="py-4 text-left">Line Item</th>
                <th className="py-4 text-center">Qty</th>
                <th className="py-4 text-right">Unit Price</th>
                <th className="py-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.orderItems.map((item: any) => (
                <tr key={item.id}>
                  <td className="py-6">
                    <p className="font-black text-slate-900 uppercase tracking-tight">{item.product.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">ID: {item.productId.slice(0,8).toUpperCase()}</p>
                  </td>
                  <td className="py-6 text-center font-bold text-slate-600 italic">
                    {item.quantity}
                  </td>
                  <td className="py-6 text-right font-black text-slate-900 tabular-nums">
                    GH₵{item.price.toFixed(2)}
                  </td>
                  <td className="py-6 text-right font-black text-slate-900 tabular-nums">
                    GH₵{(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="flex justify-end pt-8 border-t-2 border-slate-100">
          <div className="w-64 space-y-4">
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
              <span className="tabular-nums">GH₵{order.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-500">
              <span className="uppercase tracking-widest text-[10px]">Processing</span>
              <span className="text-primary font-black uppercase tracking-widest text-[10px]">Gratis</span>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-slate-100">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total Amount</span>
              <span className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">GH₵{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-slate-100 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
            Thank you for choosing MarketPlace &bull; Sustainable B2B2C Commerce
          </p>
        </div>

        <PrintButton />
      </div>
    </div>
  );
}
