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

import { mockSuppliers } from "../data/mockSupplierData";
import { Supplier } from "../models/supplier.model";

export const SupplierMasterPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<Supplier>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSave = () => {
    const newSupplier: Supplier = {
      id: `supplier-${Date.now()}`,
      name: formData.name || "",
      contactPerson: formData.contactPerson || "",
      email: formData.email || "",
      phone: formData.phone || "",
    };

    if (selectedSupplier) {
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === selectedSupplier.id
            ? { ...supplier, ...formData }
            : supplier
        )
      );
    } else {
      setSuppliers([...suppliers, newSupplier]);
    }

    setSelectedSupplier(null);
    setFormData({});
  };

  const handleDelete = () => {
    if (selectedSupplier) {
      setSuppliers(
        suppliers.filter((supplier) => supplier.id !== selectedSupplier.id)
      );
      setIsDeleteDialogOpen(false);
      setSelectedSupplier(null);
    }
  };

  const handleEditClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData(supplier);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setSelectedSupplier(null);
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
            {selectedSupplier
              ? `Editing "${selectedSupplier.name}"`
              : "Add New Supplier"}
          </h3>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person</Label>
            <Input
              id="contactPerson"
              value={formData.contactPerson || ""}
              onChange={(e) =>
                setFormData({ ...formData, contactPerson: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex mt-6 w-full">
          <div className="flex gap-3 ml-auto">
            <Button onClick={handleSave} variant="gradient">
              {selectedSupplier ? (
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
              {selectedSupplier ? "Cancel" : "Clear"}
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
              placeholder="Search suppliers by name or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Supplier Name
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Phone
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {paginatedSuppliers.map((supplier, index) => (
                <motion.tr
                  key={supplier.id}
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
                        onClick={() => handleEditClick(supplier)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-red-600 hover:bg-red-50"
                        disabled={!!selectedSupplier}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-1">{supplier.name}</td>
                  <td className="px-6 py-1">{supplier.contactPerson}</td>
                  <td className="px-6 py-1">{supplier.email}</td>
                  <td className="px-6 py-1">{supplier.phone}</td>
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
            <DialogTitle>Delete Supplier</DialogTitle>
          </DialogHeader>

          <div className="p-6 pt-0">
            <p>
              Are you sure you want to delete "{selectedSupplier?.name}"?
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
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