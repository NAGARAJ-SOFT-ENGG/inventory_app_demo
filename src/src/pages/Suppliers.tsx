import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Plus, Edit, Trash2, Truck, Star } from "lucide-react";
import { mockSuppliers } from "../data/mockData";
import { Supplier } from "../models/supplier.model";
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

export const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<Partial<Supplier>>({});

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.supplierCode && supplier.supplierCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleGeneratePDF = () => {
    const headers = ["Code", "Name", "Email", "Phone", "City", "Country", "Rating", "Total Orders"];
    const data = suppliers.map((s) => [
      s.supplierCode || '',
      s.name,
      s.email,
      s.phone,
      s.city,
      s.country,
      s.rating.toString(),
      s.totalOrders.toString(),
    ]);
    generatePDF("Suppliers Report", headers, data, "suppliers-report.pdf");
  };

  const handleAdd = () => {
    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      supplierCode: `SUP${String(suppliers.length + 1).padStart(4, "0")}`,
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      address: formData.address || "",
      city: formData.city || "",
      country: formData.country || "",
      productsSupplied: formData.productsSupplied || [],
      rating: formData.rating || 0,
      totalOrders: formData.totalOrders || 0,
      status: formData.status || "active",
      createdAt: new Date().toISOString(),
    };
    setSuppliers([...suppliers, newSupplier]);
    setIsAddDialogOpen(false);
    setFormData({});
  };

  const handleEdit = () => {
    if (selectedSupplier) {
      setSuppliers(
        suppliers.map((s) => (s.id === selectedSupplier.id ? { ...s, ...formData } : s))
      );
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-gray-900 mb-2">Suppliers</h2>
          <p className="text-gray-600">Manage your supplier network</p>
        </div>
        <div className="flex items-center gap-3">
          <PDFButton onClick={handleGeneratePDF} />
          <button
            onClick={() => {
              setFormData({});
              setIsAddDialogOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSuppliers.map((supplier, index) => (
                <motion.tr
                  key={supplier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-900">{supplier.name}</p>
                        <p className="text-sm text-gray-500">{supplier.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{supplier.supplierCode}</td>
                  <td className="px-6 py-4 text-gray-600">{supplier.phone}</td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{supplier.city}</p>
                    <p className="text-sm text-gray-500">{supplier.country}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {supplier.productsSupplied.slice(0, 2).map((product) => (
                        <span
                          key={product}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          {product}
                        </span>
                      ))}
                      {supplier.productsSupplied.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{supplier.productsSupplied.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-900">{supplier.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{supplier.totalOrders}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs border ${
                        supplier.status === "active"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }`}
                    >
                      {supplier.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditDialog(supplier)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
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
            <DialogTitle>{isAddDialogOpen ? "Add Supplier" : "Edit Supplier"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Supplier Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ABC Suppliers Inc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplierCode">Supplier Code</Label>
              <Input
                id="supplierCode"
                value={formData.supplierCode || ""}
                onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
                placeholder="e.g., SUP0001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@supplier.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city || ""}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="San Francisco"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country || ""}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="USA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating || ""}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                placeholder="4.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalOrders">Total Orders</Label>
              <Input
                id="totalOrders"
                type="number"
                value={formData.totalOrders || ""}
                onChange={(e) =>
                  setFormData({ ...formData, totalOrders: parseInt(e.target.value) })
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || "active"}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Business Park Drive"
              />
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
              Cancel
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

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Supplier</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete "{selectedSupplier?.name}"? This action cannot be
            undone.
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
    </div>
  );
};
