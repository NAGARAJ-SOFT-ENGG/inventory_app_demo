import { Employee } from "../models/employee.model";
import { Supplier } from "../models/supplier.model";
import { Item } from "../models/item.model";
import { Price } from "../models/price.model";
import { Quantity } from "../models/quantity.model";

export const mockItems: Item[] = [
  { id: 1, productName: 'Cement Bag', qty: 100, price: 350, batchNo: 'B001', expiryDate: '2026-05-20', pack: '50kg', supplierTax: '5%' },
  { id: 2, productName: 'Steel Rod (TMT)', qty: 500, price: 55000, batchNo: 'B002', expiryDate: '2027-01-15', pack: '1 Ton', supplierTax: '18%' },
  { id: 3, productName: 'Bricks (Red)', qty: 5000, price: 12, batchNo: 'B003', pack: '1000 units', supplierTax: '12%' },
  { id: 4, productName: 'Sand (River)', qty: 20, price: 1500, batchNo: 'B004', pack: 'Cubic Meter', supplierTax: '5%' },
  { id: 5, productName: 'Plywood Sheet', qty: 150, price: 800, batchNo: 'B005', expiryDate: '2028-11-30', pack: '8x4 ft', supplierTax: '12%' },
  { id: 6, productName: 'PVC Pipe', qty: 300, price: 120, batchNo: 'B006', pack: '10 ft length', supplierTax: '18%' },
];

export const mockPrices: Price[] = [
  { id: 1, unit: 'ton', price: 55000 },
  { id: 2, unit: 'kg', price: 55 },
  { id: 3, unit: 'bags', price: 350 },
  { id: 4, unit: 'piece', price: 12 },
  { id: 5, unit: 'cubic meter', price: 1500 },
  { id: 6, unit: 'liter', price: 40 },
  { id: 7, unit: 'gallon', price: 150 },
  { id: 8, unit: 'sq ft', price: 200 },
  { id: 9, unit: 'sq meter', price: 2150 },
  { id: 10, unit: 'running ft', price: 80 },
  { id: 11, unit: 'running meter', price: 260 }
];

export const mockQuantities: Quantity[] = [
  { id: 1, unit: 'Ton', value: 1000 },
  { id: 2, unit: 'Kg', value: 1 },
  { id: 3, unit: '25 bag', value: 25 },
  { id: 4, unit: '50 bag', value: 50 },
  { id: 5, unit: 'Piece', value: 1 },
  { id: 6, unit: 'Cubic Meter', value: 1 },
  { id: 7, unit: 'Liter', value: 1 },
  { id: 8, unit: 'Gallon', value: 3.78541 },
  { id: 9, 'unit': 'Sq Ft', value: 1 },
  { id: 10, 'unit': 'Sq Meter', value: 10.764 },
  { id: 11, 'unit': 'Running Ft', value: 1 },
  { id: 12, 'unit': 'Running Meter', value: 3.281 }
];

export const mockSuppliers: Supplier[] = [
  { id: "sup-1", supplierCode: "SUP0001", name: "Construction Supplies Co.", email: "contact@constructionsupplies.com", phone: "123-456-7890", address: "123 Industrial Rd, Metropolis, USA", city: "Metropolis", country: "USA", productsSupplied: ["Cement", "Steel"], rating: 4.5, totalOrders: 150, status: "active", createdAt: "2024-01-01T10:00:00Z" },
  { id: "sup-2", supplierCode: "SUP0002", name: "Global Building Materials", email: "sales@globalbuild.com", phone: "987-654-3210", address: "456 Commerce Blvd, Gotham, USA", city: "Gotham", country: "USA", productsSupplied: ["Bricks", "Sand"], rating: 4.0, totalOrders: 200, status: "active", createdAt: "2023-11-15T11:30:00Z" },
  { id: "sup-3", supplierCode: "SUP0003", name: "Eco-Friendly Wood Inc.", email: "info@ecowood.com", phone: "555-111-2222", address: "789 Forest Lane, Star City, USA", city: "Star City", country: "USA", productsSupplied: ["Timber", "Plywood"], rating: 4.8, totalOrders: 80, status: "active", createdAt: "2024-03-20T09:00:00Z" },
  { id: "sup-4", supplierCode: "SUP0004", name: "Metal Fabricators Ltd.", email: "orders@metalfab.com", phone: "222-333-4444", address: "101 Steel Way, Central City, USA", city: "Central City", country: "USA", productsSupplied: ["Steel Beams", "Rebar"], rating: 4.2, totalOrders: 120, status: "active", createdAt: "2024-02-10T14:00:00Z" },
  { id: "sup-5", supplierCode: "SUP0005", name: "Walk-in Customer", email: "na@walkin.com", phone: "N/A", address: "N/A", city: "N/A", country: "N/A", productsSupplied: [], rating: 5, totalOrders: 1000, status: "active", createdAt: "2024-01-01T00:00:00Z" },
];

