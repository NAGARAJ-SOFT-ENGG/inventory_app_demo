import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, Printer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog"; 
import { mockProducts, mockSuppliers, mockScalesItems } from "../data/mockData";
import { ScalesItem } from "../models/scales.model";
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
import { getCurrentDateTime } from "../utils/dateUtils";

// Mock data for dropdowns, assuming these are from your master files
const mockQuantities = [
  { id: 1, unit: 'Ton', value: 1000 },
  { id: 2, unit: 'Kg', value: 1 },
  { id: 3, unit: '25 bag', value: 25 },
  { id: 4, unit: '50 bag', value: 50 },
];

const mockPrices = [
    { id: 1, name: 'Cement Bag Price', value: 350 },
    { id: 2, name: 'Steel Ton Price', value: 55000 },
];

const ScalesScreen = () => {
  const [scalesItems, setScalesItems] = useState<ScalesItem[]>(mockScalesItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedScalesItem, setSelectedScalesItem] = useState<ScalesItem | null>(null);
  const [formData, setFormData] = useState<Partial<ScalesItem>>({});

  const filteredScalesItems = scalesItems.filter(
    (item) =>
      item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    const newItem: ScalesItem = {
      id: `scale-${Date.now()}`,
      supplierName: formData.supplierName || "",
      productName: formData.productName || "",
      qty: formData.qty || 0,
      price: formData.price || 0,
      date: formData.date || new Date().toISOString().split('T')[0],
      time: formData.time || new Date().toTimeString().split(' ')[0].substring(0,5),
      vehicleNumber: formData.vehicleNumber || "",
      transportName: formData.transportName || "",
      driverName: formData.driverName || "",
      mobileNumber: formData.mobileNumber || "",
    };
    setScalesItems([newItem, ...scalesItems]);
    setIsAddDialogOpen(false);
    setFormData({});
  };

  const handleEdit = () => {
    if (selectedScalesItem) {
      setScalesItems(
        scalesItems.map((item) =>
          item.id === selectedScalesItem.id ? { ...item, ...formData } : item
        )
      );
      setIsEditDialogOpen(false);
      setSelectedScalesItem(null);
      setFormData({});
    }
  };

  const handleDelete = () => {
    if (selectedScalesItem) {
      setScalesItems(scalesItems.filter((item) => item.id !== selectedScalesItem.id));
      setIsDeleteDialogOpen(false);
      setSelectedScalesItem(null);
    }
  };

  const openEditDialog = (item: ScalesItem) => {
    setSelectedScalesItem(item);
    setFormData(item);
    setIsEditDialogOpen(true);
  };

  const handlePrint = (item: ScalesItem) => {
    const printContent = `
      <h2>Scales Receipt</h2>
      <p><strong>Supplier:</strong> ${item.supplierName}</p>
      <p><strong>Product:</strong> ${item.productName}</p>
      <p><strong>Quantity:</strong> ${item.qty}</p>
      <p><strong>Price:</strong> ${item.price}</p>
      <p><strong>Date:</strong> ${item.date} ${item.time}</p>
      <p><strong>Vehicle:</strong> ${item.vehicleNumber}</p>
      <p><strong>Transport:</strong> ${item.transportName}</p>
      <p><strong>Driver:</strong> ${item.driverName} (${item.mobileNumber})</p>
    `;
    const printWindow = window.open('', '', 'height=400,width=600');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      // As per requirement for 2 copies
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-gray-900 mb-2">Scales Screen</h2>
          <p className="text-gray-600">Manage your scales entries</p>
        </div>
        <Button onClick={() => {
          const { date, time } = getCurrentDateTime();
          setFormData({ date, time });
          setIsAddDialogOpen(true);
        }} variant="gradient" size="lg">
          <Plus className="w-5 h-5 mr-2" />
          <span>Add Entry</span>
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

      {/* Scales Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Qty</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Vehicle No.</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Driver</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredScalesItems.map((item, index) => (
                <motion.tr key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{item.supplierName}</td>
                  <td className="px-6 py-4 text-gray-600">{item.productName}</td>
                  <td className="px-6 py-4 text-gray-600">{item.qty}</td>
                  <td className="px-6 py-4 text-gray-600">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-600">{item.date} @ {item.time}</td>
                  <td className="px-6 py-4 text-gray-600">{item.vehicleNumber}</td>
                  <td className="px-6 py-4 text-gray-600">{item.driverName} ({item.mobileNumber})</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handlePrint(item)} className="text-gray-600 hover:bg-gray-50"><Printer className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)} className="text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedScalesItem(item); setIsDeleteDialogOpen(true); }} className="text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{isAddDialogOpen ? 'Add Scales Entry' : 'Edit Scales Entry'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <div className="space-y-2"><Label>Supplier Name</Label><Select value={formData.supplierName} onValueChange={(value) => setFormData({ ...formData, supplierName: value })}><SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger><SelectContent>{mockSuppliers.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Product Name</Label><Select value={formData.productName} onValueChange={(value) => setFormData({ ...formData, productName: value })}><SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger><SelectContent>{mockProducts.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Quantity</Label><Select value={formData.qty?.toString()} onValueChange={(value) => setFormData({ ...formData, qty: parseInt(value) })}><SelectTrigger><SelectValue placeholder="Select quantity" /></SelectTrigger><SelectContent>{mockQuantities.map(q => <SelectItem key={q.id} value={q.value.toString()}>{q.unit} ({q.value})</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Price</Label><Select value={formData.price?.toString()} onValueChange={(value) => setFormData({ ...formData, price: parseFloat(value) })}><SelectTrigger><SelectValue placeholder="Select master price" /></SelectTrigger><SelectContent>{mockPrices.map(p => <SelectItem key={p.id} value={p.value.toString()}>{p.name} (${p.value})</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2 md:col-span-2"><Label>Or Enter Price (Free Text)</Label><Input type="number" placeholder="Enter custom price" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} /></div>
            <div className="space-y-2"><Label>Date</Label><Input type="date" value={formData.date || ''} onChange={(e) => setFormData({ ...formData, date: e.target.value })} /></div>
            <div className="space-y-2"><Label>Time</Label><Input type="time" value={formData.time || ''} onChange={(e) => setFormData({ ...formData, time: e.target.value })} /></div>
            <div className="space-y-2"><Label>Vehicle Number</Label><Input value={formData.vehicleNumber || ''} onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })} /></div>
            <div className="space-y-2"><Label>Transport Name</Label><Input value={formData.transportName || ''} onChange={(e) => setFormData({ ...formData, transportName: e.target.value })} /></div>
            <div className="space-y-2"><Label>Driver Name</Label><Input value={formData.driverName || ''} onChange={(e) => setFormData({ ...formData, driverName: e.target.value })} /></div>
            <div className="space-y-2"><Label>Mobile Number</Label><Input value={formData.mobileNumber || ''} onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="gradient" size="lg" onClick={isAddDialogOpen ? handleAdd : handleEdit}>{isAddDialogOpen ? 'Add Entry' : 'Save Changes'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Scales Entry</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete the entry for "{selectedScalesItem?.productName}" from "{selectedScalesItem?.supplierName}"?</p>
          <DialogFooter><Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScalesScreen;