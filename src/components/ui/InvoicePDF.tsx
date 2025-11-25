import React from 'react';

// --- Type Definitions ---
interface Item {
  id: number;
  name: string;
  qty: number;
  unit: string;
  price: string | number;
  discount: string | number;
  tax: string | number;
  amount: number;
}

interface Totals {
  subtotal: number;
  totalDiscount: number;
  taxableAmount: number;
  totalTax: number;
  total: number;
  roundOffValue: number;
  balanceDue: number;
}

interface GlobalState {
  invoiceNo: string;
  date: string;
  dueDate: string;
  amountPaid: number;
}

interface Supplier {
  name: string;
  address: string;
}

interface InvoicePDFProps {
  items: Item[];
  totals: Totals;
  globalState: GlobalState;
  supplier: Supplier | null;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ items, totals, globalState, supplier }) => {
  return (
    <div className="bg-white text-gray-900 font-sans p-8" id="invoice-content">
      {/* --- COMPANY HEADER (Centered) --- */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Application</h1>
        <p className="text-sm text-gray-600">123 Your Street, Your City, 12345 | your.email@example.com</p>
      </header>

      {/* --- BILLING & INVOICE INFO --- */}
      <section className="grid grid-cols-2 gap-8 mb-8 pb-4 border-b-2 border-gray-900">
        {/* Bill From (Left) */}
        <div className="text-sm">
          <h2 className="font-semibold text-gray-800 mb-1">Bill From:</h2>
          <p className="font-bold text-lg">{supplier?.name || 'N/A'}</p>
          <p>{supplier?.address || 'Supplier address not available'}</p>
        </div>

        {/* Bill To (Right) */}
        {/* <div className="text-right text-sm">
          <h2 className="font-semibold text-gray-800 mb-1">Bill To:</h2>
          <p className="font-bold text-lg">Inventory Application</p>
          <p>123 Your Street, Your City, 12345</p>
        </div> */}
          <div className="text-right">
          <p><span className="font-semibold">Invoice #:</span> {globalState.invoiceNo}</p>
          <p><span className="font-semibold">Date:</span> {globalState.date}</p>
          <p><span className="font-semibold">Due Date:</span> {globalState.dueDate}</p>
        </div>
      </section>

      {/* --- INVOICE DETAILS --- */}
      {/* <section className="flex justify-between items-center mb-8 text-sm">
        <h2 className="text-2xl font-bold uppercase text-gray-900">INVOICE</h2>
      
      </section> */}

      {/* --- ITEMS TABLE --- */}
      <section className="mt-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-200 border-b border-slate-300">
              <th className="px-4 py-3 text-sm font-semibold uppercase text-slate-700">#</th>
              <th className="px-4 py-3 text-sm font-semibold uppercase text-slate-700 w-2/5">Item</th>
              <th className="px-4 py-3 text-sm font-semibold uppercase text-slate-700 text-right">Qty</th>
              <th className="px-4 py-3 text-sm font-semibold uppercase text-slate-700 text-right">Price</th>
              <th className="px-4 py-3 text-sm font-semibold uppercase text-slate-700 text-right">Discount</th>
              <th className="px-4 py-3 text-sm font-semibold uppercase text-slate-700 text-right">Tax</th>
              <th className="px-4 py-3 text-sm font-semibold uppercase text-slate-700 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-b border-slate-200 odd:bg-white even:bg-slate-50">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3 text-right">{item.qty}</td>
                <td className="px-4 py-3 text-right">₹{Number(item.price).toFixed(2)}</td>
                <td className="px-4 py-3 text-right">₹{Number(item.discount).toFixed(2)}</td>
                <td className="px-4 py-3 text-right">{Number(item.tax)}%</td>
                <td className="px-4 py-3 text-right font-medium">₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* --- TOTALS SECTION --- */}
      <section className="flex justify-end my-6">
        <div className="w-full max-w-sm space-y-2 text-sm">
          {/* <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span className="font-medium">₹{totals.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Total Discount:</span><span className="font-medium">- ₹{totals.totalDiscount.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Taxable Amount:</span><span className="font-medium">₹{totals.taxableAmount.toFixed(2)}</span></div>
          <div className="flex justify-between pb-2 border-b"><span className="text-gray-600">Total Tax:</span><span className="font-medium">₹{totals.totalTax.toFixed(2)}</span></div> */}
          <div className="flex justify-between pt-2 text-lg font-bold"><span >TOTAL:</span><span>₹{totals.total.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Amount Paid:</span><span className="font-medium">₹{Number(globalState.amountPaid).toFixed(2)}</span></div>
          <div className="flex justify-between text-lg font-bold text-green-600"><span>Balance Due:</span><span>₹{totals.balanceDue > 0 ? totals.balanceDue.toFixed(2) : '0.00'}</span></div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="mt-12 pt-6  flex justify-between items-end">
    
        {/* Left: Terms & Conditions */}
        <div className="text-xs text-gray-600 text-left">
          <h3 className="font-semibold mb-1">Terms & Conditions</h3>
          <p>1. Goods once sold will not be taken back or exchanged.</p>
          <p>2. All disputes are subject to local jurisdiction only.</p>
        </div>

          {/* Right: Authority Signature */}
        <div className="text-xs text-gray-600">
          <div className="w-48 border-b-2 border-gray-400 mb-6"></div>
          <p className="font-semibold">Authorised Signatory</p>
        </div>
      </footer>
    </div>
  );
};

export default InvoicePDF;