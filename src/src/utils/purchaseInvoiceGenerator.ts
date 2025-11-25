import React from 'react';
import { createRoot } from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import InvoicePDF from '../../components/ui/InvoicePDF';

// --- Type Definitions ---
interface Item {
  id: number;
  name: string;
  qty: number;
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

export const generatePurchaseInvoicePDF = (
  items: Item[],
  totals: Totals,
  globalState: GlobalState,
  supplier: Supplier | null
) => {
  // 1. Create a temporary container in the DOM to render the component
  const container = document.createElement('div');
  // Style it to be off-screen to avoid any flicker or layout shift
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  // A fixed width is important for html2canvas to render the layout correctly
  container.style.width = '800px'; 
  document.body.appendChild(container);

  // 2. Render the React component into the temporary container
  const root = createRoot(container);
  root.render(
    React.createElement(InvoicePDF, {
      items: items,
      totals: totals,
      globalState: globalState,
      supplier: supplier,
    })
  );

  // 3. Use html2canvas to capture the rendered component as an image
  // A short delay can help ensure all styles and images are loaded
  setTimeout(() => {
    html2canvas(container, { 
      scale: 2,
   onclone(doc) {
  const elements = doc.querySelectorAll('*');
  elements.forEach(el => {
    const style = getComputedStyle(el);

    // Fix color, background, border
    ["color", "backgroundColor", "borderColor"].forEach(prop => {
      const val = style[prop];

      if (val && val.includes("oklch(")) {
        // Convert to a neutral safe fallback based on property
        if (prop === "color") el.style[prop] = "rgb(33, 33, 33)"; // gray text
        if (prop === "backgroundColor") el.style[prop] = "rgb(255, 255, 255)"; // white bg
        if (prop === "borderColor") el.style[prop] = "rgb(200, 200, 200)"; // light border
      }
    });
  });
}

    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      let height = pdfWidth / ratio;

      // Handle multi-page PDFs if content is too long
      const pageHeight = pdf.internal.pageSize.getHeight();
      if (height > pageHeight) {
        let y = 0;
        while (height > 0) {
          pdf.addImage(imgData, 'PNG', 0, y, pdfWidth, height > pageHeight ? pageHeight * ratio : height);
          height -= pageHeight;
          if (height > 0) {
            pdf.addPage();
            y = -pageHeight;
          }
        }
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, height);
      }

      // Add the image to the PDF and save it
      pdf.save(`Invoice-${globalState.invoiceNo}.pdf`);
    }).catch(e => {
      console.error("html2canvas failed:", e);
    }).finally(() => {
      // 4. Clean up by removing the temporary container from the DOM
      root.unmount();
      document.body.removeChild(container);
    });
  }, 100);
};