export const mockScalesItems: any[] = [
  {
    globalState: { invoiceNo: 'SCALE-001', date: '2025-11-10', dueDate: '2025-12-10', amountPaid: 0 },
    supplier: mockSuppliers[0],
    items: [
      { id: 1, name: mockItems[0].productName, qty: 50, price: mockItems[0].price, discount: 0, tax: 5, amount: 18375 },
      { id: 2, name: mockItems[3].productName, qty: 10, price: mockItems[3].price, discount: 0, tax: 5, amount: 15750 },
    ],
    totals: { subtotal: 32500, totalDiscount: 0, taxableAmount: 32500, totalTax: 1625, total: 34125, roundOffValue: 0, balanceDue: 34125 },
    vehicleNumber: "TN01AB1234", transportName: "Fast Movers", driverName: "John Doe", mobileNumber: "9876543210",
  },
  {
    globalState: { invoiceNo: 'SCALE-002', date: '2025-11-11', dueDate: '2025-12-11', amountPaid: 100000 },
    supplier: mockSuppliers[1],
    items: [
      { id: 1, name: mockItems[1].productName, qty: 2, price: mockItems[1].price, discount: 1000, tax: 18, amount: 128620 },
      { id: 2, name: mockItems[2].productName, qty: 5000, price: mockItems[2].price, discount: 0, tax: 12, amount: 67200 },
    ],
    totals: { subtotal: 170000, totalDiscount: 1000, taxableAmount: 169000, totalTax: 26820, total: 195820, roundOffValue: 0, balanceDue: 95820 },
    vehicleNumber: "KA02CD5678", transportName: "Quick Logistics", driverName: "Jane Smith", mobileNumber: "8765432109",
  },
  {
    globalState: { invoiceNo: 'SCALE-003', date: '2025-11-12', dueDate: '2025-12-12', amountPaid: 0 },
    supplier: mockSuppliers[2],
    items: [
      { id: 1, name: mockItems[4].productName, qty: 100, price: mockItems[4].price, discount: 4000, tax: 12, amount: 85120 },
      { id: 2, name: 'Timber', qty: 5, price: 2500, discount: 0, tax: 12, amount: 14000 }, // Assuming Timber is a custom item
    ],
    totals: { subtotal: 92500, totalDiscount: 4000, taxableAmount: 88500, totalTax: 10620, total: 99120, roundOffValue: 0, balanceDue: 99120 },
    vehicleNumber: "AP03EF9012", transportName: "BuildWell Transports", driverName: "Peter Jones", mobileNumber: "7654321098",
  },
  {
    globalState: { invoiceNo: 'SCALE-004', date: '2025-11-13', dueDate: '2025-12-13', amountPaid: 5000 },
    supplier: mockSuppliers[4], // Walk-in Customer
    items: [
      { id: 1, name: mockItems[5].productName, qty: 20, price: mockItems[5].price, discount: 0, tax: 18, amount: 2832 },
    ],
    totals: { subtotal: 2400, totalDiscount: 0, taxableAmount: 2400, totalTax: 432, total: 2832, roundOffValue: 0, balanceDue: -2168 },
    vehicleNumber: "MH04GH3456", transportName: "Self", driverName: "Sam Wilson", mobileNumber: "6543210987",
  },
];

