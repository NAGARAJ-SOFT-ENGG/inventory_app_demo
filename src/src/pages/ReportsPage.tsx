import React from 'react';
import { motion } from 'framer-motion';
import { FileText, BarChart2, DollarSign, Scale, Download } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { generatePDF } from '../utils/pdfGenerator';

// Import mock data from various sources
import { mockPOItems, mockScalesItems, mockInventory, mockPrices } from '../data/mockData';

const ReportCard = ({ icon, title, description, onGenerate }: { icon: React.ElementType, title: string, description: string, onGenerate: () => void }) => {
  const Icon = icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
      <div className="mt-6 flex-grow flex items-end">
        <Button onClick={onGenerate} variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>
    </motion.div>
  );
};

export const ReportsPage: React.FC = () => {

  const generatePOReport = () => {
    const headers = ["Supplier", "Product", "Qty", "Date", "Time", "Vehicle No.", "Driver"];
    const data = mockPOItems.map(item => [
      item.supplierName,
      item.productName,
      item.qty.toString(),
      item.date,
      item.time,
      item.vehicleNumber,
      item.driverName,
    ]);
    generatePDF("Purchase Order Report", headers, data, "po-report.pdf");
  };

  const generateScalesReport = () => {
    const headers = ["Supplier", "Product", "Qty", "Price", "Date", "Time", "Vehicle No."];
    const data = mockScalesItems.map(item => [
      item.supplierName,
      item.productName,
      item.qty.toString(),
      `$${item.price.toFixed(2)}`,
      item.date,
      item.time,
      item.vehicleNumber,
    ]);
    generatePDF("Scales Report", headers, data, "scales-report.pdf");
  };

  const generateStockReport = () => {
    const headers = ["Item", "SKU", "Category", "Quantity", "Price", "Status"];
    const data = mockInventory.map(item => [
      item.name,
      item.sku,
      item.category,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      item.status.replace('-', ' ').toUpperCase(),
    ]);
    generatePDF("Stock Inventory Report", headers, data, "stock-report.pdf");
  };

  const generatePriceReport = () => {
    const headers = ["Unit", "Price"];
    const data = mockPrices.map(item => [
      item.unit.toUpperCase(),
      `$${item.price.toFixed(2)}`,
    ]);
    generatePDF("Price Master Report", headers, data, "price-report.pdf");
  };

  const reports = [
    { icon: FileText, title: "PO Report", description: "Detailed list of all Purchase Orders.", onGenerate: generatePOReport },
    { icon: Scale, title: "Scales Report", description: "Complete log of all scale entries.", onGenerate: generateScalesReport },
    { icon: BarChart2, title: "Stock Report", description: "Current status of all inventory items.", onGenerate: generateStockReport },
    { icon: DollarSign, title: "Price Report", description: "Master list of all pricing units.", onGenerate: generatePriceReport },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Reports Center</h2>
        <p className="text-gray-600">Generate and download system reports as PDF documents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reports.map((report, index) => (
          <ReportCard
            key={index}
            icon={report.icon}
            title={report.title}
            description={report.description}
            onGenerate={report.onGenerate}
          />
        ))}
      </div>
    </div>
  );
};