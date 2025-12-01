import React, { useState, useEffect } from "react";
import { mockPurchaseInvoices, PurchaseInvoice, PurchaseItem } from "../data/mockData";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Save } from "lucide-react";

export const PurchaseReturnsPage: React.FC = () => {
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);
  const [returnQuantities, setReturnQuantities] = useState<{ [itemId: string]: number }>({});
  const [stock, setStock] = useState<{ [itemId: string]: number }>({}); // Mock stock

  useEffect(() => {
    // Initialize invoices from mock data
    setInvoices(mockPurchaseInvoices);

    // Initialize mock stock (for demonstration)
    const initialStock: { [itemId: string]: number } = {};
    mockPurchaseInvoices.forEach(invoice => {
      invoice.items.forEach(item => {
        initialStock[item.id] = (initialStock[item.id] || 0) + item.purchasedQuantity;
      });
    });
    setStock(initialStock);
  }, []);

  const handleInvoiceSelect = (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId) || null;
    setSelectedInvoice(invoice || null);
    setReturnQuantities({}); // Reset return quantities when a new invoice is selected
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setReturnQuantities((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  const handleProcessReturn = () => {
    if (!selectedInvoice) {
      toast.error("Please select an invoice to process return.");
      return;
    }

    const itemsToReturn: { item: PurchaseItem; quantity: number }[] = [];
    let totalReturnAmount = 0;

    selectedInvoice.items.forEach((item) => {
      const quantityToReturn = returnQuantities[item.id] || 0;

      if (quantityToReturn > 0) {
        if (item.scaled) {
          toast.error(`Item "${item.name}" cannot be returned as it has already gone to scales.`, { duration: 5000 });
          return; // Prevent return for this item
        }
        if (quantityToReturn > item.purchasedQuantity - item.returnedQuantity) {
          toast.error(`Cannot return more than available for "${item.name}". Max returnable: ${item.purchasedQuantity - item.returnedQuantity}`);
          return; // Prevent returning more than available
        }
        itemsToReturn.push({ item, quantity: quantityToReturn });
        totalReturnAmount += quantityToReturn * item.unitPrice;
      }
    });

    if (itemsToReturn.length === 0) {
      toast.info("No items selected for return or invalid quantities entered.");
      return;
    }

    // Simulate stock update and invoice update
    setStock((prevStock) => {
      const newStock = { ...prevStock };
      itemsToReturn.forEach(({ item, quantity }) => {
        newStock[item.id] = (newStock[item.id] || 0) - quantity;
      });
      return newStock;
    });

    setInvoices((prevInvoices) =>
      prevInvoices.map((inv) =>
        inv.id === selectedInvoice.id
          ? {
              ...inv,
              items: inv.items.map((item) => {
                const returned = itemsToReturn.find((i) => i.item.id === item.id);
                return returned
                  ? { ...item, returnedQuantity: item.returnedQuantity + returned.quantity }
                  : item;
              }),
            }
          : inv
      )
    );

    toast.success(`Purchase return processed for invoice ${selectedInvoice.invoiceNumber}. Total amount: $${totalReturnAmount.toFixed(2)}`);
    setSelectedInvoice(null); // Clear selection after return
    setReturnQuantities({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-gray-900">
        <h1 className="text-2xl font-bold text-gray-800">Purchase Returns</h1>
        <Button onClick={handleProcessReturn} variant="gradient" disabled={!selectedInvoice}>
          <Save className="w-4 h-4 mr-2" />
          Save Returns
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">

      <div className="mb-8">
        <label htmlFor="invoice-select" className="block text-gray-700 text-sm font-bold mb-2">
          Select Purchase Invoice:
        </label>
        <Select
          onValueChange={handleInvoiceSelect}
          value={selectedInvoice?.id || ""}
        >
          <SelectTrigger id="invoice-select" className="w-full">
            <SelectValue placeholder="-- Select an Invoice --" />
          </SelectTrigger>
          <SelectContent>
            {invoices.map((invoice) => (
              <SelectItem key={invoice.id} value={invoice.id}>
                {invoice.invoiceNumber} - {invoice.supplierName} ({invoice.purchaseDate})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedInvoice && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Original Purchase Invoice: {selectedInvoice.invoiceNumber}
          </h2>
          <p className="text-gray-600 mb-2">Supplier: {selectedInvoice.supplierName}</p>
          <p className="text-gray-600 mb-4">Purchase Date: {selectedInvoice.purchaseDate}</p>

          <h3 className="text-lg font-medium text-gray-700 mb-3">Items in Invoice:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Item Name</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Purchased Qty</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Returned Qty</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Unit Price</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Current Stock</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Scaled</th>
                  <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">Return Qty</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{item.name}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{item.purchasedQuantity}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{item.returnedQuantity}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">{stock[item.id] || 0}</td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">
                      {item.scaled ? <span className="text-red-500">Yes</span> : <span className="text-green-500">No</span>}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">
                      <input
                        type="number"
                        min="0"
                        max={item.purchasedQuantity - item.returnedQuantity}
                        value={returnQuantities[item.id] || ""}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                        className="shadow appearance-none border rounded w-24 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        disabled={item.scaled || (item.purchasedQuantity - item.returnedQuantity === 0)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!selectedInvoice && (
        <div className="p-4 text-center text-gray-500">
          Please select a purchase invoice from the dropdown above to view its details and process returns.
        </div>
      )}
      </div>
    </div>
  );
};