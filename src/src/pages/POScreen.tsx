import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  ScanBarcode,
  ChevronDown,
  Trash2,
  Edit,
  Printer,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { mockItems, mockPOItems, mockSuppliers } from "../data/mockData";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent } from "../../components/ui/card";
import ItemsTable from "../../components/ui/itemsTable";
import jsPDF from "jspdf";
import { generatePurchaseInvoicePDF } from "../utils/purchaseInvoiceGenerator";

// --- MAIN COMPONENT ---

const POScreen = () => {
  // --- STATE ---
  const [items, setItems] = useState([
    // Initial item structure
  ]);

  const [purchases, setPurchases] = useState(mockPOItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaveConfirmationDialogOpen, setIsSaveConfirmationDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null); // To track which item is being edited
  const [view, setView] = useState<"desktop" | "mobile">("desktop");

  const filteredPurchases = purchases.filter(
    (p) =>
      (p.supplier.name && p.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.globalState.invoiceNo && p.globalState.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    const handleResize = () => {
      setView(window.innerWidth < 768 ? "mobile" : "desktop");
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial view
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initialGlobalState = {
    invoiceNo: "1",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    supplierName: "",
    paymentTerms: "30",
    roundOff: 0,
    payments: [{ mode: "Cash", amount: 0 }],
    vehicleNumber: "",
    driverName: "",
    driverMobileNumber: "",
    termsVisible: true,
    remarks: "",
  };

  const [globalState, setGlobalState] = useState({
    invoiceNo: "1",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    supplierName: "", // Add supplier name to global state
    paymentTerms: "30",
    roundOff: 0,
    payments: [{ mode: "Cash", amount: 0 }],
    vehicleNumber: "",
    driverName: "",
    driverMobileNumber: "",
    termsVisible: true,
    remarks: "",
  });

  const selectedSupplier = React.useMemo(() => {
    return (
      mockSuppliers.find((s) => s.name === globalState.supplierName) || null
    );
  }, [globalState.supplierName]);

  // --- CALCULATIONS ---

  const calculateRow = (item) => {
    // 1. Base Amount
    const baseAmount =
      (parseFloat(String(item.qty)) || 0) *
      (parseFloat(String(item.price)) || 0);
    const taxableValue = baseAmount - (parseFloat(String(item.discount)) || 0);
    const taxVal = taxableValue * ((item.tax || 0) / 100);
    const finalAmount = taxableValue + taxVal;

    return {
      ...item,
      amount: finalAmount,
    };
  };

  // Recalculate totals whenever items or global state changes
  const totals = React.useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );
    const totalDiscount = items.reduce(
      (sum, item) => sum + (parseFloat(String(item.discount)) || 0),
      0
    );
    const taxableAmount = subtotal - totalDiscount;
    const totalTax = items.reduce(
      (sum, item) =>
        sum +
        (item.qty * item.price - (parseFloat(String(item.discount)) || 0)) *
          ((parseFloat(String(item.tax)) || 0) / 100),
      0
    );

    let total = subtotal - totalDiscount + totalTax;

    const roundedTotal = Math.round(total);
    const roundOffValue = roundedTotal - total;
    total = roundedTotal;

    const totalAmountPaid = globalState.payments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );
    const balanceDue = total - totalAmountPaid;

    return {
      subtotal,
      taxableAmount,
      totalTax,
      total,
      roundOffValue,
      balanceDue,
    };
  }, [items, globalState]);

  // --- HANDLERS ---

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      name: "",
      description: "",
      hsn: "",
      qty: 1,
      unit: "PCS",
      price: "",
      discount: "",
      tax: "",
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleDeletePurchase = () => {
    if (selectedPurchase) {
      setPurchases(purchases.filter((p) => p.id !== selectedPurchase.id));
      setIsDeleteDialogOpen(false);
      setSelectedPurchase(null);
    }
  };
  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === id && field === "name") {
          const selectedMockItem = mockItems.find(
            (mi) => mi.productName === value
          );
          if (selectedMockItem) {
            // When item name changes, update the price from mock data
            item.price = selectedMockItem.price;
          }
        }
        if (item.id === id) {
          let updatedValue = value;
          if (["price", "discount", "tax", "qty"].includes(field)) {
            // Allow empty string, otherwise parse to float
            updatedValue = value === "" ? "" : parseFloat(value) || 0;
          }
          const updatedItem = { ...item, [field]: updatedValue };
          return calculateRow(updatedItem);
        }
        return item;
      })
    );
  };

  const handleAddPayment = () => {
    setGlobalState((prevState) => ({
      ...prevState,
      payments: [...prevState.payments, { mode: "Cash", amount: 0 }],
    }));
  };

  const handleRemovePayment = (index: number) => {
    setGlobalState((prevState) => ({
      ...prevState,
      payments: prevState.payments.filter((_, i) => i !== index),
    }));
  };

  const totalAmountPaid = globalState.payments.reduce((sum, p) => sum + (p.amount || 0), 0);


  const handlePrint = () => {
    generatePurchaseInvoicePDF(items, totals, globalState, selectedSupplier, 'purchase');
  };

  const handleSave = () => {
    // Logic to save the purchase would go here.
    setIsSaveConfirmationDialogOpen(true);
  };

  const handleEditPurchase = (purchaseToEdit: any) => {
    // Set the form state with the data from the selected purchase
    setGlobalState({
      ...globalState, // keep some defaults if needed
      invoiceNo: purchaseToEdit.globalState.invoiceNo,
      date: purchaseToEdit.globalState.date,
      dueDate: purchaseToEdit.globalState.dueDate,
      supplierName: purchaseToEdit.supplier.name,
      payments: purchaseToEdit.globalState.payments || [{ mode: "Cash", amount: purchaseToEdit.globalState.amountPaid || 0 }],
      vehicleNumber: purchaseToEdit.vehicleNumber || "",
      driverName: purchaseToEdit.driverName || "",
      driverMobileNumber: purchaseToEdit.mobileNumber || "",
      remarks: purchaseToEdit.remarks || "",
    });

    // The items in mock data might have string percentages for tax/discount, convert them for the form
    const formItems = purchaseToEdit.items.map((item: any) => ({
      ...item,
      tax: parseFloat(item.tax) || 0,
      discount: parseFloat(item.discount) || 0,
    }));

    setItems(formItems);
    setEditingId(purchaseToEdit.globalState.invoiceNo); // Track the ID of the item being edited
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see the form
  };

  const handleClearForm = () => {
    setItems([]);
    setGlobalState(initialGlobalState);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 pb-6 space-y-6">
      <div
        id="printable-invoice"
        className="max-w-[1600px] mx-auto p-0 space-y-4"
      >
        {/* --- MAIN FORM CARD --- */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          {/* Top Section: Party & Details */}
          <div className="p-4 border-b border-gray-200 space-y-4">
            {/* First Row: Party and Invoice No */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <Label>Bill From</Label>
                <Select
                  value={globalState.supplierName}
                  onValueChange={(value) =>
                    setGlobalState({ ...globalState, supplierName: value })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSuppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.name}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Purchase Inv No</Label>
                <Input
                  value={globalState.invoiceNo}
                  onChange={(e) =>
                    setGlobalState({
                      ...globalState,
                      invoiceNo: e.target.value,
                    })
                  }
                  className="bg-gray-100"
                />
              </div>
            </div>

            {/* Second Row: Dates and Terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Purchase Inv Date</Label>
                <Input
                  type="date"
                  value={globalState.date}
                  onChange={(e) =>
                    setGlobalState({ ...globalState, date: e.target.value })
                  }
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Terms</Label>
                <Input placeholder="" />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={globalState.dueDate}
                  onChange={(e) =>
                    setGlobalState({ ...globalState, dueDate: e.target.value })
                  }
                  className="bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* --- ITEMS TABLE --- */}
          <div className="block">
            <ItemsTable
              items={items}
              handleAddItem={handleAddItem}
              handleDeleteItem={handleDeleteItem}
              updateItem={updateItem}
              view={view}
            />
          </div>

          {/* Subtotal Row */}
          {/* <div className="flex justify-end pt-4 pr-12 pb-4 gap-12 text-sm border-t border-gray-100 bg-white">
                 <div className="flex items-center gap-8">
                    <span className="text-xs font-bold text-gray-400 tracking-wider">SUBTOTAL</span>
                    <div className="flex gap-12"> 
                       <span className="w-24 text-right text-gray-400">₹ {(totals.taxableAmount || 0).toFixed(2)}</span>
                       <span className="w-24 text-right font-bold text-gray-800">₹ {(totals.subtotal || 0).toFixed(2)}</span>
                    </div>
                 </div>
             </div> */}
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="flex flex-col lg:flex-row border-t border-gray-200 print-hide">
          {/* Left: Notes & Terms */}

          {/* Right: Calculations */}
          <div className="w-full p-2 space-y-3 bg-white">
            {/* Additional Charges */}
            {/* <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-2">
                    <button className="text-blue-500 hover:underline flex items-center gap-1">
                        <Plus className="h-3 w-3" /> Add Additional Charges
                    </button>
                 </div>
                 <div className="w-32">
                    <Input 
                      type="number" 
                      className="text-right h-7"  
                      value={globalState.additionalCharges || ''}
                      onChange={(e) => setGlobalState({...globalState, additionalCharges: parseFloat(e.target.value) || 0})}
                    />
                 </div>
               </div> */}

            {/* Taxable Amount Display */}
            {/* <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-600">Taxable Amount</span>
                 <span className="font-medium text-gray-800">₹ {(totals.taxableAmount || 0).toFixed(2)}</span>
               </div> */}

            {/* Global Discount */}
            {/* <div className="flex justify-between items-center text-sm">
                 <button className="text-blue-500 hover:underline flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Add Discount
                 </button>
                 <div className="w-32 flex items-center gap-2 text-gray-600">
                    <span>-</span>
                    <Input 
                      type="number" 
                      className="text-right h-7"
                      value={globalState.globalDiscount || ''}
                      onChange={(e) => setGlobalState({...globalState, globalDiscount: parseFloat(e.target.value) || 0})}
                    />
                 </div>
               </div> */}

            {/* Round Off */}
            {/* <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2">
                     <input 
                        type="checkbox" 
                        id="autoRoundOff"
                        checked={globalState.isAutoRoundOff}
                        onChange={(e) => setGlobalState({...globalState, isAutoRoundOff: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4" 
                     />
                     <label htmlFor="autoRoundOff" className="text-sm text-gray-700 cursor-pointer">Auto Round Off</label>
                  </div>
                  
                  {globalState.isAutoRoundOff ? (
                     <span className="text-sm text-gray-600">{totals.roundOffValue > 0 ? '+' : ''}{(totals.roundOffValue || 0).toFixed(2)}</span>
                  ) : (
                    <div className="flex items-center gap-2">
                       <Select className="w-20 h-8 text-xs p-1">
                         <option>+ Add</option>
                         <option>- Reduce</option>
                       </Select>
                       <div className="relative">
                         <span className="absolute left-2 top-1.5 text-gray-1000 text-xs">₹</span>
                         <Input 
                            className="w-20 h-8 pl-5 text-right" 
                            value={globalState.roundOff || ''}
                            onChange={(e) => setGlobalState({...globalState, roundOff: parseFloat(e.target.value)})}
                         />
                       </div>
                    </div>
                  )}
               </div> */}

            {/* <div className="border-t border-gray-100 my-2"></div> */}

            {/* Total Amount */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-gray-800">
                Total Amount
              </span>
              <div className="bg-gray-100 text-gray-400 px-4 py-1 rounded-md text-sm font-medium min-w-[140px] text-right border border-gray-200">
                ₹ {(totals.total || 0).toFixed(2)}
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-4 bg-gray-100/50 p-4 rounded-lg border border-gray-100 print-hide">
              <div className="flex justify-end">
                <div className="flex items-center gap-2">
                  <label
                    className="text-xs text-gray-600 cursor-pointer select-none"
                    htmlFor="full-paid"
                  >
                    Mark as fully paid
                  </label>
                  <input
                    id="full-paid"
                    type="checkbox"
                    onChange={(e) =>
                      setGlobalState((prevState) => ({
                        ...prevState,
                        payments: e.target.checked
                          ? [{ mode: "Cash", amount: totals.total }]
                          : [{ mode: "Cash", amount: 0 }],
                      }))
                    }
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
                  />
                </div>
              </div>

              {globalState.payments.map((payment, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <span className="text-sm font-medium text-gray-600">
                    Payment {index + 1}
                  </span>
                  <div className="flex flex-col sm:flex-row flex-1 gap-2 w-full">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        placeholder="Amount"
                        className="bg-gray-100 w-full"
                        value={payment.amount || ""}
                        onChange={(e) => {
                          const newPayments = [...globalState.payments];
                          newPayments[index].amount =
                            parseFloat(e.target.value) || 0;
                          setGlobalState({
                            ...globalState,
                            payments: newPayments,
                          });
                        }}
                      />
                    </div>
                    <Select
                      value={payment.mode}
                      onValueChange={(value) => {
                        const newPayments = [...globalState.payments];
                        newPayments[index].mode = value;
                        setGlobalState({
                          ...globalState,
                          payments: newPayments,
                        });
                      }}
                    >
                      <SelectTrigger className="w-40 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="UPI/Bank Transfer">
                          UPI/Bank Transfer
                        </SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                      </SelectContent>
                    </Select>
                    {globalState.payments.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemovePayment(index)}
                        className="text-red-500 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-start">
                <Button
                  variant="link"
                  onClick={handleAddPayment}
                  className="p-0 h-auto text-blue-600"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add another payment
                </Button>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-600">
                  Total Paid
                </span>
                <span className="font-semibold text-gray-800">
                  ₹ {totalAmountPaid.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-green-600 font-medium text-sm">
                  Balance Amount
                </span>
                <span className="text-green-600 font-bold text-lg">
                  ₹{" "}
                  {totals.balanceDue > 0
                    ? (totals.balanceDue || 0).toFixed(2)
                    : "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Vehicle & Transport Details */}
          <div className="p-4 border-t border-gray-200 bg-white space-y-4 print-hide">
            <h3 className="text-sm font-semibold text-gray-700">Vehicle & Transport Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Vehicle Number</Label>
                <Input
                  value={globalState.vehicleNumber}
                  onChange={(e) => setGlobalState({ ...globalState, vehicleNumber: e.target.value })}
                  // placeholder="e.g., KA01AB1234"
                />
              </div>
              <div className="space-y-2">
                <Label>Driver Name</Label>
                <Input
                  value={globalState.driverName}
                  onChange={(e) => setGlobalState({ ...globalState, driverName: e.target.value })}
                  // placeholder="e.g., John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Driver Mobile Number</Label>
                <Input
                  value={globalState.driverMobileNumber}
                  onChange={(e) => setGlobalState({ ...globalState, driverMobileNumber: e.target.value })}
                  // placeholder="e.g., +919876543210"
                />
              </div>
            </div>
          </div>

          {/* Remarks Section */}
          <div className="p-4 border-t border-gray-200 bg-white space-y-4 print-hide">
            <div className="space-y-2">
              <Label htmlFor="remarks" className="text-gray-700 font-semibold">Remarks</Label>
              <Textarea
                id="remarks"
                // placeholder="Enter any remarks for the invoice..."
                value={globalState.remarks}
                onChange={(e) => setGlobalState({ ...globalState, remarks: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
          </div>

<div className="w-full p-4 border-t border-gray-200 bg-white flex flex-row justify-end gap-3 print-hide">
  <Button variant="outline" className="py-2" onClick={handleClearForm}>
    <X className="w-4 h-4 mr-2" /> Clear Form
  </Button>
  <Button variant="gradient" className="py-2" onClick={handleSave}>
    {editingId ? 'Update Purchase' : 'Save Purchase'}
  </Button>
</div>

        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-2 w-full max-w-[1600px] mx-auto">
        <CardContent className="flex items-center gap-2 p-0">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by supplier or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* PO Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-[1600px] mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Invoice No</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPurchases.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-6 py-1">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditPurchase(item)} className="text-blue-600 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={editingId === item.globalState.invoiceNo}
                        onClick={() => {
                          setSelectedPurchase(item);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{item.globalState.invoiceNo}</td>
                  <td className="px-6 py-4 text-gray-900">{item.supplier.name}</td>
                  <td className="px-6 py-4 text-gray-600">{item.items?.length ?? 0}</td>
                  <td className="px-6 py-4 text-gray-900">₹{(item.totals.total ?? 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-600">{item.globalState.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Confirmation Dialog */}
      <Dialog open={isSaveConfirmationDialogOpen} onOpenChange={setIsSaveConfirmationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase Saved</DialogTitle>
          </DialogHeader>
          <div className="p-6">
          <p>The purchase invoice has been saved successfully. Would you like to download the PDF invoice now?</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSaveConfirmationDialogOpen(false)}
            >
              No, Thanks
            </Button>
            <Button
              variant="gradient"
              onClick={() => {
                handlePrint();
                setIsSaveConfirmationDialogOpen(false);
              }}
            >
              Yes, Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Purchase Order</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0">
            <p>Are you sure you want to delete the PO for "{selectedPurchase?.productName}" from "{selectedPurchase?.supplierName}"?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePurchase}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POScreen;
