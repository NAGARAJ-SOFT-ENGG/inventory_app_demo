import React from "react";
import { Plus, ScanBarcode, Trash2 } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { mockItems, mockQuantities } from "../../src/data/mockData";

interface Item {
  id: number;
  name: string;
  description: string;
  hsn: string;
  qty: number;
  unit: string;
  price: string | number;
  discount: string | number;
  tax: string | number;
  amount: number;
}

interface ItemsTableProps {
  items: Item[];
  handleAddItem: () => void;
  handleDeleteItem: (id: number) => void;
  updateItem: (id: number, field: string, value: any) => void;
  view: 'desktop' | 'mobile';
}

const ItemsTable: React.FC<ItemsTableProps> = ({
  items,
  handleAddItem,
  handleDeleteItem,
  updateItem,
  view,
}) => {
  return (
    <div className="w-full border-t border-b border-gray-200">

      {view === 'desktop' && (
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1000px] border-collapse print-table">
            <thead className="bg-gray-50 border-y border-gray-200 text-sm font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="py-2 px-3 text-center w-12">NO</th>
                <th className="py-2 px-3 text-center w-auto">ITEMS/SERVICES</th>
                <th className="py-2 px-3 text-center w-32">UNIT</th>
                <th className="py-2 px-3 text-center w-32">QTY</th>
                <th className="py-2 px-3 text-center w-32">PRICE (₹)</th>
                <th className="py-2 px-3 text-center w-32">DISCOUNT</th>
                <th className="py-2 px-3 text-center w-32">TAX</th>
                <th className="py-2 px-3 text-center w-32">AMOUNT (₹)</th>
                <th className="py-2 px-3 w-10"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {items.map((item, index) => (
                <tr key={item.id} className="group hover:bg-gray-50 transition-colors align-middle">

                  {/* NO */}
                  <td className="py-3 px-3 text-center text-gray-500 text-sm">
                    {index + 1}
                  </td>

                  {/* ITEM NAME */}
                  <td className="py-3 px-3">
                    <Select
                      value={item.name}
                      onValueChange={(value) => updateItem(item.id, "name", value)}
                    >
                      <SelectTrigger><SelectValue placeholder="Select Item" /></SelectTrigger>
                      <SelectContent>
                        {mockItems.map((mi) => (
                          <SelectItem key={mi.id} value={mi.productName}>
                            {mi.productName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>

                  {/* UNIT */}
                  <td className="py-3 px-3">
                    <Select
                      value={item.unit}
                      onValueChange={(value) => updateItem(item.id, "unit", value)}
                    >
                      <SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger>
                      <SelectContent>
                        {mockQuantities.map((q) => (
                          <SelectItem key={q.id} value={q.unit}>
                            {q.unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>

                  {/* QTY */}
                  <td className="py-3 px-3">
                    <Input
                      type="number"
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                      className="text-right"
                    />
                  </td>

                  {/* PRICE */}
                  <td className="py-3 px-3">
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, "price", e.target.value)}
                      className="text-right"
                    />
                  </td>

                  {/* DISCOUNT */}
                  <td className="py-3 px-3">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={item.discount}
                      onChange={(e) => updateItem(item.id, "discount", e.target.value)}
                      className="text-right"
                    />
                  </td>

                  {/* TAX */}
                  <td className="py-3 px-3">
                    <Input
                      type="number"
                      placeholder="%"
                      value={item.tax}
                      onChange={(e) => updateItem(item.id, "tax", e.target.value)}
                      className="text-right"
                    />
                  </td>

                  {/* AMOUNT */}
                  <td className="py-3 px-3 text-right font-medium text-gray-800">
                    ₹ {item.amount.toFixed(2)}
                  </td>

                  {/* DELETE ACTION */}
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view === 'mobile' && (
        <div className="divide-y divide-gray-100">
          {items.map((item, index) => (
            <div key={item.id} className="border-b p-4 space-y-4">

              {/* HEADER */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>ITEM #{index + 1}</span>
                <button onClick={() => handleDeleteItem(item.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* ITEM NAME */}
              <div>
                <Label className="text-xs font-medium">Item / Service</Label>
                <Select value={item.name} onValueChange={(val) => updateItem(item.id, "name", val)}>
                  <SelectTrigger><SelectValue placeholder="Select Item" /></SelectTrigger>
                  <SelectContent>
                    {mockItems.map((mi) => (
                      <SelectItem key={mi.id} value={mi.productName}>
                        {mi.productName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* QTY + UNIT + PRICE */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-medium">Qty</Label>
                  <Input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                    className="text-right"
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium">Unit</Label>
                  <Select
                    value={item.unit}
                    onValueChange={(val) => updateItem(item.id, "unit", val)}
                  >
                    <SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger>
                    <SelectContent>
                      {mockQuantities.map((q) => (
                        <SelectItem key={q.id} value={q.unit}>
                          {q.unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-medium">Price (₹)</Label>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, "price", e.target.value)}
                    className="text-right"
                  />
                </div>
              </div>

              {/* DISCOUNT + TAX + AMOUNT */}
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div>
                  <Label className="text-xs font-medium">Discount</Label>
                  <Input
                    type="number"
                    value={item.discount}
                    onChange={(e) => updateItem(item.id, "discount", e.target.value)}
                    className="text-right"
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium">Tax (%)</Label>
                  <Input
                    type="number"
                    value={item.tax}
                    onChange={(e) => updateItem(item.id, "tax", e.target.value)}
                    className="text-right"
                  />
                </div>

                <div className="text-right">
                  <Label className="text-xs font-medium">Amount (₹)</Label>
                  <div className="font-medium text-gray-800 pt-1">₹ {item.amount.toFixed(2)}</div>
                </div>
              </div>

            </div>
          ))}
        </div> // This closing div was missing its opening counterpart in the map
      )}

      {/* =====================================================
           ADD ITEM BAR
      ====================================================== */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-4">
          <button
            onClick={handleAddItem}
            className="flex-1 border-2 border-dashed border-blue-300 rounded-md p-3
            flex items-center justify-center hover:bg-blue-50 transition-colors 
            text-blue-500 font-medium text-sm gap-2"
          >
            <Plus className="h-4 w-4" /> Add Item
          </button>

          <div className="w-48">
            <Button variant="outline" className="w-full h-full border-gray-300 text-gray-700 gap-2 font-normal">
              <ScanBarcode className="h-5 w-5" /> Scan Barcode
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ItemsTable;
