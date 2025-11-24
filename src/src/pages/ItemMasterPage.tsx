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
import { Button } from '../../components/ui/button'; 
import { mockItems } from '../data/mockData';
import { Item } from '../models/item.model';

export const ItemMasterPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<Partial<Item>>({});

  const filteredItems = items.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    const newItem: Item = {
      id: `item-${Date.now()}`,
      productName: formData.productName || '',
      qty: formData.qty || 0,
      price: formData.price || 0,
      batchNo: formData.batchNo || '',
    };
    setItems([...items, newItem]);
    setIsAddDialogOpen(false);
    setFormData({});
  };

  const handleEdit = () => {
    if (selectedItem) {
      setItems(items.map((item) => (item.id === selectedItem.id ? { ...item, ...formData } : item)));
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      setFormData({});
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      setItems(items.filter((item) => item.id !== selectedItem.id));
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const openEditDialog = (item: Item) => {
    setSelectedItem(item);
    setFormData(item);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-gray-900 mb-2">Item Master</h2>
          <p className="text-gray-600">Manage your master items</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} variant="gradient" size="lg">
          <Plus className="w-5 h-5 mr-2" />
          <span>Add Item</span>
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search items by name or batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Batch No.</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item, index) => (
                <motion.tr key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{item.productName}</td>
                  <td className="px-6 py-4 text-gray-600">{item.qty}</td>
                  <td className="px-6 py-4 text-gray-600">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-600">{item.batchNo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)} className="text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setIsDeleteDialogOpen(true); }} className="text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
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
        <DialogContent>
          <DialogHeader><DialogTitle>{isAddDialogOpen ? 'Add Item' : 'Edit Item'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="productName" className="text-right">Name</Label><Input id="productName" value={formData.productName || ''} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="qty" className="text-right">Quantity</Label><Input id="qty" type="number" value={formData.qty || ''} onChange={(e) => setFormData({ ...formData, qty: parseInt(e.target.value) })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="price" className="text-right">Price</Label><Input id="price" type="number" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="batchNo" className="text-right">Batch No.</Label><Input id="batchNo" value={formData.batchNo || ''} onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })} className="col-span-3" /></div>
          </div>
          <DialogFooter><Button  variant="gradient" size="lg" onClick={isAddDialogOpen ? handleAdd : handleEdit}>{isAddDialogOpen ? 'Add' : 'Save Changes'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Item</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete "{selectedItem?.productName}"?</p>
          <DialogFooter><Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};