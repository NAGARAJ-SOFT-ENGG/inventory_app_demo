// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Search, Plus, Edit, Trash2, Printer } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "../../components/ui/dialog"; 
// import { mockProducts, mockSuppliers, mockScalesItems } from "../data/mockData";
// import { ScalesItem } from "../models/scales.model";
// import { Label } from "../../components/ui/label";
// import { Input } from "../../components/ui/input";
// import { Button } from "../../components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import { getCurrentDateTime } from "../utils/dateUtils";

// // Mock data for dropdowns, assuming these are from your master files
// const mockQuantities = [
//   { id: 1, unit: 'Ton', value: 1000 },
//   { id: 2, unit: 'Kg', value: 1 },
//   { id: 3, unit: '25 bag', value: 25 },
//   { id: 4, unit: '50 bag', value: 50 },
// ];

// const mockPrices = [
//     { id: 1, name: 'Cement Bag Price', value: 350 },
//     { id: 2, name: 'Steel Ton Price', value: 55000 },
// ];

// const ScalesScreen = () => {
//   const [scalesItems, setScalesItems] = useState<ScalesItem[]>(mockScalesItems);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedScalesItem, setSelectedScalesItem] = useState<ScalesItem | null>(null);
//   const [formData, setFormData] = useState<Partial<ScalesItem>>({});

//   const filteredScalesItems = scalesItems.filter(
//     (item) =>
//       item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleAdd = () => {
//     const newItem: ScalesItem = {
//       id: `scale-${Date.now()}`,
//       supplierName: formData.supplierName || "",
//       productName: formData.productName || "",
//       qty: formData.qty || 0,
//       price: formData.price || 0,
//       date: formData.date || new Date().toISOString().split('T')[0],
//       time: formData.time || new Date().toTimeString().split(' ')[0].substring(0,5),
//       vehicleNumber: formData.vehicleNumber || "",
//       transportName: formData.transportName || "",
//       driverName: formData.driverName || "",
//       mobileNumber: formData.mobileNumber || "",
//     };
//     setScalesItems([newItem, ...scalesItems]);
//     setIsAddDialogOpen(false);
//     setFormData({});
//   };

//   const handleEdit = () => {
//     if (selectedScalesItem) {
//       setScalesItems(
//         scalesItems.map((item) =>
//           item.id === selectedScalesItem.id ? { ...item, ...formData } : item
//         )
//       );
//       setIsEditDialogOpen(false);
//       setSelectedScalesItem(null);
//       setFormData({});
//     }
//   };

//   const handleDelete = () => {
//     if (selectedScalesItem) {
//       setScalesItems(scalesItems.filter((item) => item.id !== selectedScalesItem.id));
//       setIsDeleteDialogOpen(false);
//       setSelectedScalesItem(null);
//     }
//   };

//   const openEditDialog = (item: ScalesItem) => {
//     setSelectedScalesItem(item);
//     setFormData(item);
//     setIsEditDialogOpen(true);
//   };

//   const handlePrint = (item: ScalesItem) => {
//     const printContent = `
//       <h2>Scales Receipt</h2>
//       <p><strong>Supplier:</strong> ${item.supplierName}</p>
//       <p><strong>Product:</strong> ${item.productName}</p>
//       <p><strong>Quantity:</strong> ${item.qty}</p>
//       <p><strong>Price:</strong> ${item.price}</p>
//       <p><strong>Date:</strong> ${item.date} ${item.time}</p>
//       <p><strong>Vehicle:</strong> ${item.vehicleNumber}</p>
//       <p><strong>Transport:</strong> ${item.transportName}</p>
//       <p><strong>Driver:</strong> ${item.driverName} (${item.mobileNumber})</p>
//     `;
//     const printWindow = window.open('', '', 'height=400,width=600');
//     if (printWindow) {
//       printWindow.document.write(printContent);
//       printWindow.document.close();
//       printWindow.focus();
//       printWindow.print();
//       // As per requirement for 2 copies
//       printWindow.print();
//       printWindow.close();
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h2 className="text-gray-900 mb-2">Scales Screen</h2>
//           <p className="text-gray-600">Manage your scales entries</p>
//         </div>
//         <Button onClick={() => {
//           const { date, time } = getCurrentDateTime();
//           setFormData({ date, time });
//           setIsAddDialogOpen(true);
//         }} variant="gradient" size="lg">
//           <Plus className="w-5 h-5 mr-2" />
//           <span>Add Entry</span>
//         </Button>
//       </div>

