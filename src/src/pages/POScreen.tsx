import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { mockPOItems, mockProducts } from "../data/mockData";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

// Define the type for a POItem record
interface POItem {
  id: string;
  supplierName: string;
  productName: string;
  qty: number;
  date: string;
  time: string;
  vehicleNumber: string;
  transportName: string;
  driverName: string;
  mobileNumber: string;
}

// Mock data for dropdowns, assuming these are from your master files
const mockSuppliers = [
  { id: 1, name: 'Supplier A', address: '123 Main St, Anytown', paymode: 'Credit Card' },
  { id: 2, name: 'Supplier B', address: '456 Oak Ave, Othertown', paymode: 'Bank Transfer' },
];

const mockQuantities = [
  { id: 1, unit: 'Ton', value: 1000 },
  { id: 2, unit: 'Kg', value: 1 },
  { id: 3, unit: '25 bag', value: 25 },
  { id: 4, unit: '50 bag', value: 50 },
];

// We will use mockProducts from mockData.ts for products


const POScreen = () => {
  const [poItems, setPoItems] = useState<POItem[]>(mockPOItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPOItem, setSelectedPOItem] = useState<POItem | null>(null);
  const [formData, setFormData] = useState<Partial<POItem>>({});

  const filteredPOItems = poItems.filter(
    (item) =>
      item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    const newItem: POItem = {
      id: `po-${Date.now()}`,
      supplierName: formData.supplierName || "",
      productName: formData.productName || "",
      qty: formData.qty || 0,
      date: formData.date || "",
      time: formData.time || "",
      vehicleNumber: formData.vehicleNumber || "",
      transportName: formData.transportName || "",
      driverName: formData.driverName || "",
      mobileNumber: formData.mobileNumber || "",
    };
    setPoItems([newItem, ...poItems]);
    setIsAddDialogOpen(false);
    setFormData({});
  };

  const handleEdit = () => {
    if (selectedPOItem) {
      setPoItems(
        poItems.map((item) =>
          item.id === selectedPOItem.id ? { ...item, ...formData } : item
        )
      );
      setIsEditDialogOpen(false);
      setSelectedPOItem(null);
      setFormData({});
    }
  };

  const handleDelete = () => {
    if (selectedPOItem) {
      setPoItems(poItems.filter((item) => item.id !== selectedPOItem.id));
      setIsDeleteDialogOpen(false);
      setSelectedPOItem(null);
    }
  };

  const openEditDialog = (item: POItem) => {
    setSelectedPOItem(item);
    setFormData(item);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-gray-900 mb-2">Purchase Order Screen</h2>
          <p className="text-gray-600">Manage your purchase orders</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} variant="gradient" size="lg">
          <Plus className="w-5 h-5 mr-2" />
          <span>Add PO</span>
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by supplier, product, driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </div>

      {/* PO Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Qty</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Vehicle No.</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Driver</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Transport Name</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Mobile Number</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPOItems.map((item, index) => (
                <motion.tr key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{item.supplierName}</td>
                  <td className="px-6 py-4 text-gray-600">{item.productName}</td>
                  <td className="px-6 py-4 text-gray-600">{item.qty}</td>
                  <td className="px-6 py-4 text-gray-600">{item.date} @ {item.time}</td>
                  <td className="px-6 py-4 text-gray-600">{item.vehicleNumber}</td>
                  <td className="px-6 py-4 text-gray-600">{item.driverName} ({item.mobileNumber})</td>
                  <td className="px-6 py-4 text-gray-600">{item.transportName}</td>
                  <td className="px-6 py-4 text-gray-600">{item.mobileNumber}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)} className="text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedPOItem(item); setIsDeleteDialogOpen(true); }} className="text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => { if (!open) { setIsAddDialogOpen(false); setIsEditDialogOpen(false); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{isAddDialogOpen ? 'Add Purchase Order' : 'Edit Purchase Order'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Supplier Name</Label>
              <Select value={formData.supplierName} onValueChange={(value) => setFormData({ ...formData, supplierName: value })}>
                <SelectTrigger><SelectValue placeholder="Select a supplier" /></SelectTrigger>
                <SelectContent>
                  {mockSuppliers.map(supplier => <SelectItem key={supplier.id} value={supplier.name}>{supplier.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Select value={formData.productName} onValueChange={(value) => setFormData({ ...formData, productName: value })}>
                <SelectTrigger><SelectValue placeholder="Select a product" /></SelectTrigger>
                <SelectContent>
                  {mockProducts.map(product => <SelectItem key={product.id} value={product.name}>{product.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Select value={formData.qty?.toString()} onValueChange={(value) => setFormData({ ...formData, qty: parseInt(value) })}>
                <SelectTrigger><SelectValue placeholder="Select a quantity" /></SelectTrigger>
                <SelectContent>
                  {mockQuantities.map(qty => <SelectItem key={qty.id} value={qty.value.toString()}>{qty.unit} ({qty.value})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Date</Label><Input type="date" value={formData.date || ''} onChange={(e) => setFormData({ ...formData, date: e.target.value })} /></div>
            <div className="space-y-2"><Label>Time</Label><Input type="time" value={formData.time || ''} onChange={(e) => setFormData({ ...formData, time: e.target.value })} /></div>
            <div className="space-y-2"><Label>Vehicle Number</Label><Input value={formData.vehicleNumber || ''} onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })} /></div>
            <div className="space-y-2"><Label>Transport Name</Label><Input value={formData.transportName || ''} onChange={(e) => setFormData({ ...formData, transportName: e.target.value })} /></div>
            <div className="space-y-2"><Label>Driver Name</Label><Input value={formData.driverName || ''} onChange={(e) => setFormData({ ...formData, driverName: e.target.value })} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Mobile Number</Label><Input value={formData.mobileNumber || ''} onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="gradient" size="lg" onClick={isAddDialogOpen ? handleAdd : handleEdit}>{isAddDialogOpen ? 'Add PO' : 'Save Changes'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Purchase Order</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete the PO for "{selectedPOItem?.productName}" from "{selectedPOItem?.supplierName}"?</p>
          <DialogFooter><Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POScreen;