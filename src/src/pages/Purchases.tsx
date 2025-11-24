import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Plus, Calendar, DollarSign, Edit, Trash2, User, Search } from "lucide-react";
import { InventoryService } from "../services/inventory.service";
import { Purchase } from "../models/inventory.model";
import { Spinner } from "../components/Spinner";
import { PDFButton } from "../components/PDFButton";
import { generatePDF } from "../utils/pdfGenerator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export const Purchases: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [formData, setFormData] = useState<Partial<Purchase>>({});

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      const data = await InventoryService.getPurchases();
      setPurchases(data);
    } catch (error) {
      console.error("Failed to load purchases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGeneratePDF = () => {
    const headers = ["ID", "Items", "Purchase Status", "Order By", "Date", "Supplier", "Total", "Paid"];
    const data = purchases.map((p) => [
      p.id,
      p.itemName,
      p.purchaseStatus.toUpperCase(),
      p.orderBy,
      new Date(p.purchaseDate).toLocaleDateString(),
      p.supplier,
      `$${p.totalPrice}`,
      `$${p.paid}`,
    ]);
    generatePDF("Purchase Items Report", headers, data, "purchases-report.pdf");
  };

  const handleAdd = () => {
    const newPurchase: Purchase = {
      id: `PR-${String(purchases.length + 1).padStart(5, "0")}`,
      itemId: formData.itemId || "",
      itemName: formData.itemName || "",
      quantity: formData.quantity || 0,
      totalPrice: formData.totalPrice || 0,
      supplier: formData.supplier || "",
      purchaseDate: formData.purchaseDate || new Date().toISOString(),
      status: formData.status || "pending",
      orderBy: formData.orderBy || "",
      paid: formData.paid || 0,
      balance: (formData.totalPrice || 0) - (formData.paid || 0),
      paymentStatus: formData.paymentStatus || "pending",
      purchaseStatus: formData.purchaseStatus || "pending",
    };
    setPurchases([...purchases, newPurchase]);
    setIsAddDialogOpen(false);
    setFormData({});
  };

  const handleEdit = () => {
    if (selectedPurchase) {
      const updatedPurchase = {
        ...selectedPurchase,
        ...formData,
        balance: (formData.totalPrice || selectedPurchase.totalPrice) - (formData.paid || selectedPurchase.paid),
      };
      setPurchases(purchases.map((p) => (p.id === selectedPurchase.id ? updatedPurchase : p)));
      setIsEditDialogOpen(false);
      setSelectedPurchase(null);
      setFormData({});
    }
  };

  const handleDelete = () => {
    if (selectedPurchase) {
      setPurchases(purchases.filter((p) => p.id !== selectedPurchase.id));
      setIsDeleteDialogOpen(false);
      setSelectedPurchase(null);
    }
  };

  const openEditDialog = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setFormData(purchase);
    setIsEditDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "item-received":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-transit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalSpent = purchases.reduce((sum, p) => sum + p.totalPrice, 0);
  const pendingOrders = purchases.filter((p) => p.purchaseStatus === "pending").length;

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
      <div className="grid grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="col-span-2 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Create Purchase Invoice</h2>
          </div>

          {/* Bill From */}
          <div className="border border-dashed rounded-xl p-4 text-center text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors">
            + Add Party
          </div>

          {/* Items Table Placeholder */}
          <div className="border border-dashed rounded-xl p-4 text-center text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors">
            + Add Item
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-2">
            <h3 className="text-gray-700 font-medium">Terms and Conditions</h3>
            <div className="border rounded-lg p-4 text-sm text-gray-600 bg-gray-50">
              <p>1. Goods once sold will not be taken back or exchanged</p>
              <p>2. All disputes are subject to [ENTER_YOUR_CITY_NAME] jurisdiction only</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-1 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Purchase Invoice No</Label>
              <Input placeholder="1" />
            </div>
            <div className="space-y-2">
              <Label>Purchase Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Input placeholder="30 days" />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" />
            </div>
          </div>

          {/* Amount Section */}
          <div className="space-y-3 p-4 border rounded-xl bg-gray-50">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Taxable Amount</span>
              <span>₹0</span>
            </div>
            <div className="flex justify-between text-gray-700 font-semibold">
              <span>Total</span>
              <span>₹0</span>
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-2">
            <Label>Amount Paid</Label>
            <Input placeholder="0" />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t">
        <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
          Save Purchase Invoice
        </button>
      </div>

      {/* --- OLD UI COMMENTED OUT --- */}
      {/* The entire old UI including the Dialogs is commented out below.
      
      Add/Edit Dialog
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setFormData({});
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAddDialogOpen ? "Add Purchase" : "Edit Purchase"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item</Label>
              <Input
                id="itemName"
                value={formData.itemName || ""}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                placeholder="Item name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderBy">Order By</Label>
              <Input
                id="orderBy"
                value={formData.orderBy || ""}
                onChange={(e) => setFormData({ ...formData, orderBy: e.target.value })}
                placeholder="Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate?.split("T")[0] || ""}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalPrice">Total</Label>
              <Input
                id="totalPrice"
                type="number"
                value={formData.totalPrice || ""}
                onChange={(e) =>
                  setFormData({ ...formData, totalPrice: parseFloat(e.target.value) })
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paid">Paid</Label>
              <Input
                id="paid"
                type="number"
                value={formData.paid || ""}
                onChange={(e) => setFormData({ ...formData, paid: parseFloat(e.target.value) })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={formData.supplier || ""}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Supplier name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select
                value={formData.paymentStatus || "pending"}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentStatus: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchaseStatus">Purchase Status</Label>
              <Select
                value={formData.purchaseStatus || "pending"}
                onValueChange={(value) =>
                  setFormData({ ...formData, purchaseStatus: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="item-received">Item Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                setFormData({});
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Done
            </button>
            <button
              onClick={isAddDialogOpen ? handleAdd : handleEdit}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              {isAddDialogOpen ? "Add" : "Save"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      Delete Dialog
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Purchase</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete purchase "{selectedPurchase?.id}"? This action cannot
            be undone.
          </p>
          <DialogFooter>
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      */}
    </div>
  );
};

