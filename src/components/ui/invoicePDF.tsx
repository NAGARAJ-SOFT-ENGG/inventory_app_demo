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
  globalDiscountAmount?: number;
}

interface GlobalState {
  invoiceNo: string;
  date: string;
  dueDate: string;
  vehicleNumber?: string;
  driverName?: string;
  driverMobileNumber?: string;
  remarks?: string;
  payments: {
    mode: string;
    amount: number;
  }[];
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
  invoiceType: 'purchase' | 'scales'; // Added invoiceType prop
}

const totalAmountPaid = (globalState: GlobalState) => globalState.payments.reduce((sum, p) => sum + (p.amount || 0), 0);

const InvoicePDF: React.FC<InvoicePDFProps> = ({ items, totals, globalState, supplier, invoiceType }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      color: '#111827',
      fontFamily: 'sans-serif',
      padding: '32px',
      width: '800px',
    }} id="invoice-content">

      {/* --- COMPANY HEADER (Centered) --- */}
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Inventory Application</h1>
        <p style={{ fontSize: '12px', color: '#4B5563', margin: 0 }}>123 Your Street, Your City, 12345 | your.email@example.com</p>
      </header>

      {/* --- BILLING & INVOICE INFO --- */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px', paddingBottom: '16px', borderBottom: '2px solid #111827' }}>
        {/* Bill From */}
        <div style={{ fontSize: '12px' }}>
          <h2 style={{ fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>{invoiceType === 'purchase' ? 'Bill From:' : 'Bill To:'}</h2>
          <p style={{ fontWeight: 'bold', fontSize: '14px', margin: 0 }}>{supplier?.name || 'N/A'}</p>
          <p style={{ margin: 0 }}>{supplier?.address || 'Supplier address not available'}</p>
          <div style={{ marginTop: '8px', color: '#4B5563' }}>
            {globalState.vehicleNumber && <p style={{ margin: 0 }}>Vehicle: {globalState.vehicleNumber}</p>}
            {globalState.driverName && <p style={{ margin: 0 }}>Driver: {globalState.driverName}</p>}
            {globalState.driverMobileNumber && <p style={{ margin: 0 }}>Mobile: {globalState.driverMobileNumber}</p>}
          </div>
        </div>

        {/* Invoice Info */}
        <div style={{ textAlign: 'right', fontSize: '12px' }}>
          <p><span style={{ fontWeight: '600' }}>Invoice #:</span> {globalState.invoiceNo}</p>
          <p><span style={{ fontWeight: '600' }}>Date:</span> {globalState.date}</p>
          <p><span style={{ fontWeight: '600' }}>Due Date:</span> {globalState.dueDate}</p>
        </div>
      </section>

      {/* --- ITEMS TABLE --- */}
      <section style={{ marginTop: '32px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#E2E8F0', borderBottom: '1px solid #CBD5E1' }}>
              <th style={{ padding: '12px', fontWeight: '600', textTransform: 'uppercase', textAlign: 'left' }}>#</th>
              <th style={{ padding: '12px', fontWeight: '600', textTransform: 'uppercase', textAlign: 'left', width: '40%' }}>Item</th>
              <th style={{ padding: '12px', fontWeight: '600', textTransform: 'uppercase', textAlign: 'right' }}>Qty</th>
              <th style={{ padding: '12px', fontWeight: '600', textTransform: 'uppercase', textAlign: 'right' }}>Price</th>
              <th style={{ padding: '12px', fontWeight: '600', textTransform: 'uppercase', textAlign: 'right' }}>Discount</th>
              <th style={{ padding: '12px', fontWeight: '600', textTransform: 'uppercase', textAlign: 'right' }}>Tax</th>
              <th style={{ padding: '12px', fontWeight: '600', textTransform: 'uppercase', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} style={{
                borderBottom: '1px solid #E5E7EB',
                backgroundColor: index % 2 === 0 ? '#ffffff' : '#F8FAFC'
              }}>
                <td style={{ padding: '12px' }}>{index + 1}</td>
                <td style={{ padding: '12px' }}>{item.name}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{item.qty}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>₹{Number(item.price).toFixed(2)}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{Number(item.discount).toFixed(2)}%</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{Number(item.tax)}%</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* --- TOTALS SECTION --- */}
      <section style={{ display: 'flex', justifyContent: 'flex-end', margin: '24px 0' }}>
        <div style={{ width: '100%', maxWidth: '240px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
          {totals.globalDiscountAmount && totals.globalDiscountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#4B5563' }}>Discount:</span>
              <span style={{ fontWeight: '500' }}>-₹{totals.globalDiscountAmount.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', paddingTop: '8px' }}>
            <span>TOTAL:</span><span>₹{totals.total.toFixed(2)}</span>
          </div>
          {globalState.payments.map((payment, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#4B5563' }}>Paid by {payment.mode}:</span>
              <span style={{ fontWeight: '500' }}>₹{Number(payment.amount).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: '8px', marginTop: '4px' }}>
            <span style={{ color: '#4B5563' }}>Total Paid:</span><span style={{ fontWeight: 'bold' }}>₹{totalAmountPaid(globalState).toFixed(2)}</span>
          </div>          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', color: '#059669' }}>
            <span>Balance Due:</span><span>₹{totals.balanceDue > 0 ? totals.balanceDue.toFixed(2) : '0.00'}</span>
          </div>
        </div>
      </section>

      {/* --- REMARKS --- */}
      {globalState.remarks && (
        <section style={{ marginTop: '24px', fontSize: '12px', color: '#4B5563' }}>
          <h3 style={{ fontWeight: '600', color: '#1F2937', marginBottom: '4px' }}>Remarks:</h3>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{globalState.remarks}</p>
        </section>
      )}


      {/* --- FOOTER --- */}
      <footer style={{ marginTop: '48px', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '10px', color: '#4B5563' }}>
        {/* Terms */}
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '4px' }}>Terms & Conditions</h3>
          <p style={{ margin: 0 }}>1. Goods once sold will not be taken back or exchanged.</p>
          <p style={{ margin: 0 }}>2. All disputes are subject to local jurisdiction only.</p>
        </div>

        {/* Signature */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '192px', borderBottom: '2px solid white', marginBottom: '24px' }}></div>
          <p style={{ fontWeight: '600', margin: 0 }}>Authorised Signatory</p>
        </div>
      </footer>
    </div>
  );
};

export default InvoicePDF;
