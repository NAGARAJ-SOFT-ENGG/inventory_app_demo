// import React, { useState } from "react";
// import { motion } from "motion/react";
// import { Search, Plus, Edit, Trash2, Eye, Filter } from "lucide-react";
// import { mockProducts } from "../data/mockData";
// import { Product } from "../models/product.model";
// import { PDFButton } from "../components/PDFButton";
// import { generatePDF } from "../utils/pdfGenerator";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "../../components/ui/dialog";
// import { Label } from "../../components/ui/label";
// import { Input } from "../../components/ui/input";
// import { Textarea } from "../../components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";

// export const Products: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>(mockProducts);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [formData, setFormData] = useState<Partial<Product>>({});

//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleGeneratePDF = () => {
//     const headers = ["ID", "Name", "SKU", "Category", "Price", "Stock", "Supplier"];
//     const data = products.map((p) => [
//       p.id,
//       p.name,
//       p.sku,
//       p.category,
//       `₹${p.price.toFixed(2)}`,
//       p.stock.toString(),
//       p.supplier,
//     ]);
//     generatePDF("Products Report", headers, data, "products-report.pdf");
//   };

//   const handleAdd = () => {
//     const newProduct: Product = {
//       id: `prod-${Date.now()}`,
//       name: formData.name || "",
//       sku: formData.sku || "",
//       category: formData.category || "",
//       description: formData.description || "",
//       price: formData.price || 0,
//       oldPrice: formData.oldPrice,
//       coupon: formData.coupon,
//       visibility: formData.visibility || "published",
//       sizes: formData.sizes || [],
//       stock: formData.stock || 0,
//       supplier: formData.supplier || "",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };
//     setProducts([...products, newProduct]);
//     setIsAddDialogOpen(false);
//     setFormData({});
//   };

//   const handleEdit = () => {
//     if (selectedProduct) {
//       setProducts(
//         products.map((p) =>
//           p.id === selectedProduct.id ? { ...p, ...formData, updatedAt: new Date().toISOString() } : p
//         )
//       );
//       setIsEditDialogOpen(false);
//       setSelectedProduct(null);
//       setFormData({});
//     }
//   };

//   const handleDelete = () => {
//     if (selectedProduct) {
//       setProducts(products.filter((p) => p.id !== selectedProduct.id));
//       setIsDeleteDialogOpen(false);
//       setSelectedProduct(null);
//     }
//   };

//   const openEditDialog = (product: Product) => {
//     setSelectedProduct(product);
//     setFormData(product);
//     setIsEditDialogOpen(true);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h2 className="text-gray-900 mb-2">Products</h2>
//           <p className="text-gray-600">Manage your product catalog</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <PDFButton onClick={handleGeneratePDF} />
//           <button
//             onClick={() => {
//               setFormData({});
//               setIsAddDialogOpen(true);
//             }}
//             className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
//           >
//             <Plus className="w-5 h-5" />
//             <span>Add Product</span>
//           </button>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* Products Table */}
//       <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs uppercase tracking-wider">
//                   Product
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
//                   SKU
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
//                   Category
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
//                   Price
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
//                   Stock
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredProducts.map((product, index) => (
//                 <motion.tr
//                   key={product.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.05 }}
//                   className="hover:bg-blue-50 transition-colors"
//                 >
//                   <td className="px-6 py-4">
//                     <div>
//                       <p className="text-gray-900">{product.name}</p>
//                       <p className="text-sm text-gray-500">{product.supplier}</p>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-gray-600">{product.sku}</td>
//                   <td className="px-6 py-4">
//                     <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                       {product.category}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <p className="text-gray-900">₹{product.price.toFixed(2)}</p>
//                     {product.oldPrice && (
//                       <p className="text-sm text-gray-500 line-through">
//                         ₹{product.oldPrice.toFixed(2)}
//                       </p>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 text-gray-900">{product.stock}</td>
//                   <td className="px-6 py-4">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs border ${
//                         product.visibility === "published"
//                           ? "bg-green-100 text-green-800 border-green-200"
//                           : "bg-gray-100 text-gray-800 border-gray-200"
//                       }`}
//                     >
//                       {product.visibility.toUpperCase()}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => openEditDialog(product)}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                       >
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => {
//                           setSelectedProduct(product);
//                           setIsDeleteDialogOpen(true);
//                         }}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Add/Edit Dialog */}
//       <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
//         if (!open) {
//           setIsAddDialogOpen(false);
//           setIsEditDialogOpen(false);
//           setFormData({});
//         }
//       }}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>{isAddDialogOpen ? "Add Product" : "Edit Product"}</DialogTitle>
//           </DialogHeader>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Product Name</Label>
//               <Input
//                 id="name"
//                 value={formData.name || ""}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 placeholder="Enter product name"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="sku">SKU</Label>
//               <Input
//                 id="sku"
//                 value={formData.sku || ""}
//                 onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
//                 placeholder="Enter SKU"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="category">Category</Label>
//               <Input
//                 id="category"
//                 value={formData.category || ""}
//                 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                 placeholder="Enter category"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="supplier">Supplier</Label>
//               <Input
//                 id="supplier"
//                 value={formData.supplier || ""}
//                 onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
//                 placeholder="Enter supplier"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="price">Price</Label>
//               <Input
//                 id="price"
//                 type="number"
//                 value={formData.price || ""}
//                 onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
//                 placeholder="0.00"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="oldPrice">Old Price</Label>
//               <Input
//                 id="oldPrice"
//                 type="number"
//                 value={formData.oldPrice || ""}
//                 onChange={(e) => setFormData({ ...formData, oldPrice: parseFloat(e.target.value) })}
//                 placeholder="0.00"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="stock">Stock</Label>
//               <Input
//                 id="stock"
//                 type="number"
//                 value={formData.stock || ""}
//                 onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
//                 placeholder="0"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="visibility">Visibility</Label>
//               <Select
//                 value={formData.visibility || "published"}
//                 onValueChange={(value) => setFormData({ ...formData, visibility: value as any })}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="published">Published</SelectItem>
//                   <SelectItem value="scheduled">Scheduled</SelectItem>
//                   <SelectItem value="hidden">Hidden</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2 md:col-span-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 value={formData.description || ""}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 placeholder="Enter product description"
//                 rows={4}
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <button
//               onClick={() => {
//                 setIsAddDialogOpen(false);
//                 setIsEditDialogOpen(false);
//                 setFormData({});
//               }}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={isAddDialogOpen ? handleAdd : handleEdit}
//               className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
//             >
//               {isAddDialogOpen ? "Add" : "Save"}
//             </button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Delete Product</DialogTitle>
//           </DialogHeader>
//           <p className="text-gray-600">
//             Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
//           </p>
//           <DialogFooter>
//             <button
//               onClick={() => setIsDeleteDialogOpen(false)}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDelete}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               Delete
//             </button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };
