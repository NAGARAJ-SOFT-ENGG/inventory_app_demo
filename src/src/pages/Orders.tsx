import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Plus, Edit, Trash2, FileText } from "lucide-react";
import { mockOrders } from "../data/mockData";
import { Order } from "../models/order.model";
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

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<Partial<Order>>({});

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGeneratePDF = () => {
    const headers = ["Order #", "Customer", "Total", "Status", "Payment", "Date"];
    const data = orders.map((o) => [
      o.orderNumber,
      o.customerName,
      `$${o.totalAmount.toFixed(2)}`,
      o.status.toUpperCase(),
      o.paymentStatus.toUpperCase(),
      new Date(o.orderDate).toLocaleDateString(),
    ]);
    generatePDF("Orders Report", headers, data, "orders-report.pdf");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleAdd = () => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-2025-${String(orders.length + 1).padStart(3, "0")}`,
      customerId: formData.customerId || "",
      customerName: formData.customerName || "",
      items: formData.items || [],
      totalAmount: formData.totalAmount || 0,
      status: formData.status || "pending",
      paymentStatus: formData.paymentStatus || "pending",
      orderDate: formData.orderDate || new Date().toISOString(),
      deliveryDate: formData.deliveryDate,
      shippingAddress: formData.shippingAddress || "",
    };
    setOrders([...orders, newOrder]);
    setIsAddDialogOpen(false);
    setFormData({});
  };

  const handleEdit = () => {
    if (selectedOrder) {
      setOrders(
        orders.map((o) => (o.id === selectedOrder.id ? { ...o, ...formData } : o))
      );
      setIsEditDialogOpen(false);
      setSelectedOrder(null);
      setFormData({});
    }
  };

  const handleDelete = () => {
    if (selectedOrder) {
      setOrders(orders.filter((o) => o.id !== selectedOrder.id));
      setIsDeleteDialogOpen(false);
      setSelectedOrder(null);
    }
  };

  const openEditDialog = (order: Order) => {
    setSelectedOrder(order);
    setFormData(order);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-gray-900 mb-2">Orders</h2>
          <p className="text-gray-600">Manage customer orders</p>
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
            <span>Add Order</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
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
                  Order #
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{order.orderNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{order.customerName}</td>
                  <td className="px-6 py-4 text-gray-600">{order.items.length} items</td>
                  <td className="px-6 py-4 text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs border ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditDialog(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
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
        onOpenChange={(open:any) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setFormData({});
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isAddDialogOpen ? "Add Order" : "Edit Order"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName || ""}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                id="totalAmount"
                type="number"
                value={formData.totalAmount || ""}
                onChange={(e) =>
                  setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })
                }
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Order Status</Label>
              <Select
                value={formData.status || "pending"}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderDate">Order Date</Label>
              <Input
                id="orderDate"
                type="date"
                value={formData.orderDate?.split("T")[0] || ""}
                onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate?.split("T")[0] || ""}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="shippingAddress">Shipping Address</Label>
              <Input
                id="shippingAddress"
                value={formData.shippingAddress || ""}
                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                placeholder="123 Main St, City, State, ZIP"
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
            <DialogTitle>Delete Order</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Are you sure you want to delete order "{selectedOrder?.orderNumber}"? This action
            cannot be undone.
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
