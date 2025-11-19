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

// Define the type for a Supplier record.
interface Supplier {
  id: string | number;
  name: string;
  address: string;
  paymode: 'Cash' | 'Credit Card' | 'Bank Transfer';
}

// Dummy API function - replace with your actual data fetching logic.
const fetchSuppliers = async (): Promise<Supplier[]> => {
  // In a real app, you would make an API call here.
  return Promise.resolve([
    { id: 1, name: 'Supplier A', address: '123 Main St, Anytown', paymode: 'Credit Card' },
    { id: 2, name: 'Supplier B', address: '456 Oak Ave, Othertown', paymode: 'Bank Transfer' },
  ]);
};

export const SupplierMasterPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Partial<Supplier>>({});

  useEffect(() => {
    fetchSuppliers().then(setSuppliers);
  }, []);

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    const newSupplier: Supplier = {
      id: `supplier-${Date.now()}`,
      name: formData.name || '',
      address: formData.address || '',
      paymode: formData.paymode || 'Cash',
    };
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
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Address Details</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Paymode</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSuppliers.map((supplier, index) => (
                <motion.tr key={supplier.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{supplier.name}</td>
                  <td className="px-6 py-4 text-gray-600">{supplier.address}</td>
                  <td className="px-6 py-4 text-gray-600">{supplier.paymode}</td>
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
        <DialogContent>
          <DialogHeader><DialogTitle>{isAddDialogOpen ? 'Add Supplier' : 'Edit Supplier'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="address" className="text-right">Address</Label><Input id="address" value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="paymode" className="text-right">Paymode</Label><Select value={formData.paymode} onValueChange={(value: 'Cash' | 'Credit Card' | 'Bank Transfer') => setFormData({ ...formData, paymode: value })}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select a payment mode" /></SelectTrigger><SelectContent><SelectItem value="Cash">Cash</SelectItem><SelectItem value="Credit Card">Credit Card</SelectItem><SelectItem value="Bank Transfer">Bank Transfer</SelectItem></SelectContent></Select></div>
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