//       {/* Search */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <Input
//             type="text"
//             placeholder="Search by supplier, product, driver..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10"
//           />
//         </div>
//       </div>

//       {/* Scales Table */}
//       <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Supplier</th>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Product</th>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Qty</th>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Price</th>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Date & Time</th>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Vehicle No.</th>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Driver</th>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredScalesItems.map((item, index) => (
//                 <motion.tr key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="hover:bg-blue-50 transition-colors">
//                   <td className="px-6 py-4 text-gray-900">{item.supplierName}</td>
//                   <td className="px-6 py-4 text-gray-600">{item.productName}</td>
//                   <td className="px-6 py-4 text-gray-600">{item.qty}</td>
//                   <td className="px-6 py-4 text-gray-600">${item.price.toFixed(2)}</td>
//                   <td className="px-6 py-4 text-gray-600">{item.date} @ {item.time}</td>
//                   <td className="px-6 py-4 text-gray-600">{item.vehicleNumber}</td>
//                   <td className="px-6 py-4 text-gray-600">{item.driverName} ({item.mobileNumber})</td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                       <Button variant="ghost" size="icon" onClick={() => handlePrint(item)} className="text-gray-600 hover:bg-gray-100"><Printer className="w-4 h-4" /></Button>
//                       <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)} className="text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4" /></Button>
//                       <Button variant="ghost" size="icon" onClick={() => { setSelectedScalesItem(item); setIsDeleteDialogOpen(true); }} className="text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
//                     </div>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Add/Edit Dialog */}
//       <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => { if (!open) { setIsAddDialogOpen(false); setIsEditDialogOpen(false); } }}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader><DialogTitle>{isAddDialogOpen ? 'Add Scales Entry' : 'Edit Scales Entry'}</DialogTitle></DialogHeader>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
//             <div className="space-y-2"><Label>Supplier Name</Label><Select value={formData.supplierName} onValueChange={(value) => setFormData({ ...formData, supplierName: value })}><SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger><SelectContent>{mockSuppliers.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent></Select></div>
//             <div className="space-y-2"><Label>Product Name</Label><Select value={formData.productName} onValueChange={(value) => setFormData({ ...formData, productName: value })}><SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger><SelectContent>{mockProducts.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}</SelectContent></Select></div>
//             <div className="space-y-2"><Label>Quantity</Label><Select value={formData.qty?.toString()} onValueChange={(value) => setFormData({ ...formData, qty: parseInt(value) })}><SelectTrigger><SelectValue placeholder="Select quantity" /></SelectTrigger><SelectContent>{mockQuantities.map(q => <SelectItem key={q.id} value={q.value.toString()}>{q.unit} ({q.value})</SelectItem>)}</SelectContent></Select></div>
//             <div className="space-y-2"><Label>Price</Label><Select value={formData.price?.toString()} onValueChange={(value) => setFormData({ ...formData, price: parseFloat(value) })}><SelectTrigger><SelectValue placeholder="Select master price" /></SelectTrigger><SelectContent>{mockPrices.map(p => <SelectItem key={p.id} value={p.value.toString()}>{p.name} (${p.value})</SelectItem>)}</SelectContent></Select></div>
//             <div className="space-y-2 md:col-span-2"><Label>Or Enter Price (Free Text)</Label><Input type="number" placeholder="Enter custom price" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} /></div>
//             <div className="space-y-2"><Label>Date</Label><Input type="date" value={formData.date || ''} onChange={(e) => setFormData({ ...formData, date: e.target.value })} /></div>
//             <div className="space-y-2"><Label>Time</Label><Input type="time" value={formData.time || ''} onChange={(e) => setFormData({ ...formData, time: e.target.value })} /></div>
//             <div className="space-y-2"><Label>Vehicle Number</Label><Input value={formData.vehicleNumber || ''} onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })} /></div>
//             <div className="space-y-2"><Label>Transport Name</Label><Input value={formData.transportName || ''} onChange={(e) => setFormData({ ...formData, transportName: e.target.value })} /></div>
//             <div className="space-y-2"><Label>Driver Name</Label><Input value={formData.driverName || ''} onChange={(e) => setFormData({ ...formData, driverName: e.target.value })} /></div>
//             <div className="space-y-2"><Label>Mobile Number</Label><Input value={formData.mobileNumber || ''} onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} /></div>
//           </div>
//           <DialogFooter><Button variant="gradient" size="lg" onClick={isAddDialogOpen ? handleAdd : handleEdit}>{isAddDialogOpen ? 'Add Entry' : 'Save Changes'}</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Delete Scales Entry</DialogTitle></DialogHeader>
//           <p>Are you sure you want to delete the entry for "{selectedScalesItem?.productName}" from "{selectedScalesItem?.supplierName}"?</p>
//           <DialogFooter><Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ScalesScreen;