// import React, { useState } from "react";
// import { 
//   Settings, 
//   Save, 
//   ChevronLeft, 
//   Keyboard, 
//   X, 
//   Plus, 
//   ScanBarcode, 
//   ChevronDown, 
//   Search,
//   Trash2,
//   Edit
// } from "lucide-react";

// // --- MOCK DATA (Replicating external imports for the preview to work) ---
// // In your actual project, you would import this from your mockData file.
// import { mockPOItems, mockSuppliers } from "../data/mockData";
// // const mockPOItems = []; // Replaced by import
// // const mockSuppliers = [
// //   { id: 1, name: "Supplier A" },
// //   { id: 2, name: "Supplier B" },
// // ];
// const mockProducts = [
//   { id: 1, name: "Product X" },
//   { id: 2, name: "Product Y" },
// ];

// // --- INLINE UI COMPONENTS (To ensure the preview is standalone and runnable) ---
// // In your actual project, you can replace these with your imports from "../../components/ui/..."

// const Button = ({ className = "", variant = "primary", size = "default", children, ...props }: any) => {
//   const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white";
//   const variants = {
//     primary: "bg-purple-600 text-white hover:bg-purple-700 shadow-sm",
//     secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm",
//     ghost: "hover:bg-gray-100 text-gray-600",
//     destructive: "bg-red-500 text-white hover:bg-red-600",
//     outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700",
//     dashed: "border-2 border-dashed border-blue-200 text-blue-500 hover:bg-blue-50",
//   };
//   const sizes = {
//     default: "h-10 py-2 px-4",
//     sm: "h-9 px-3",
//     lg: "h-11 px-8",
//     icon: "h-10 w-10",
//   };
  
//   const variantStyles = variants[variant as keyof typeof variants] || variants.primary;
//   const sizeStyles = sizes[size as keyof typeof sizes] || sizes.default;

//   return (
//     <button className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`} {...props}>
//       {children}
//     </button>
//   );
// };

// const Input = ({ className = "", ...props }: any) => (
//   <input
//     className={`flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
//     {...props}
//   />
// );

// const Label = ({ className = "", children, ...props }: any) => (
//   <label className={`text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-500 ${className}`} {...props}>
//     {children}
//   </label>
// );

// const Select = ({ className = "", children, ...props }: any) => (
//   <div className={`relative ${className}`}>
//     <select className="flex h-9 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none" {...props}>
//       {children}
//     </select>
//     <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50 pointer-events-none" />
//   </div>
// );


// // --- MAIN COMPONENT ---

// const POScreen = () => {
//   // State from your original code
//   const [poItems, setPoItems] = useState<any[]>(mockPOItems);
//   const [searchTerm, setSearchTerm] = useState("");
//   // Dialog states kept for compatibility with your commented code logic if you re-enable it
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedPOItem, setSelectedPOItem] = useState<any | null>(null);
//   const [formData, setFormData] = useState<any>({});

//   // Mock handlers
//   const handleAdd = () => { console.log("Add clicked"); };
//   const handleEdit = () => { console.log("Edit clicked"); };
//   const handleDelete = () => { console.log("Delete clicked"); };

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      
//       {/* Top Navigation Bar */}
//       <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="flex items-center gap-4">
//           <Button variant="ghost" size="icon" className="-ml-2">
//             <ChevronLeft className="h-6 w-6 text-gray-600" />
//           </Button>
//           <h1 className="text-xl font-semibold text-gray-800">Create Purchase Invoice</h1>
//         </div>
        
//         <div className="flex items-center gap-3">
//           <Button variant="ghost" size="icon">
//             <Keyboard className="h-5 w-5 text-gray-500" />
//           </Button>
//           <Button variant="secondary" className="gap-2">
//             <Settings className="h-4 w-4" />
//             Settings
//             <div className="h-2 w-2 rounded-full bg-red-500 -ml-1 mb-2" />
//           </Button>
//           <Button variant="primary" className="bg-purple-200 text-purple-700 hover:bg-purple-300 border-none font-semibold">
//             Save Purchase Invoice
//           </Button>
//         </div>
//       </div>

//       <div className="max-w-[1600px] mx-auto p-4 space-y-4">
        
//         {/* Main Form Area */}
//         <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          
//           {/* Top Section: Bill From & Details */}
//           <div className="flex flex-col lg:flex-row h-auto lg:h-64 border-b border-gray-200">
            
//             {/* Left: Bill From */}
//             <div className="w-full lg:w-7/12 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
//               <h3 className="text-sm font-semibold text-gray-700 mb-4">Bill From</h3>
//               <div className="h-32 border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-blue-50/30 hover:bg-blue-50 transition-colors group">
//                 <span className="text-blue-500 font-medium flex items-center gap-2 group-hover:text-blue-600">
//                   <Plus className="h-4 w-4" /> Add Party
//                 </span>
//               </div>
//             </div>

//             {/* Right: Invoice Details */}
//             <div className="w-full lg:w-5/12 p-6 bg-gray-50/30">
//               <div className="grid grid-cols-2 gap-x-4 gap-y-4">
//                 <div className="space-y-1.5">
//                   <Label>Purchase Inv No</Label>
//                   <Input placeholder="1" className="bg-white" />
//                 </div>
//                 <div className="space-y-1.5">
//                   <Label>Purchase Inv Date</Label>
//                   <div className="relative">
//                      <Input type="date" defaultValue="2025-11-22" className="bg-white pr-2" />
//                   </div>
//                 </div>
//                 <div className="space-y-1.5 col-span-1">
//                    {/* Empty space or Original Inv No placeholder */}
//                    <Label>Original Inv No.</Label>
//                    <Input disabled className="bg-gray-100" />
//                 </div>
                
//                 {/* Spacer to match layout */}
//                 <div className="hidden md:block"></div>

//                 <div className="space-y-1.5 flex gap-2 items-end">
//                   <div className="flex-1 space-y-1.5">
//                     <Label>Payment Terms</Label>
//                     <div className="flex">
//                       <Input placeholder="30" className="rounded-r-none border-r-0" />
//                       <div className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-3 flex items-center text-sm text-gray-500">
//                         days
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-1.5">
//                    <Label>Due Date</Label>
//                    <Input type="date" defaultValue="2025-12-22" className="bg-white" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Middle Section: Items Table */}
//           <div className="min-h-[200px]">
//              {/* Table Header */}
//              <div className="bg-gray-50 border-y border-gray-200 grid grid-cols-12 gap-2 px-4 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
//                 <div className="col-span-1 text-center py-1">NO</div>
//                 <div className="col-span-4 py-1">ITEMS/SERVICES</div>
//                 <div className="col-span-1 py-1">HSN/SAC</div>
//                 <div className="col-span-1 py-1 text-right">QTY</div>
//                 <div className="col-span-1 py-1 text-right">PRICE/ITEM (₹)</div>
//                 <div className="col-span-1 py-1 text-right">DISCOUNT</div>
//                 <div className="col-span-1 py-1 text-right">TAX</div>
//                 <div className="col-span-2 py-1 text-right flex justify-end items-center gap-2">
//                   AMOUNT (₹)
//                   <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-blue-600 text-white hover:bg-blue-700">
//                     <Plus className="h-3 w-3" />
//                   </Button>
//                 </div>
//              </div>

