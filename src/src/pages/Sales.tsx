// import React, { useState } from "react";
// import { motion } from "motion/react";
// import { Search, Plus, Edit, Trash2, Receipt, FileText, DollarSign } from "lucide-react";
// import { mockSales } from "../data/salesData";
// import { mockProducts } from "../data/mockData";
// import { Sale, SaleItem } from "../models/sale.model";
// import { PDFButton } from "../components/PDFButton";
// import { generatePDF } from "../utils/pdfGenerator";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "../../components/ui/dialog";
// import { Label } from "../../components/ui/label";
// import { Input } from "../../components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import { Button } from "../../components/ui/button";

// declare module "jspdf" {
//   interface jsPDF {
//     autoTable: (options: any) => jsPDF;
//     lastAutoTable: {
//       finalY: number;
//     };
//   }
// }

// export const Sales: React.FC = () => {
//   const [sales, setSales] = useState<Sale[]>(mockSales);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  
//   // Invoice form data
//   const [customerName, setCustomerName] = useState("");
//   const [customerEmail, setCustomerEmail] = useState("");
//   const [customerPhone, setCustomerPhone] = useState("");
//   const [items, setItems] = useState<SaleItem[]>([
//     {
//       id: "1",
//       productId: "",
//       productName: "",
//       quantity: 1,
//       unitPrice: 0,
//       total: 0,
//     },
//   ]);
//   const [discount, setDiscount] = useState(0);
//   const [taxRate] = useState(10); // 10% tax

//   const filteredSales = sales.filter(
//     (sale) =>
//       sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       sale.customerName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleGeneratePDF = () => {
//     const headers = ["Invoice #", "Customer", "Items", "Total", "Payment", "Status", "Date"];
//     const data = sales.map((s) => [
//       s.invoiceNumber,
//       s.customerName,
//       `${s.items.length} items`, `₹${s.total.toFixed(2)}`,
//       s.paymentMethod.toUpperCase(),
//       s.paymentStatus.toUpperCase(),
//       new Date(s.saleDate).toLocaleDateString(),
//     ]);
//     generatePDF("Sales Report", headers, data, "sales-report.pdf");
//   };

//   const addItem = () => {
//     setItems([
//       ...items,
//       {
//         id: `${items.length + 1}`,
//         productId: "",
//         productName: "",
//         quantity: 1,
//         unitPrice: 0,
//         total: 0,
//       },
//     ]);
//   };

//   const removeItem = (index: number) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   const updateItem = (index: number, field: keyof SaleItem, value: any) => {
//     const newItems = [...items];
//     newItems[index] = { ...newItems[index], [field]: value };
    
//     // Recalculate total for the item
//     if (field === "quantity" || field === "unitPrice") {
//       newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
//     }
    
//     setItems(newItems);
//   };

//   const calculateSubtotal = () => {
//     return items.reduce((sum, item) => sum + item.total, 0);
//   };

//   const calculateTax = () => {
//     return (calculateSubtotal() * taxRate) / 100;
//   };

//   const calculateTotal = () => {
//     return calculateSubtotal() + calculateTax() - discount;
//   };

//   const generateInvoicePDF = () => {
//     const doc = new jsPDF();
    
//     // Company Header
//     doc.setFontSize(24);
//     doc.setTextColor(59, 130, 246);
//     doc.text("InvenTrack", 14, 20);
    
//     doc.setFontSize(10);
//     doc.setTextColor(100);
//     doc.text("Inventory Management System", 14, 28);
//     doc.text("123 Business Street, City, State 12345", 14, 33);
//     doc.text("Phone: (555) 123-4567 | Email: info@inventtrack.com", 14, 38);
    
//     // Invoice Title
//     doc.setFontSize(20);
//     doc.setTextColor(0);
//     doc.text("INVOICE", 14, 55);
    
//     // Invoice Details
//     doc.setFontSize(10);
//     const invoiceNumber = `INV-2025-${String(sales.length + 1).padStart(3, "0")}`;
//     doc.text(`Invoice #: ${invoiceNumber}`, 14, 65);
//     doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 71);
    
//     // Customer Details
//     doc.text("Bill To:", 14, 85);
//     doc.setFont("helvetica", "bold");
//     doc.text(customerName, 14, 91);
//     doc.setFont("helvetica", "normal");
//     if (customerEmail) doc.text(customerEmail, 14, 97);
//     if (customerPhone) doc.text(customerPhone, 14, 103);
    
//     // Items Table
//     const tableData = items.map((item) => [
//       item.productName,
//       item.quantity.toString(),
//       `₹${item.unitPrice.toFixed(2)}`,
//       `₹${item.total.toFixed(2)}`,
//     ]);
    