import React, { useState, useEffect } from "react";
import { 
  X, 
  Plus, 
  ScanBarcode, 
  ChevronDown, 
  Trash2,
  Printer
} from "lucide-react"; 
import { mockItems, mockQuantities, mockSuppliers } from "../data/mockData";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import ItemsTable from "../../components/ui/itemsTable";
import { Textarea } from "../../components/ui/textarea";
import { generatePurchaseInvoicePDF } from "../utils/purchaseInvoiceGenerator";


// --- MAIN COMPONENT ---

const ScalesScreen = () => {
  // --- STATE ---
  const [items, setItems] = useState([
    // { id: 1, name: "POPCORN T-SHIRT", description: "", hsn: "", qty: 1, unit: "PCS", price: 350, discount: 0, tax: 0, amount: 350 }
  ]);

  const [view, setView] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      setView(window.innerWidth < 768 ? 'mobile' : 'desktop');
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial view
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [globalState, setGlobalState] = useState({
    invoiceNo: "1",
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    supplierName: "Walk in", // Add supplier name to global state
    paymentTerms: "30",
    roundOff: 0,
    termsVisible: true,
    payments: [{ mode: "Cash", amount: 0 }],
    discountType: 'Percentage',
    discountValue: 0,
    vehicleNumber: "",
    driverName: "",
    driverMobileNumber: "",
  });




  const selectedSupplier = React.useMemo(() => {
    return mockSuppliers.find(s => s.name === globalState.supplierName) || null;
  }, [globalState.supplierName]);

  // --- CALCULATIONS ---

  const calculateRow = (item) => {
    // 1. Base Amount
    const baseAmount = (parseFloat(String(item.qty)) || 0) * (parseFloat(String(item.price)) || 0);
    const taxableValue = baseAmount - (parseFloat(String(item.discount)) || 0);
    const taxVal = taxableValue * ((item.tax || 0) / 100);
    const finalAmount = taxableValue + taxVal;

    return { 
      ...item, 
      amount: finalAmount 
    };
  };

  // Recalculate totals whenever items or global state changes
  const totals = React.useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const totalDiscount = items.reduce((sum, item) => sum + (parseFloat(String(item.discount)) || 0), 0);
    const taxableAmount = subtotal - totalDiscount;
    const totalTax = items.reduce((sum, item) => sum + ((item.qty * item.price) - (parseFloat(String(item.discount)) || 0)) * ((parseFloat(String(item.tax)) || 0) / 100), 0);
    
    let total = subtotal - totalDiscount + totalTax;

    let globalDiscountAmount = 0;
    if (globalState.discountType === 'Percentage') {
      globalDiscountAmount = (total * (globalState.discountValue || 0)) / 100;
    } else { // Amount
      globalDiscountAmount = globalState.discountValue || 0;
    }
    total -= globalDiscountAmount;

    const roundedTotal = Math.round(total);
    const roundOffValue = roundedTotal - total;
    total = roundedTotal;

    const totalAmountPaid = globalState.payments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );
    const balanceDue = total - totalAmountPaid;


    return { subtotal, totalDiscount, taxableAmount, totalTax, total, roundOffValue, balanceDue, totalAmountPaid, globalDiscountAmount };
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
      price: '',
      discount: '',
      tax: '',
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(items.map((item) => {
      if (item.id === id && field === 'name') {
        const selectedMockItem = mockItems.find(mi => mi.productName === value);
        if (selectedMockItem) {
          // When item name changes, update the price from mock data
          item.price = selectedMockItem.price;
        }
      }
      if (item.id === id) {
        let updatedValue = value;
        if (['price', 'discount', 'tax', 'qty'].includes(field)) {
          // Allow empty string, otherwise parse to float
          updatedValue = value === '' ? '' : parseFloat(value) || 0;
        }
        const updatedItem = { ...item, [field]: updatedValue };
        return calculateRow(updatedItem);
      }
      return item;
    }));
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
    generatePurchaseInvoicePDF(items, totals, globalState, selectedSupplier, 'scales');
  };

  return (
    <div className="min-h-screen  font-sans text-gray-800 pb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between text-gray-900 mb-2 sticky top-0 z-20 print-hide">       
         <h1 className="text-xl font-semibold text-gray-800">Create Scales Invoice</h1>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handlePrint}>
            <Printer className="h-5 w-5" />
          </Button>
          <Button variant="gradient" className="py-2" >Save Scales Entry</Button>
        </div>
      </div>

      <div id="printable-invoice" className="max-w-[1600px] mx-auto p-0 space-y-4">
        
        {/* --- MAIN FORM CARD --- */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          
          {/* Top Section: Party & Details */}
          <div className="p-4 border-b border-gray-200 space-y-4">
            
            {/* First Row: Party and Invoice No */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <Label>Bill To</Label>
                <Select 
                  value={globalState.supplierName} 
                  onValueChange={(value) => setGlobalState({...globalState, supplierName: value})}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Walk in">Walk in</SelectItem>
                    {mockSuppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.name}>{supplier.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                  <Label>Scales Inv No</Label>
                  <Input value={globalState.invoiceNo} onChange={(e) => setGlobalState({...globalState, invoiceNo: e.target.value})} className="bg-gray-100" />
              </div>
            </div>

            {/* Second Row: Dates and Terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Scales Inv Date</Label>
                  <Input 
                    type="date" 
                    value={globalState.date} 
                    onChange={(e) => setGlobalState({...globalState, date: e.target.value})}
                    className="bg-gray-100" 
                  /> 
                </div>
                <div className="space-y-2">
                   <Label>Payment Terms</Label>
                    <Input placeholder="e.g., 30 days" />
                </div>
                <div className="space-y-2">
                   <Label>Due Date</Label>
                   <Input 
                      type="date" 
                      value={globalState.dueDate} 
                      onChange={(e) => setGlobalState({...globalState, dueDate: e.target.value})}
                      className="bg-gray-100" 
                    />
                </div>
            </div>
          </div>

          {/* Vehicle & Transport Details */}
          <div className="p-4 border-b border-gray-200 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Vehicle & Transport Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Vehicle Number</Label>
                <Input
                  value={globalState.vehicleNumber}
                  onChange={(e) => setGlobalState({ ...globalState, vehicleNumber: e.target.value })}
                  placeholder="e.g., KA01AB1234"
                />
              </div>
              <div className="space-y-2">
                <Label>Driver Name</Label>
                <Input
                  value={globalState.driverName}
                  onChange={(e) => setGlobalState({ ...globalState, driverName: e.target.value })}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Driver Mobile Number</Label>
                <Input
                  value={globalState.driverMobileNumber}
                  onChange={(e) => setGlobalState({ ...globalState, driverMobileNumber: e.target.value })}
                  placeholder="e.g., +919876543210"
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
              view={view} />
          </div>

          </div>

          {/* --- BOTTOM SECTION --- */}
          <div className="flex flex-col lg:flex-row border-t border-gray-200 print-hide">
            
            {/* Left: Notes & Terms */}
            <div className="w-full lg:w-1/2 p-4 space-y-4 border-r border-gray-200 bg-white">
              <div className="space-y-2">
                <Label htmlFor="remarks" className="text-gray-700 font-semibold">Remarks / Notes</Label>
                <Textarea
                  id="remarks"
                  placeholder="Enter any remarks for the invoice..."
                  value={globalState.remarks}
                  onChange={(e) => setGlobalState({ ...globalState, remarks: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Right: Calculations */}
            <div className="w-full lg:w-1/2 p-2 space-y-3 bg-white">
               
               {/* Discount */}
               <div className="flex justify-between items-center text-sm px-2">
                 <span className="text-gray-600">Discount</span>
                 <div className="flex items-center gap-2">
                   <Input
                     type="number"
                     placeholder="0"
                     value={globalState.discountValue || ''}
                     onChange={(e) => setGlobalState({ ...globalState, discountValue: parseFloat(e.target.value) || 0 })}
                     className="w-24 h-8 text-right"
                   />
                   <Select
                     value={globalState.discountType}
                     onValueChange={(value) => setGlobalState({ ...globalState, discountType: value })}
                   >
                     <SelectTrigger className="w-20 h-8">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="Percentage">%</SelectItem>
                       <SelectItem value="Amount">₹</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>

               {/* Total Amount */}
               <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-800">Total Amount</span>
                  <div className="bg-gray-100 text-gray-400 px-4 py-1 rounded-md text-sm font-medium min-w-[140px] text-right border border-gray-200">
                    ₹ {(totals.total || 0).toFixed(2)} 
                  </div>
               </div>
               
               {/* Payment Section */}
               <div className="space-y-4 bg-gray-100/50 p-4 rounded-lg border border-gray-100 print-hide">
                  <div className="flex justify-end">
                     <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 cursor-pointer select-none" htmlFor="full-paid">Mark as fully paid</label>
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
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <span className="text-sm font-medium text-gray-600">Payment {index + 1}</span>
                      <div className="flex flex-col sm:flex-row flex-1 gap-2 w-full">
                        <div className="relative flex-1">
                          <Input
                            type="number"
                            placeholder="Amount"
                            className="bg-white w-full"
                            value={payment.amount || ""}
                            onChange={(e) => {
                              const newPayments = [...globalState.payments];
                              newPayments[index].amount = parseFloat(e.target.value) || 0;
                              setGlobalState({ ...globalState, payments: newPayments });
                            }}
                          />
                        </div>
                        <Select
                          value={payment.mode}
                          onValueChange={(value) => {
                            const newPayments = [...globalState.payments];
                            newPayments[index].mode = value;
                            setGlobalState({ ...globalState, payments: newPayments });
                          }}
                        >
                          <SelectTrigger className="w-40 bg-white"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="UPI/Bank Transfer">UPI/Bank Transfer</SelectItem>
                            <SelectItem value="Card">Card</SelectItem>
                          </SelectContent>
                        </Select>
                        {globalState.payments.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => handleRemovePayment(index)} className="text-red-500 hover:bg-red-100">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-start">
                    <Button variant="link" onClick={handleAddPayment} className="p-0 h-auto text-blue-600">
                      <Plus className="h-4 w-4 mr-1" /> Add another payment
                    </Button>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Total Paid</span>
                    <span className="font-semibold text-gray-800">₹ {totalAmountPaid.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                     <span className="text-green-600 font-medium text-sm">Balance Amount</span>
                     <span className="text-green-600 font-bold text-lg">₹ {totals.balanceDue > 0 ? (totals.balanceDue || 0).toFixed(2) : '0.00'}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ScalesScreen;