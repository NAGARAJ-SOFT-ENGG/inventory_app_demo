import React, { useState, useEffect } from "react";
import { 
  X, 
  Plus, 
  ScanBarcode, 
  ChevronDown, 
  Trash2
} from "lucide-react"; 
import { mockItems, mockQuantities, mockSuppliers } from "../data/mockData";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";


// --- MAIN COMPONENT ---

const POScreen = () => {
  // --- STATE ---
  const [items, setItems] = useState([
    // { id: 1, name: "POPCORN T-SHIRT", description: "", hsn: "", qty: 1, unit: "PCS", price: 350, discount: 0, tax: 0, amount: 350 }
  ]);

  const [globalState, setGlobalState] = useState({
    invoiceNo: "1",
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentTerms: "30",
    roundOff: 0,
    isAutoRoundOff: true,
    amountPaid: 0,
    paymentMode: "Cash",
    termsVisible: true,
  });

  // --- CALCULATIONS ---

  const calculateRow = (item) => {
    // 1. Base Amount
    const baseAmount = (parseFloat(String(item.qty)) || 0) * (parseFloat(String(item.price)) || 0);
    const taxableValue = baseAmount - (parseFloat(String(item.discount)) || 0);
    const taxVal = taxableValue * ((item.tax || 0) / 100);
    const finalAmount = taxableValue + taxVal;

    return { 
      ...item, 
      amount: finalAmount 
    };
  };

  // Recalculate totals whenever items or global state changes
  const totals = React.useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const totalDiscount = items.reduce((sum, item) => sum + (parseFloat(String(item.discount)) || 0), 0);
    const taxableAmount = subtotal - totalDiscount;
    const totalTax = items.reduce((sum, item) => sum + ((item.qty * item.price) - (parseFloat(String(item.discount)) || 0)) * ((parseFloat(String(item.tax)) || 0) / 100), 0);
    
    let total = subtotal - totalDiscount + totalTax;
    
    // Round Off Logic
    let roundOffValue = 0;
    if (globalState.isAutoRoundOff) {
      const rounded = Math.round(total);
      roundOffValue = rounded - total;
      total = rounded;
    } else {
      total += parseFloat(String(globalState.roundOff)) || 0;
      roundOffValue = parseFloat(String(globalState.roundOff)) || 0;
    }

    const balanceDue = total - (parseFloat(String(globalState.amountPaid)) || 0);

    return { subtotal, totalDiscount, taxableAmount, totalTax, total, roundOffValue, balanceDue };
  }, [items, globalState]);

  // --- HANDLERS ---

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      name: "",
      description: "",
      hsn: "",
      qty: 1,
      unit: "PCS",
      price: 0,
      discount: 0,
      tax: 0,
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id && field === 'name') {
        const selectedMockItem = mockItems.find(mi => mi.productName === value);
        if (selectedMockItem) {
          // When item name changes, update the price from mock data
          item.price = selectedMockItem.price;
        }
      }
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        return calculateRow(updatedItem);
      }
      return item;
    }));
  };

  return (
    <div className="min-h-screen  font-sans text-gray-800 pb-6">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between text-gray-900 mb-2 sticky top-0 z-20">       
         <h1 className="text-xl font-semibold text-gray-800">Create Purchase Invoice</h1>
        
        <div className="flex items-center gap-3">          
          <Button variant="gradient" className="py-2" >Save Purchase</Button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-0 space-y-4">
        
        {/* --- MAIN FORM CARD --- */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          
          {/* Top Section: Party & Details */}
          <div className="p-4 border-b border-gray-200 space-y-4">
            
            {/* First Row: Party and Invoice No */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="space-y-2">
                <Label>Bill From</Label>
                <Select>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSuppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.name}>{supplier.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                  <Label>Purchase Inv No</Label>
                  <Input value={globalState.invoiceNo} onChange={(e) => setGlobalState({...globalState, invoiceNo: e.target.value})} className="bg-gray-50" />
              </div>
            </div>

            {/* Second Row: Dates and Terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Purchase Inv Date</Label>
                  <Input 
                    type="date" 
                    value={globalState.date} 
                    onChange={(e) => setGlobalState({...globalState, date: e.target.value})}
                    className="bg-gray-50" 
                  /> 
                </div>
                <div className="space-y-2">
                   <Label>Payment Terms</Label>
                    <Input placeholder="e.g., 30 days" />
                </div>
                <div className="space-y-2">
                   <Label>Due Date</Label>
                   <Input 
                      type="date" 
                      value={globalState.dueDate} 
                      onChange={(e) => setGlobalState({...globalState, dueDate: e.target.value})}
                      className="bg-gray-50" 
                    />
                </div>
            </div>
          </div>

          {/* --- ITEMS TABLE (FIXED UI) --- */}
          <div className="overflow-x-auto w-full border-t border-b border-gray-200">
            <table className="w-full min-w-[1000px] border-collapse">
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
                  <tr key={item.id} className="group hover:bg-gray-50 transition-colors align-top">
                    {/* NO */}
                    <td className="py-3 px-3 text-center text-gray-500 text-sm align-top pt-4">
                      {index + 1}
                    </td>

                    {/* ITEMS/SERVICES */}
                    <td className="py-3 px-3">
                      <Select value={item.name} onValueChange={(value) => updateItem(item.id, 'name', value)}>
                        <SelectTrigger><SelectValue placeholder="Select Item" /></SelectTrigger>
                        <SelectContent>
                          {mockItems.map(mockItem => (
                            <SelectItem key={mockItem.id} value={mockItem.productName}>{mockItem.productName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>

                    {/* UNIT */}
                    <td className="py-3 px-3">
                      <Select value={item.unit} onValueChange={(value) => updateItem(item.id, 'unit', value)}>
                        <SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger>
                        <SelectContent>
                          {mockQuantities.map(q => (
                            <SelectItem key={q.id} value={q.unit}>{q.unit}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>

                    {/* QTY */}
                    <td className="py-3 px-3">
                      <Select 
                        value={String(item.qty)} 
                        onValueChange={(value) => updateItem(item.id, 'qty', parseFloat(value) || 0)}
                      >
                        <SelectTrigger><SelectValue placeholder="Qty" /></SelectTrigger>
                        <SelectContent>
                          {mockQuantities.map(q => (
                            <SelectItem key={q.id} value={String(q.value)}>{q.value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>

                    {/* PRICE */}
                    <td className="py-3 px-3">
                      <Input 
                        type="number" 
                        value={item.price} 
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        className="text-right"
                      />
                    </td>

                    {/* DISCOUNT */}
                    <td className="py-3 px-3">
                      <Input 
                        type="number" 
                        placeholder="0.00"
                        value={item.discount} 
                        onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                        className="text-right"
                      />
                    </td>

                    {/* TAX */}
                    <td className="py-3 px-3">
                      <Input 
                        type="number" 
                        placeholder="%"
                        value={item.tax} 
                        onChange={(e) => updateItem(item.id, 'tax', parseFloat(e.target.value) || 0)}
                        className="text-right"
                      />
                    </td>

                    {/* AMOUNT */}
                    <td className="py-3 px-3 text-right font-medium text-gray-800 pt-4">
                      ₹ {item.amount.toFixed(2)}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-3 px-3 text-center pt-3">
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

            {/* Add Item Bar */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-4">
                <button 
                  onClick={handleAddItem}
                  className="flex-1 border-2 border-dashed border-blue-300 rounded-md p-3 flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors text-blue-500 font-medium text-sm gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Item
                </button>
                <div className="w-48">
                  <Button variant="outline" className="w-full h-full border-gray-300 text-gray-700 gap-2 font-normal">
                    <ScanBarcode className="h-5 w-5" />
                    Scan Barcode
                  </Button>
                </div>
              </div>
            </div>

             {/* Subtotal Row */}
             {/* <div className="flex justify-end pt-4 pr-12 pb-4 gap-12 text-sm border-t border-gray-100 bg-white">
                 <div className="flex items-center gap-8">
                    <span className="text-xs font-bold text-gray-400 tracking-wider">SUBTOTAL</span>
                    <div className="flex gap-12"> 
                       <span className="w-24 text-right text-gray-400">₹ {(totals.taxableAmount || 0).toFixed(2)}</span>
                       <span className="w-24 text-right font-bold text-gray-800">₹ {(totals.subtotal || 0).toFixed(2)}</span>
                    </div>
                 </div>
             </div> */}
          </div>

          {/* --- BOTTOM SECTION --- */}
          <div className="flex flex-col lg:flex-row border-t border-gray-200">
            
            {/* Left: Notes & Terms */}
            <div className="w-full lg:w-1/2 p-0 space-y-6 border-r border-gray-200">
               {/* <button className="text-blue-500 text-sm font-medium hover:underline flex items-center gap-1">
                 <Plus className="h-3 w-3" /> Add Notes
               </button> */}
               
               {/* {globalState.termsVisible && (
                 <div className="space-y-2 relative group">
                   <div className="flex justify-between items-center">
                      <Label className="text-gray-700 font-semibold mb-0">Terms and Conditions</Label>
                      <button 
                        onClick={() => setGlobalState({...globalState, termsVisible: false})}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                   </div>
                   <div className="bg-gray-100 rounded-md p-4 text-xs text-gray-600 space-y-1 border border-gray-200">
                     <p>1. Goods once sold will not be taken back or exchanged</p>
                     <p>2. All disputes are subject to [ENTER_YOUR_CITY_NAME] jurisdiction only</p>
                   </div>
                 </div>
               )} */}
            </div>

            {/* Right: Calculations */}
            <div className="w-full lg:w-1/2 p-2 space-y-3 bg-white">
               
               {/* Additional Charges */}
               {/* <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-2">
                    <button className="text-blue-500 hover:underline flex items-center gap-1">
                        <Plus className="h-3 w-3" /> Add Additional Charges
                    </button>
                 </div>
                 <div className="w-32">
                    <Input 
                      type="number" 
                      className="text-right h-7"  
                      value={globalState.additionalCharges || ''}
                      onChange={(e) => setGlobalState({...globalState, additionalCharges: parseFloat(e.target.value) || 0})}
                    />
                 </div>
               </div> */}

               {/* Taxable Amount Display */}
               {/* <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-600">Taxable Amount</span>
                 <span className="font-medium text-gray-800">₹ {(totals.taxableAmount || 0).toFixed(2)}</span>
               </div> */}

               {/* Global Discount */}
               {/* <div className="flex justify-between items-center text-sm">
                 <button className="text-blue-500 hover:underline flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Add Discount
                 </button>
                 <div className="w-32 flex items-center gap-2 text-gray-600">
                    <span>-</span>
                    <Input 
                      type="number" 
                      className="text-right h-7"
                      value={globalState.globalDiscount || ''}
                      onChange={(e) => setGlobalState({...globalState, globalDiscount: parseFloat(e.target.value) || 0})}
                    />
                 </div>
               </div> */}
               
               {/* Round Off */}
               {/* <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2">
                     <input 
                        type="checkbox" 
                        id="autoRoundOff"
                        checked={globalState.isAutoRoundOff}
                        onChange={(e) => setGlobalState({...globalState, isAutoRoundOff: e.target.checked})}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4" 
                     />
                     <label htmlFor="autoRoundOff" className="text-sm text-gray-700 cursor-pointer">Auto Round Off</label>
                  </div>
                  
                  {globalState.isAutoRoundOff ? (
                     <span className="text-sm text-gray-600">{totals.roundOffValue > 0 ? '+' : ''}{(totals.roundOffValue || 0).toFixed(2)}</span>
                  ) : (
                    <div className="flex items-center gap-2">
                       <Select className="w-20 h-8 text-xs p-1">
                         <option>+ Add</option>
                         <option>- Reduce</option>
                       </Select>
                       <div className="relative">
                         <span className="absolute left-2 top-1.5 text-gray-500 text-xs">₹</span>
                         <Input 
                            className="w-20 h-8 pl-5 text-right" 
                            value={globalState.roundOff || ''}
                            onChange={(e) => setGlobalState({...globalState, roundOff: parseFloat(e.target.value)})}
                         />
                       </div>
                    </div>
                  )}
               </div> */}
               
               {/* <div className="border-t border-gray-100 my-2"></div> */}

               {/* Total Amount */}
               <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-800">Total Amount</span>
                  <div className="bg-gray-100 text-gray-400 px-4 py-1 rounded-md text-sm font-medium min-w-[140px] text-right border border-gray-200">
                    ₹ {(totals.total || 0).toFixed(2)} 
                  </div>
               </div>

               {/* <div className="border-t border-gray-100 my-4"></div> */}
               
               {/* Payment Section */}
               <div className="space-y-4 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                  <div className="flex justify-end">
                     <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 cursor-pointer select-none" htmlFor="full-paid">Mark as fully paid</label>
                        <input 
                           id="full-paid" 
                           type="checkbox" 
                           onChange={(e) => {
                             if(e.target.checked) setGlobalState({...globalState, amountPaid: totals.total});
                             else setGlobalState({...globalState, amountPaid: 0});
                           }}
                           className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 h-4 w-4" 
                        />
                     </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4">
                     <span className="text-sm font-medium text-gray-600">Amount Paid ₹</span>
                     <div className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                           <span className="absolute left-3 top-4 text-gray-500 font-medium"></span>
                           <Input 
                              className="pl-6 bg-white font-medium text-gray-800" 
                              value={globalState.amountPaid || ''}
                              onChange={(e) => setGlobalState({...globalState, amountPaid: parseFloat(e.target.value) || 0})}
                           />
                        </div>
                        <Select 
                           value={globalState.paymentMode}
                           onValueChange={(value) => setGlobalState({...globalState, paymentMode: value})}
                        >
                          <SelectTrigger className="w-32 bg-white"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Bank">Bank</SelectItem>
                            <SelectItem value="Cheque">Cheque</SelectItem>
                          </SelectContent>
                        </Select>
                     </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                     <span className="text-green-600 font-medium text-sm">Balance Amount</span>
                     <span className="text-green-600 font-bold text-lg">₹ {totals.balanceDue > 0 ? (totals.balanceDue || 0).toFixed(2) : '0.00'}</span>
                  </div>
               </div>
            </div>

            {/* Right: Signature */}
            {/* <div className="w-full lg:w-1/2 p-6 flex flex-col justify-end items-end">
               <div className="w-full max-w-xs text-center">
                 <div className="h-16 border-2 border-dashed border-blue-200 rounded-lg flex items-center justify-center bg-blue-50/10 cursor-pointer hover:bg-blue-50 transition-colors">
                    <span className="text-blue-400 text-sm flex items-center gap-1"><Plus className="h-3 w-3" /> Add Signature</span>
                 </div>
                 <div className="border-t-2 border-gray-300 mt-2"></div>
                 <p className="text-xs text-gray-500 mt-1">Authorized Signatory</p>
               </div>

            </div> */}
          </div>

        </div>
      </div>
    </div>
  );
};

export default POScreen;