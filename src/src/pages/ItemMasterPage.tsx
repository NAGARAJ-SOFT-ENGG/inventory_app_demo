import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Plus, Edit, Trash2, X as XIcon, ChevronLeft, ChevronRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import { Card, CardContent} from "../../components/ui/card";

import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

import { mockItems } from "../data/mockData";
import { Item } from "../models/item.model";

export const ItemMasterPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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

  const handleAdd = () => {
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

    setItems([...items, newItem]);
    setIsAddDialogOpen(false);
    setFormData({});
  };

  const handleEdit = () => {
    if (selectedItem) {
      setItems(
        items.map((item) =>
          item.id === selectedItem.id ? { ...item, ...formData } : item
        )
      );
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

      {/* Toolbar */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

  <Card className="p-2 w-full">
    <CardContent className="flex items-center justify-between gap-2 p-0">
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

  <Button
    onClick={() => setIsAddDialogOpen(true)}
    variant="gradient"
    size="lg"
  >
    <Plus className="w-5 h-5 mr-2" />
    Add Item
  </Button>

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
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Pack</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Supplier Tax</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">Actions</th>
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

                  <td className="px-6 py-1">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(item)}
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
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
          }
        }}
      >
        <DialogContent className="flex flex-col" style={{ height: "90vh" }}>
          <DialogHeader>
            <DialogTitle>{isAddDialogOpen ? "Add Item" : "Edit Item"}</DialogTitle>
          </DialogHeader>

          {/* Scrollable form */}
          <div className="flex-grow min-h-0 overflow-y-auto p-6">
            <div className="py-4 space-y-4">

              {/* Product Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productName" className="text-right">Name</Label>
                <Input
                  id="productName"
                  value={formData.productName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, productName: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>

              {/* Quantity */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="qty" className="text-right">Quantity</Label>
                <Input
                  id="qty"
                  type="number"
                  value={formData.qty || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, qty: Number(e.target.value) })
                  }
                  className="col-span-3"
                />
              </div>

              {/* Price */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="col-span-3"
                />
              </div>

              {/* Batch */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="batchNo" className="text-right">Batch No.</Label>
                <Input
                  id="batchNo"
                  value={formData.batchNo || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, batchNo: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>

              {/* Expiry */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expiryDate" className="text-right">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>

              {/* Pack */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pack" className="text-right">Pack</Label>
                <Input
                  id="pack"
                  value={formData.pack || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, pack: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>

              {/* Supplier Tax */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supplierTax" className="text-right">Supplier Tax</Label>
                <Input
                  id="supplierTax"
                  value={formData.supplierTax || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, supplierTax: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>

            </div>
          </div>

          <DialogFooter>
            <Button
              variant="gradient"
              size="lg"
              onClick={isAddDialogOpen ? handleAdd : handleEdit}
            >
              {isAddDialogOpen ? "Add" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
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
