import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Edit, Trash2, Save, X } from 'lucide-react';
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "../../components/ui/select";
import { mockPrices, mockQuantities } from '../data/mockData';
import { Price } from '../models/price.model';
import { Card, CardContent } from '../../components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
} from '../../components/ui/pagination';

export const PriceMasterPage: React.FC = () => {
  const [prices, setPrices] = useState<Price[]>(mockPrices);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null); 
  const [formData, setFormData] = useState<Partial<Price>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredPrices = prices.filter((price) =>
    price.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPrices.length / itemsPerPage);
  const paginatedPrices = filteredPrices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSave = () => {
    if (selectedPrice) {
      // Update existing price
      setPrices(
        prices.map((price) =>
          price.id === selectedPrice.id ? { ...price, ...formData } : price
        )
      );
    } else {
      // Add new price
      const newPrice: Price = {
        id: `price-${Date.now()}`,
        unit: formData.unit || 'kg',
        price: formData.price || 0,
      };
      setPrices([...prices, newPrice]);
    }

    setSelectedPrice(null);
    setFormData({});
  };

  const handleDelete = () => {
    if (selectedPrice) {
      setPrices(prices.filter((p) => p.id !== selectedPrice.id));
      setIsDeleteDialogOpen(false);
      setSelectedPrice(null);
    }
  };

  const handleEditClick = (price: Price) => {
    setSelectedPrice(price);
    setFormData(price);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setSelectedPrice(null);
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
            {selectedPrice
              ? `Editing "${selectedPrice.unit}"`
              : "Add New Price"}
          </h3>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Select
              value={formData.unit}
              onValueChange={(value: 'ton' | 'kg' | 'bags') => setFormData({ ...formData, unit: value })}
            >
              <SelectTrigger id="unit">
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ton">Ton</SelectItem>
                <SelectItem value="kg">Kg</SelectItem>
                <SelectItem value="bags">Bags</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={formData.price || ""}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
            />
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex mt-6 w-full">
          <div className="flex gap-3 ml-auto">
            <Button onClick={handleSave} variant="gradient">
              {selectedPrice ? (
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
              {selectedPrice ? "Cancel" : "Clear"}
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
              placeholder="Search by unit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Prices Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Actions
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedPrices.map((price, index) => (
                <motion.tr
                  key={price.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-6 py-1">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(price)} className="text-blue-600 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setSelectedPrice(price); setIsDeleteDialogOpen(true); }}
                        className="text-red-600 hover:bg-red-50"
                        disabled={!!selectedPrice}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-1 text-gray-900">{price.unit}</td>
                  <td className="px-6 py-1 text-gray-600">₹{price.price.toFixed(2)}</td>
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
                  <PaginationFirst onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm text-gray-600 px-4">Page {currentPage} of {totalPages}</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLast onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Price</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0">
            <p>Are you sure you want to delete the price for "{selectedPrice?.unit}"?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};