//     doc.autoTable({
//       head: [["Product", "Quantity", "Unit Price", "Total"]],
//       body: tableData,
//       startY: 115,
//       theme: "striped",
//       headStyles: {
//         fillColor: [59, 130, 246],
//         textColor: 255,
//         fontStyle: "bold",
//       },
//       styles: {
//         fontSize: 10,
//       },
//     });
    
//     // Summary
//     const finalY = doc.lastAutoTable.finalY + 10;
//     const rightAlign = 140;
    
//     doc.text("Subtotal:", rightAlign, finalY);
//     doc.text(`₹${calculateSubtotal().toFixed(2)}`, 180, finalY, { align: "right" });
    
//     doc.text(`Tax (${taxRate}%):`, rightAlign, finalY + 7);
//     doc.text(`₹${calculateTax().toFixed(2)}`, 180, finalY + 7, { align: "right" });
    
//     doc.text("Discount:", rightAlign, finalY + 14);
//     doc.text(`-₹${discount.toFixed(2)}`, 180, finalY + 14, { align: "right" });
    
//     doc.setFontSize(12);
//     doc.setFont("helvetica", "bold");
//     doc.text("Total:", rightAlign, finalY + 24);
//     doc.text(`₹${calculateTotal().toFixed(2)}`, 180, finalY + 24, { align: "right" });
    
//     // Footer
//     doc.setFontSize(9);
//     doc.setFont("helvetica", "normal");
//     doc.setTextColor(100);
//     doc.text("Thank you for your business!", 105, 270, { align: "center" });
//     doc.text("Terms & Conditions apply", 105, 275, { align: "center" });
    
//     // Save PDF
//     doc.save(`${invoiceNumber}.pdf`);
    
//     // Save sale
//     const newSale: Sale = {
//       id: `sale-${Date.now()}`,
//       invoiceNumber,
//       customerName,
//       customerEmail,
//       customerPhone,
//       items,
//       subtotal: calculateSubtotal(),
//       tax: calculateTax(),
//       discount,
//       total: calculateTotal(),
//       paymentMethod: "cash",
//       paymentStatus: "pending",
//       saleDate: new Date().toISOString(),
//       createdBy: "Current User",
//     };
    
//     setSales([newSale, ...sales]);
    
//     // Reset form
//     setCustomerName("");
//     setCustomerEmail("");
//     setCustomerPhone("");
//     setItems([
//       {
//         id: "1",
//         productId: "",
//         productName: "",
//         quantity: 1,
//         unitPrice: 0,
//         total: 0,
//       },
//     ]);
//     setDiscount(0);
//     setIsInvoiceDialogOpen(false);
//   };

//   const handleDelete = () => {
//     if (selectedSale) {
//       setSales(sales.filter((s) => s.id !== selectedSale.id));
//       setIsDeleteDialogOpen(false);
//       setSelectedSale(null);
//     }
//   };

//   const getPaymentStatusColor = (status: string) => {
//     switch (status) {
//       case "paid":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "partial":
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h2 className="text-gray-900 mb-2">Sales Management</h2>
//           <p className="text-gray-600">Create invoices and manage sales</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <PDFButton onClick={handleGeneratePDF} />
//           <button
//             onClick={() => {
//               setCustomerName("");
//               setCustomerEmail("");
//               setCustomerPhone("");
//               setItems([
//                 {
//                   id: "1",
//                   productId: "",
//                   productName: "",
//                   quantity: 1,
//                   unitPrice: 0,
//                   total: 0,
//                 },
//               ]);
//               setDiscount(0);
//               setIsInvoiceDialogOpen(true);
//             }}
//             className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
//           >
//             <Receipt className="w-5 h-5" />
//             <span>New Invoice</span>
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-white/20 rounded-lg">
//               <DollarSign className="w-6 h-6" />
//             </div>
//             <p className="text-sm opacity-90">Today</p>
//           </div>
//           <h3 className="text-3xl mb-1">
//             ₹{sales.reduce((sum, s) => sum + s.total, 0).toFixed(2)}
//           </h3>
//           <p className="text-sm opacity-90">Total Sales</p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-white/20 rounded-lg">
//               <Receipt className="w-6 h-6" />
//             </div>
//             <p className="text-sm opacity-90">This Month</p>
//           </div>
//           <h3 className="text-3xl mb-1">{sales.length}</h3>
//           <p className="text-sm opacity-90">Invoices</p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-white/20 rounded-lg">
//               <FileText className="w-6 h-6" />
//             </div>
//             <p className="text-sm opacity-90">Average</p>
//           </div>
//           <h3 className="text-3xl mb-1">
//             ₹{sales.length > 0 ? (sales.reduce((sum, s) => sum + s.total, 0) / sales.length).toFixed(2) : "0.00"}
//           </h3>
//           <p className="text-sm opacity-90">Per Sale</p>
//         </motion.div>
//       </div>

//       {/* Search */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search sales..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* Sales Table */}
//       <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
//                   Invoice #
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
//                   Customer
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
//                   Items
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
//                   Total
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
//                   Payment
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredSales.map((sale, index) => (
//                 <motion.tr
//                   key={sale.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.05 }}
//                   className="hover:bg-blue-50 transition-colors"
//                 >
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                       <Receipt className="w-4 h-4 text-blue-500" />
//                       <span className="text-blue-600">{sale.invoiceNumber}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <p className="text-gray-900">{sale.customerName}</p>
//                     <p className="text-sm text-gray-500">{sale.customerEmail}</p>
//                   </td>
//                   <td className="px-6 py-4 text-gray-600">{sale.items.length} items</td><td className="px-6 py-4 text-gray-900">₹{sale.total.toFixed(2)}</td>
//                   <td className="px-6 py-4">
//                     <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">
//                       {sale.paymentMethod}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs border capitalize ${getPaymentStatusColor(
//                         sale.paymentStatus
//                       )}`}
//                     >
//                       {sale.paymentStatus}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-gray-600">
//                     {new Date(sale.saleDate).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => {
//                           setSelectedSale(sale);
//                           setIsDeleteDialogOpen(true);
//                         }}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Invoice Dialog */}
//       <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Create New Invoice</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-6 py-4">
//             {/* Customer Details */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="customerName">Customer Name *</Label>
//                 <Input
//                   id="customerName"
//                   value={customerName}
//                   onChange={(e) => setCustomerName(e.target.value)}
//                   placeholder="John Doe"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="customerEmail">Email</Label>
//                 <Input
//                   id="customerEmail"
//                   type="email"
//                   value={customerEmail}
//                   onChange={(e) => setCustomerEmail(e.target.value)}
//                   placeholder="john@example.com"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="customerPhone">Phone</Label>
//                 <Input
//                   id="customerPhone"
//                   value={customerPhone}
//                   onChange={(e) => setCustomerPhone(e.target.value)}
//                   placeholder="+1 234 567 8900"
//                 />
//               </div>
//             </div>

//             {/* Items */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <Label>Invoice Items</Label>
//                 <Button onClick={addItem} size="sm" variant="outline">
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Item
//                 </Button>
//               </div>

//               {items.map((item, index) => (
//                 <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-4 bg-gray-50 rounded-lg">
//                   <div className="col-span-4 space-y-2">
//                     <Label>Product Name</Label>
//                     <Input
//                       value={item.productName}
//                       onChange={(e) => updateItem(index, "productName", e.target.value)}
//                       placeholder="Product name"
//                     />
//                   </div>
//                   <div className="col-span-2 space-y-2">
//                     <Label>Quantity</Label>
//                     <Input
//                       type="number"
//                       value={item.quantity}
//                       onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
//                       min="1"
//                     />
//                   </div>
//                   <div className="col-span-2 space-y-2">
//                     <Label>Unit Price</Label>
//                     <Input
//                       type="number"
//                       value={item.unitPrice}
//                       onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
//                       step="0.01"
//                       min="0"
//                     />
//                   </div>
//                   <div className="col-span-2 space-y-2">
//                     <Label>Total</Label>
//                     <Input value={`₹${item.total.toFixed(2)}`} disabled />
//                   </div>
//                   <div className="col-span-2">
//                     {items.length > 1 && (
//                       <Button
//                         onClick={() => removeItem(index)}
//                         size="sm"
//                         variant="destructive"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Summary */}
//             <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg space-y-3">
//               <div className="flex justify-between text-gray-700">
//                 <span>Subtotal:</span>
//                 <span>₹{calculateSubtotal().toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-gray-700">
//                 <span>Tax ({taxRate}%):</span>
//                 <span>₹{calculateTax().toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <Label>Discount:</Label>
//                 <Input
//                   type="number"
//                   value={discount}
//                   onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
//                   className="w-32"
//                   step="0.01"
//                   min="0"
//                 />
//               </div>
//               <div className="pt-3 border-t border-gray-300 flex justify-between text-xl">
//                 <span>Total:</span>
//                 <span className="text-blue-600">₹{calculateTotal().toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//           <DialogFooter>
//             <button
//               onClick={() => setIsInvoiceDialogOpen(false)}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={generateInvoicePDF}
//               disabled={!customerName || items.length === 0 || items.some((i) => !i.productName)}
//               className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Generate & Save Invoice
//             </button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Dialog */}
//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete Sale</DialogTitle>
//           </DialogHeader>
//           <p className="text-gray-600">
//             Are you sure you want to delete invoice "{selectedSale?.invoiceNumber}"? This action cannot be undone.
//           </p>
//           <DialogFooter>
//             <button
//               onClick={() => setIsDeleteDialogOpen(false)}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDelete}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               Delete
//             </button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };
