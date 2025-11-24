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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '../../components/ui/select'; 
import { mockPrices } from '../data/mockData';
import { Price } from '../models/price.model';

export const PriceMasterPage: React.FC = () => {
  const [prices, setPrices] = useState<Price[]>(mockPrices);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);
  const [formData, setFormData] = useState<Partial<Price>>({});

  const filteredPrices = prices.filter((price) =>
    price.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    const newPrice: Price = {
      id: `price-${Date.now()}`,
      unit: formData.unit || 'kg',
      price: formData.price || 0,
    };
    setPrices([...prices, newPrice]);
    setIsAddDialogOpen(false);
    setFormData({});
  };

  const handleEdit = () => {
    if (selectedPrice) {
      setPrices(prices.map((p) => (p.id === selectedPrice.id ? { ...p, ...formData } : p)));
      setIsEditDialogOpen(false);
      setSelectedPrice(null);
      setFormData({});
    }
  };

  const handleDelete = () => {
    if (selectedPrice) {
      setPrices(prices.filter((p) => p.id !== selectedPrice.id));
      setIsDeleteDialogOpen(false);
      setSelectedPrice(null);
    }
  };

  const openEditDialog = (price: Price) => {
    setSelectedPrice(price);
    setFormData(price);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-gray-900 mb-2">Price Master</h2>
          <p className="text-gray-600">Manage your pricing units</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} variant="gradient" size="lg">
          <Plus className="w-5 h-5 mr-2" />
          <span>Add Price</span>
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </div>

      {/* Prices Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Unit</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPrices.map((price, index) => (
                <motion.tr key={price.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{price.unit}</td>
                  <td className="px-6 py-4 text-gray-600">${price.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(price)} className="text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedPrice(price); setIsDeleteDialogOpen(true); }} className="text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
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
          <DialogHeader><DialogTitle>{isAddDialogOpen ? 'Add Price' : 'Edit Price'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="unit" className="text-right">Unit</Label><Select value={formData.unit} onValueChange={(value: 'ton' | 'kg' | 'bags') => setFormData({ ...formData, unit: value })}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select a unit" /></SelectTrigger><SelectContent><SelectItem value="ton">Ton</SelectItem><SelectItem value="kg">Kg</SelectItem><SelectItem value="bags">Bags</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="price" className="text-right">Price</Label><Input id="price" type="number" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="col-span-3" /></div>
          </div>
          <DialogFooter><Button  variant="gradient" size="lg" onClick={isAddDialogOpen ? handleAdd : handleEdit}>{isAddDialogOpen ? 'Add' : 'Save Changes'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Price</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete the price for "{selectedPrice?.unit}"?</p>
          <DialogFooter><Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};