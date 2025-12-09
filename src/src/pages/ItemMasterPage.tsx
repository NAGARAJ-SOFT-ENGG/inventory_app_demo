import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Plus, Edit, Trash2, Save, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
} from "../../components/ui/pagination";

import { Card, CardContent } from "../../components/ui/card";

import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

import { mockItems } from "../data/mockData";
import { Item } from "../models/item.model";

export const ItemMasterPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<Partial<Item>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredItems = items.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSave = () => {
    const newItem: Item = {
      id: `item-${Date.now()}`,
      productName: formData.productName || "",
      qty: formData.qty || 0,
      price: formData.price || 0,
      batchNo: formData.batchNo || "",
      expiryDate: formData.expiryDate,
      pack: formData.pack,
      supplierTax: formData.supplierTax,
    };

    if (selectedItem) {
      setItems(
        items.map((item) =>
          item.id === selectedItem.id
            ? { ...item, ...formData }
            : item
        )
      );
    } else {
      setItems([...items, newItem]);
    }

    setSelectedItem(null);
    setFormData({});
  };

  const handleDelete = () => {
    if (selectedItem) {
      setItems(items.filter((item) => item.id !== selectedItem.id));
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleEditClick = (item: Item) => {
    setSelectedItem(item);
    setFormData(item);
  };

  const handleCancelEdit = () => {
    setSelectedItem(null);
    setFormData({});
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* Add/Edit Form */}
<motion.div
  initial={{ opacity: 0, y: -20, height: 0 }}
  animate={{ opacity: 1, y: 0, height: "auto" }}
  transition={{ duration: 0.3 }}
  className="bg-white rounded-xl shadow-md border border-gray-200 p-6 w-full flex flex-col"
>
  <div className="flex items-center mb-4">
    <h3 className="text-lg font-semibold text-gray-800">
      {selectedItem
        ? `Editing "${selectedItem.productName}"`
        : "Add New Item"}
    </h3>
  </div>

  {/* Inputs Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="space-y-2">
      <Label htmlFor="productName">Name</Label>
      <Input
        id="productName"
        value={formData.productName || ""}
        onChange={(e) =>
          setFormData({ ...formData, productName: e.target.value })
        }
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="qty">Quantity</Label>
      <Input
        id="qty"
        type="number"
        value={formData.qty || ""}
        onChange={(e) =>
          setFormData({ ...formData, qty: Number(e.target.value) })
        }
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="price">Price</Label>
      <Input
        id="price"
        type="number"
        value={formData.price || ""}
        onChange={(e) =>
          setFormData({ ...formData, price: Number(e.target.value) })
        }
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="batchNo">Batch No.</Label>
      <Input
        id="batchNo"
        value={formData.batchNo || ""}
        onChange={(e) =>
          setFormData({ ...formData, batchNo: e.target.value })
        }
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="expiryDate">Expiry Date</Label>
      <Input
        id="expiryDate"
        type="date"
        value={formData.expiryDate || ""}
        onChange={(e) =>
          setFormData({ ...formData, expiryDate: e.target.value })
        }
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="pack">Pack</Label>
      <Input
        id="pack"
        value={formData.pack || ""}
        onChange={(e) =>
          setFormData({ ...formData, pack: e.target.value })
        }
      />
    </div>

    <div className="space-y-2">
      <Label htmlFor="supplierTax">Supplier Tax</Label>
      <Input
        id="supplierTax"
        value={formData.supplierTax || ""}
        onChange={(e) =>
          setFormData({ ...formData, supplierTax: e.target.value })
        }
      />
    </div>
  </div>

  {/* Buttons Row */}
<div className="flex mt-6 w-full">
  <div className="flex gap-3 ml-auto">
    <Button onClick={handleSave} variant="gradient">
      {selectedItem ? (
        <>
          <Save className="w-4 h-4 mr-2" />
          Update
        </>
      ) : (
        <>
          <Plus className="w-4 h-4 mr-2" />
          Add
        </>
      )}
    </Button>

    <Button onClick={handleCancelEdit} variant="outline">
      <X className="w-4 h-4 mr-2" />
      {selectedItem ? "Cancel" : "Clear"}
    </Button>
  </div>
</div>


</motion.div>


      {/* Search Bar */}
      <Card className="p-2 w-full">
        <CardContent className="flex items-center gap-2 p-0">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search items by name or batch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Batch No.
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Pack
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Supplier Tax
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paginatedItems.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-6 py-1">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(item)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-red-600 hover:bg-red-50"
                        disabled={!!selectedItem}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-1">{item.productName}</td>
                  <td className="px-6 py-1">{item.qty}</td>
                  <td className="px-6 py-1">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-1">{item.batchNo}</td>
                  <td className="px-6 py-1">
                    {item.expiryDate
                      ? new Date(item.expiryDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-1">{item.pack}</td>
                  <td className="px-6 py-1">{item.supplierTax}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-0 flex justify-center items-center gap-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationFirst
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>

                <PaginationItem>
                  <span className="text-sm text-gray-600 px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLast
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
          </DialogHeader>

          <div className="p-6 pt-0">
            <p>Are you sure you want to delete "{selectedItem?.productName}"?</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