//              {/* Table Content Area */}
//              <div className="p-4 space-y-3">
                
//                 {/* Add Item Row */}
//                 <div className="flex gap-4">
//                   <div className="flex-1 border-2 border-dashed border-blue-300 rounded-md p-3 flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors text-blue-500 font-medium text-sm">
//                     + Add Item
//                   </div>
//                   <div className="w-48">
//                     <Button variant="outline" className="w-full h-full border-gray-300 text-gray-700 gap-2 font-normal">
//                       <ScanBarcode className="h-5 w-5" />
//                       Scan Barcode
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Subtotal Row (Visual Only) */}
//                 <div className="flex justify-end pt-4 pr-4 gap-8 text-sm text-gray-600 border-t border-gray-100 mt-8">
//                    <div className="flex gap-8">
//                       <div className="text-right"><span className="mr-4 font-medium text-gray-400 text-xs tracking-wider">SUBTOTAL</span> ₹ 0</div>
//                       <div className="text-right">₹ 0</div>
//                       <div className="text-right w-32 font-medium text-gray-800">₹ 0</div>
//                    </div>
//                 </div>

//              </div>
//           </div>

//           {/* Bottom Section */}
//           <div className="flex flex-col lg:flex-row border-t border-gray-200">
            
//             {/* Bottom Left: Notes & Terms */}
//             <div className="w-full lg:w-1/2 p-6 space-y-6 border-r border-gray-200">
//                <button className="text-blue-500 text-sm font-medium hover:underline">+ Add Notes</button>
               
//                <div className="space-y-2">
//                  <div className="flex justify-between items-center">
//                     <Label className="text-gray-700 font-semibold">Terms and Conditions</Label>
//                     <X className="h-4 w-4 text-gray-400 cursor-pointer hover:text-red-500" />
//                  </div>
//                  <div className="bg-gray-100 rounded-md p-4 text-xs text-gray-600 space-y-1">
//                    <p>1. Goods once sold will not be taken back or exchanged</p>
//                    <p>2. All disputes are subject to [ENTER_YOUR_CITY_NAME] jurisdiction only</p>
//                  </div>
//                </div>
//             </div>

//             {/* Bottom Right: Calculations & Payment */}
//             <div className="w-full lg:w-1/2 p-6 space-y-3 bg-white">
               
//                {/* Charges & Discounts */}
//                <div className="flex justify-between items-center text-sm">
//                  <button className="text-blue-500 hover:underline flex items-center gap-1">
//                     <Plus className="h-3 w-3" /> Add Additional Charges
//                  </button>
//                  <span className="font-medium text-gray-800">₹ 0</span>
//                </div>

//                <div className="flex justify-between items-center text-sm">
//                  <span className="text-gray-600">Taxable Amount</span>
//                  <span className="font-medium text-gray-800">₹ 0</span>
//                </div>

//                <div className="flex justify-between items-center text-sm">
//                  <button className="text-blue-500 hover:underline flex items-center gap-1">
//                     <Plus className="h-3 w-3" /> Add Discount
//                  </button>
//                  <span className="font-medium text-gray-800">- ₹ 0</span>
//                </div>
               
//                {/* Round Off */}
//                <div className="flex justify-between items-center py-2">
//                   <div className="flex items-center gap-2">
//                      <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
//                      <span className="text-sm text-gray-700">Auto Round Off</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                      <Select className="w-20 h-8">
//                        <option>+ Add</option>
//                        <option>- Reduce</option>
//                      </Select>
//                      <div className="relative">
//                        <span className="absolute left-2 top-1.5 text-gray-500 text-xs">₹</span>
//                        <Input className="w-20 h-8 pl-5 text-right" defaultValue="0" />
//                      </div>
//                   </div>
//                </div>
               
//                <div className="border-t border-gray-100 my-2"></div>

//                {/* Total Amount */}
//                <div className="flex justify-between items-center mb-4">
//                   <span className="text-lg font-bold text-gray-800">Total Amount</span>
//                   <div className="bg-gray-100 text-gray-400 px-4 py-2 rounded-md text-sm font-medium min-w-[140px] text-right">
//                     Enter Payment amount
//                   </div>
//                </div>

//                <div className="border-t border-gray-100 my-4"></div>

//                {/* Payment Section */}
//                <div className="space-y-2">
//                   <div className="flex justify-end">
//                      <div className="flex items-center gap-2 mb-2">
//                         <label className="text-xs text-gray-600 cursor-pointer select-none" htmlFor="full-paid">Mark as fully paid</label>
//                         <input id="full-paid" type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4" />
//                      </div>
//                   </div>
                  
//                   <div className="flex items-center justify-between gap-4">
//                      <span className="text-sm font-medium text-gray-600">Amount Paid</span>
//                      <div className="flex-1 flex gap-2">
//                         <div className="relative flex-1">
//                            <span className="absolute left-3 top-2 text-gray-500">₹</span>
//                            <Input className="pl-6 bg-gray-50 font-medium" defaultValue="0" />
//                         </div>
//                         <Select className="w-32 bg-gray-50">
//                            <option>Cash</option>
//                            <option>Bank Transfer</option>
//                            <option>Cheque</option>
//                         </Select>
//                      </div>
//                   </div>
//                </div>

//             </div>
//           </div>

//         </div>
//       </div>


//       {/* --- OLD UI COMMENTED OUT AS REQUESTED --- */}
//       {/*
//       <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => { if (!open) { setIsAddDialogOpen(false); setIsEditDialogOpen(false); } }}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader><DialogTitle>{isAddDialogOpen ? 'Add Purchase Order' : 'Edit Purchase Order'}</DialogTitle></DialogHeader>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
//             <div className="space-y-2">
//               <Label>Supplier Name</Label>
//               <Select value={formData.supplierName} onValueChange={(value) => setFormData({ ...formData, supplierName: value })}>
//                 <SelectTrigger><SelectValue placeholder="Select a supplier" /></SelectTrigger>
//                 <SelectContent>
//                   {mockSuppliers.map(supplier => <SelectItem key={supplier.id} value={supplier.name}>{supplier.name}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Product Name</Label>
//               <Select value={formData.productName} onValueChange={(value) => setFormData({ ...formData, productName: value })}>
//                 <SelectTrigger><SelectValue placeholder="Select a product" /></SelectTrigger>
//                 <SelectContent>
//                   {mockProducts.map(product => <SelectItem key={product.id} value={product.name}>{product.name}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Quantity</Label>
//               <Select value={formData.qty?.toString()} onValueChange={(value) => setFormData({ ...formData, qty: parseInt(value) })}>
//                 <SelectTrigger><SelectValue placeholder="Select a quantity" /></SelectTrigger>
//                 <SelectContent>
//                   {mockQuantities.map(qty => <SelectItem key={qty.id} value={qty.value.toString()}>{qty.unit} ({qty.value})</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2"><Label>Date</Label><Input type="date" value={formData.date || ''} onChange={(e) => setFormData({ ...formData, date: e.target.value })} /></div>
//             <div className="space-y-2"><Label>Time</Label><Input type="time" value={formData.time || ''} onChange={(e) => setFormData({ ...formData, time: e.target.value })} /></div>
//             <div className="space-y-2"><Label>Vehicle Number</Label><Input value={formData.vehicleNumber || ''} onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })} /></div>
//             <div className="space-y-2"><Label>Transport Name</Label><Input value={formData.transportName || ''} onChange={(e) => setFormData({ ...formData, transportName: e.target.value })} /></div>
//             <div className="space-y-2"><Label>Driver Name</Label><Input value={formData.driverName || ''} onChange={(e) => setFormData({ ...formData, driverName: e.target.value })} /></div>
//             <div className="space-y-2 md:col-span-2"><Label>Mobile Number</Label><Input value={formData.mobileNumber || ''} onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} /></div>
//           </div>
//           <DialogFooter><Button variant="gradient" size="lg" onClick={isAddDialogOpen ? handleAdd : handleEdit}>{isAddDialogOpen ? 'Add Purchase' : 'Save Changes'}</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Delete Purchase Order</DialogTitle></DialogHeader>
//           <p>Are you sure you want to delete the PO for "{selectedPOItem?.productName}" from "{selectedPOItem?.supplierName}"?</p>
//           <DialogFooter><Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
//         </DialogContent>
//       </Dialog>
//       */}
//     </div>
//   );
// };

// export default POScreen;