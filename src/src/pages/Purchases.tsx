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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-gray-900 mb-2">Purchase Items</h2>
          <p className="text-gray-600">
            Track and manage your purchase orders
          </p>
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
            <span>Add Purchase Items</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search purchases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-2xl text-gray-900">{purchases.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-2xl text-gray-900">
                ${totalSpent.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pending Orders</p>
              <p className="text-2xl text-gray-900">{pendingOrders}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Purchases List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Purchase Status
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Order By
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Paid
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPurchases.map((purchase, index) => (
                <motion.tr
                  key={purchase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-6 py-4 text-blue-600">#{purchase.id}</td>
                  <td className="px-6 py-4 text-gray-900">{purchase.itemName}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(
                        purchase.purchaseStatus
                      )}`}
                    >
                      {purchase.purchaseStatus.replace("-", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{purchase.orderBy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(purchase.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{purchase.supplier}</td>
                  <td className="px-6 py-4 text-gray-900">${purchase.totalPrice}</td>
                  <td className="px-6 py-4 text-gray-900">${purchase.paid}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditDialog(purchase)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPurchase(purchase);
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

      {/* Delete Dialog */}
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
    </div>
  );
};