export const mockPOItems: any[] = [
  {
    globalState: { invoiceNo: 'PO-001', date: '2025-11-20', dueDate: '2025-12-20', amountPaid: 0 },
    supplier: mockSuppliers[0],
    items: [
      { id: 1, name: mockItems[0].productName, qty: 100, price: mockItems[0].price, discount: '2%', tax: '5%', amount: 35910 },
      { id: 2, name: 'Gravel', qty: 15, price: 1200, discount: 0, tax: '5%', amount: 18900 }, // Custom item
      { id: 3, name: mockItems[5].productName, qty: 50, price: mockItems[5].price, discount: 0, tax: '18%', amount: 7080 },
    ],
    totals: { subtotal: 59000, totalDiscount: 700, taxableAmount: 58300, totalTax: 4290, total: 62590, roundOffValue: 0, balanceDue: 62590 },
    vehicleNumber: "TS07AB1234", transportName: "Speedy Logistics", driverName: "John Doe", mobileNumber: "9876543210",
  },
  {
    globalState: { invoiceNo: 'PO-002', date: '2025-11-21', dueDate: '2025-12-21', amountPaid: 50000 },
    supplier: mockSuppliers[3],
    items: [
      { id: 1, name: mockItems[1].productName, qty: 1.5, price: mockItems[1].price, discount: 1500, tax: '18%', amount: 95580 },
      { id: 2, name: 'Steel Beams', qty: 10, price: 4000, discount: 0, tax: '18%', amount: 47200 }, // Custom item
    ],
    totals: { subtotal: 122500, totalDiscount: 1500, taxableAmount: 121000, totalTax: 21780, total: 142780, roundOffValue: 0, balanceDue: 92780 },
    vehicleNumber: "AP09CD5678", transportName: "Reliable Transport", driverName: "Jane Smith", mobileNumber: "8765432109",
  },
  {
    globalState: { invoiceNo: 'PO-003', date: '2025-11-22', dueDate: '2025-12-22', amountPaid: 0 },
    supplier: mockSuppliers[1],
    items: [
      { id: 1, name: mockItems[2].productName, qty: 3000, price: mockItems[2].price, discount: 0, tax: '12%', amount: 40320 },
      { id: 2, name: mockItems[3].productName, qty: 20, price: mockItems[3].price, discount: '5%', tax: '5%', amount: 30896.25 },
    ],
    totals: { subtotal: 67000, totalDiscount: 1550, taxableAmount: 65450, totalTax: 6116.25, total: 71566.25, roundOffValue: 0.25, balanceDue: 71566 },
    vehicleNumber: "MH12PQ1234", transportName: "BuildFast Supplies", driverName: "Chris Green", mobileNumber: "7766554433",
  },
  {
    globalState: { invoiceNo: 'PO-004', date: '2025-11-24', dueDate: '2025-12-24', amountPaid: 100000 },
    supplier: mockSuppliers[2],
    items: [
      { id: 1, name: mockItems[4].productName, qty: 200, price: 850, discount: '10%', tax: '12%', amount: 171360 },
      { id: 2, name: 'Timber', qty: 10, price: 2600, discount: 0, tax: '12%', amount: 29120 }, // Custom item
    ],
    totals: { subtotal: 196000, totalDiscount: 17000, taxableAmount: 179000, totalTax: 21480, total: 200480, roundOffValue: 0, balanceDue: 100480 },
    vehicleNumber: "KA05YZ9012", transportName: "Green Transports", driverName: "Michael Brown", mobileNumber: "5544332211",
  },
];

export interface PurchaseItem {
  id: string;
  name: string;
  purchasedQuantity: number;
  returnedQuantity: number;
  unitPrice: number;
  scaled: boolean;
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  supplierName: string;
  purchaseDate: string;
  items: PurchaseItem[];
}

export const mockPurchaseInvoices: PurchaseInvoice[] = [
  { id: "PI001", invoiceNumber: "INV-2025-001", supplierName: "Construction Supplies Co.", purchaseDate: "2025-10-20", items: [ { id: "ITEM001", name: "Cement Bag", purchasedQuantity: 100, returnedQuantity: 10, unitPrice: 350, scaled: false }, { id: "ITEM002", name: "Gravel", purchasedQuantity: 15, returnedQuantity: 0, unitPrice: 1200, scaled: true }, { id: "ITEM003", name: "PVC Pipe", purchasedQuantity: 50, returnedQuantity: 5, unitPrice: 120, scaled: false }, ], },
  { id: "PI002", invoiceNumber: "INV-2025-002", supplierName: "Metal Fabricators Ltd.", purchaseDate: "2025-10-25", items: [ { id: "ITEM004", name: "Steel Rod (TMT)", purchasedQuantity: 2, returnedQuantity: 0, unitPrice: 55000, scaled: false }, { id: "ITEM005", name: "Steel Beams", purchasedQuantity: 10, returnedQuantity: 0, unitPrice: 4000, scaled: false }, ], },
  { id: "PI003", invoiceNumber: "INV-2025-003", supplierName: "Global Building Materials", purchaseDate: "2025-11-01", items: [ { id: "ITEM006", name: "Red Bricks", purchasedQuantity: 3000, returnedQuantity: 100, unitPrice: 12, scaled: false }, { id: "ITEM007", name: "River Sand", purchasedQuantity: 20, returnedQuantity: 0, unitPrice: 1550, scaled: true }, ], },
];

export const mockEditHistory = [
  {
    id: "edit-1",
    invoiceNo: "SCALE-001",
    date: "2025-10-27",
    field: "Price",
    oldValue: "340",
    newValue: "350",
    user: "Admin",
    type: "scales"
  },
  {
    id: "edit-2",
    invoiceNo: "PO-002",
    date: "2025-11-21",
    field: "Qty",
    oldValue: "45",
    newValue: "50",
    user: "Manager",
    type: "purchase"
  },
];

export const mockEmployees: Employee[] = [
  {
    id: "emp-001",
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 234 567 8900",
    role: "Warehouse Manager",
    department: "Operations",
    salary: 65000,
    joiningDate: "2023-01-15T00:00:00Z",
    status: "active",
    address: "123 Main St, New York, NY 10001",
  },
  {
    id: "emp-002",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    phone: "+1 234 567 8901",
    role: "Inventory Analyst",
    department: "Operations",
    salary: 55000,
    joiningDate: "2023-03-20T00:00:00Z",
    status: "active",
    address: "456 Oak Ave, Brooklyn, NY 11201",
  },
  {
    id: "emp-003",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    phone: "+1 234 567 8902",
    role: "Purchase Officer",
    department: "Procurement",
    salary: 58000,
    joiningDate: "2023-06-10T00:00:00Z",
    status: "active",
    address: "789 Pine Rd, Queens, NY 11354",
  },
  {
    id: "emp-004",
    name: "Sarah Williams",
    email: "sarah.williams@company.com",
    phone: "+1 234 567 8903",
    role: "Sales Manager",
    department: "Sales",
    salary: 72000,
    joiningDate: "2022-11-05T00:00:00Z",
    status: "active",
    address: "321 Elm St, Manhattan, NY 10002",
  },
  {
    id: "emp-005",
    name: "David Brown",
    email: "david.brown@company.com",
    phone: "+1 234 567 8904",
    role: "Stock Clerk",
    department: "Operations",
    salary: 42000,
    joiningDate: "2024-02-14T00:00:00Z",
    status: "active",
    address: "654 Maple Ave, Bronx, NY 10451",
  },
  {
    id: "emp-006",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    phone: "+1 234 567 8905",
    role: "Quality Inspector",
    department: "Quality Assurance",
    salary: 51000,
    joiningDate: "2023-09-01T00:00:00Z",
    status: "active",
    address: "987 Cedar Ln, Staten Island, NY 10301",
  },
];
