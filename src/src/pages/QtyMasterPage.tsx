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

// Define the type for a Quantity record.
interface Quantity {
  id: string | number;
  unit: 'Ton' | 'Kg' | '25 bag' | '50 bag';
  value: number; // e.g., for 'Ton', value might be 1000 (if base is Kg)
}

// Dummy API function - replace with your actual data fetching logic.
const fetchQuantities = async (): Promise<Quantity[]> => {
  // In a real app, you would make an API call here.
  return Promise.resolve([
    { id: 1, unit: 'Ton', value: 1000 },
    { id: 2, unit: 'Kg', value: 1 },
    { id: 3, unit: '25 bag', value: 25 },
    { id: 4, unit: '50 bag', value: 50 },
  ]);
};

export const QtyMasterPage: React.FC = () => {
  const [quantities, setQuantities] = useState<Quantity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState<Quantity | null>(null);
  const [formData, setFormData] = useState<Partial<Quantity>>({});

  useEffect(() => {
    fetchQuantities().then(setQuantities);
  }, []);

  const filteredQuantities = quantities.filter((qty) =>
    qty.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    const newQuantity: Quantity = {
      id: `qty-${Date.now()}`,
      unit: formData.unit || 'Kg',
      value: formData.value || 0,
    };
    setQuantities([...quantities, newQuantity]);
    setIsAddDialogOpen(false);
    setFormData({});
  };

  const handleEdit = () => {
    if (selectedQuantity) {
      setQuantities(quantities.map((q) => (q.id === selectedQuantity.id ? { ...q, ...formData } : q)));
      setIsEditDialogOpen(false);
      setSelectedQuantity(null);
      setFormData({});
    }
  };

  const handleDelete = () => {
    if (selectedQuantity) {
      setQuantities(quantities.filter((q) => q.id !== selectedQuantity.id));
      setIsDeleteDialogOpen(false);
      setSelectedQuantity(null);
    }
  };

  const openEditDialog = (qty: Quantity) => {
    setSelectedQuantity(qty);
    setFormData(qty);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-gray-900 mb-2">QTY Master</h2>
          <p className="text-gray-600">Manage your quantity units</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}  variant="gradient" size="lg">
          <Plus className="w-5 h-5 mr-2" />
          <span>Add Quantity</span>
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

      {/* Quantities Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Unit</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Value (in base unit)</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuantities.map((qty, index) => (
                <motion.tr key={qty.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{qty.unit}</td>
                  <td className="px-6 py-4 text-gray-600">{qty.value}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(qty)} className="text-blue-600 hover:bg-blue-50"><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedQuantity(qty); setIsDeleteDialogOpen(true); }} className="text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
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
          <DialogHeader><DialogTitle>{isAddDialogOpen ? 'Add Quantity' : 'Edit Quantity'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="unit" className="text-right">Unit</Label><Select value={formData.unit} onValueChange={(value: 'Ton' | 'Kg' | '25 bag' | '50 bag') => setFormData({ ...formData, unit: value })}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select a unit" /></SelectTrigger><SelectContent><SelectItem value="Ton">Ton</SelectItem><SelectItem value="Kg">Kg</SelectItem><SelectItem value="25 bag">25 bag</SelectItem><SelectItem value="50 bag">50 bag</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="value" className="text-right">Value</Label><Input id="value" type="number" value={formData.value || ''} onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })} className="col-span-3" /></div>
          </div>
          <DialogFooter><Button variant="gradient" size="lg" onClick={isAddDialogOpen ? handleAdd : handleEdit}>{isAddDialogOpen ? 'Add' : 'Save Changes'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Quantity</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete the quantity unit "{selectedQuantity?.unit}"?</p>
          <DialogFooter><Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};