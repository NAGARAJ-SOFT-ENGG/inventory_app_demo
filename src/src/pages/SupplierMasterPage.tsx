import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '../../components/ui/select'; 
import { mockSuppliers } from '../data/mockData';
import { Supplier } from '../models/supplier.model';

export const SupplierMasterPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Partial<Supplier>>({});

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.supplierCode && supplier.supplierCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAdd = () => {
    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      supplierCode: formData.supplierCode || `SUP${String(suppliers.length + 1).padStart(4, "0")}`,
      name: formData.name || '',
      address: formData.address || '',
      email: formData.email || '',
      phone: formData.phone || '',
      city: formData.city || '',
      country: formData.country || '',
      productsSupplied: formData.productsSupplied || [],
      rating: formData.rating || 0,
      totalOrders: 0,
      status: formData.status || 'active',
      createdAt: new Date().toISOString(),
    };
    // Type assertion to satisfy the partial nature of formData
    // In a real app, you'd have more robust validation
    setSuppliers([...suppliers, newSupplier]);
    setIsAddDialogOpen(false);
    setFormData({});
  };

  const handleEdit = () => {
    if (selectedSupplier) {
      setSuppliers(suppliers.map((s) => (s.id === selectedSupplier.id ? { ...s, ...formData } : s)));
      setIsEditDialogOpen(false);
      setSelectedSupplier(null);
      setFormData({});
    }
  };

  const handleDelete = () => {
    if (selectedSupplier) {
      setSuppliers(suppliers.filter((s) => s.id !== selectedSupplier.id));
      setIsDeleteDialogOpen(false);
      setSelectedSupplier(null);
    }
  };

  const openEditDialog = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData(supplier);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-gray-900 mb-2">Supplier Master</h2>
          <p className="text-gray-600">Manage your master suppliers</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}  variant="gradient" size="lg">
          <Plus className="w-5 h-5 mr-2" />
          <span>Add Supplier</span>
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search suppliers by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSuppliers.map((supplier, index) => (
                <motion.tr key={supplier.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{supplier.name}</td>
                  <td className="px-6 py-4 text-gray-600">{supplier.supplierCode}</td>
                  <td className="px-6 py-4 text-gray-600">{supplier.email} <br/> {supplier.phone}</td>
                  <td className="px-6 py-4 text-gray-600">{supplier.city}, {supplier.country}</td>
                  <td className="px-6 py-4 text-gray-600"><span className={`px-2 py-1 text-xs rounded-full ${supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{supplier.status}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(supplier)} className="text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedSupplier(supplier); setIsDeleteDialogOpen(true); }} className="text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
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
          <DialogHeader><DialogTitle>{isAddDialogOpen ? 'Add Supplier' : 'Edit Supplier'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2"><Label>Name</Label><Input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Supplier Code</Label><Input value={formData.supplierCode || ''} onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
            <div className="space-y-2"><Label>Address</Label><Input value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
            <div className="space-y-2"><Label>City</Label><Input value={formData.city || ''} onChange={(e) => setFormData({ ...formData, city: e.target.value })} /></div>
            <div className="space-y-2"><Label>Country</Label><Input value={formData.country || ''} onChange={(e) => setFormData({ ...formData, country: e.target.value })} /></div>
            <div className="space-y-2"><Label>Products Supplied (comma-separated)</Label><Input value={formData.productsSupplied?.join(', ') || ''} onChange={(e) => setFormData({ ...formData, productsSupplied: e.target.value.split(',').map(p => p.trim()) })} /></div>
            <div className="space-y-2"><Label>Status</Label><Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter><Button  variant="gradient" size="lg" onClick={isAddDialogOpen ? handleAdd : handleEdit}>{isAddDialogOpen ? 'Add' : 'Save Changes'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Supplier</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete "{selectedSupplier?.name}"?</p>
          <DialogFooter><Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};