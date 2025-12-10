import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, BarChart2, DollarSign, Scale, Download, File, Filter, Calendar, Hash } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { generatePDF } from '../utils/pdfGenerator';
import { generateExcel } from '../utils/excelGenerator';

// Import mock data from various sources
import { mockPOItems, mockScalesItems, mockEditHistory } from '../data/mockData';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('scales');
  const [summaryType, setSummaryType] = useState('detailed');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    invoiceNo: '',
  });
  const [reportData, setReportData] = useState<any[]>([]);
  const [reportHeaders, setReportHeaders] = useState<string[]>([]);

  const handleGenerateReport = () => {
    let data = [];
    let headers: string[] = [];

    // 1. Select Data Source
    if (reportType === 'scales') {
      data = mockScalesItems;
      headers = ["Date", "Invoice #", "Supplier", "Item Name", "Qty", "Price", "Amount", "Vehicle No."];
    } else if (reportType === 'purchase') {
      data = mockPOItems;
      headers = ["Date", "Invoice #", "Supplier", "Item Name", "Qty", "Price", "Amount", "Vehicle No."];
    } else if (reportType === 'editHistory') {
      // Mock edit history data for demonstration
      data = mockEditHistory;
      headers = ["Date", "Invoice #", "Field Changed", "Old Value", "New Value", "Changed By"];
    }

    // 2. Apply Filters
    let filteredData = data.filter(item => {
      const itemDate = new Date(item.globalState?.date || item.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null; 
      const endDate = filters.endDate ? new Date(filters.endDate) : null; 

      // Adjust endDate to be the end of the selected day to include all items on that day
      if (endDate) {
        endDate.setHours(23, 59, 59, 999);
      }

      if (startDate && itemDate < startDate) return false;
      if (endDate && itemDate > endDate) return false;
      if (filters.invoiceNo && (item.globalState?.invoiceNo || item.invoiceNo) && !(item.globalState?.invoiceNo || item.invoiceNo).toLowerCase().includes(filters.invoiceNo.toLowerCase())) return false;
      
      return true;
    });

    // 3. Apply Summarization (structure for future implementation)
    if (summaryType === 'item') {
      // TODO: Implement item-wise summary logic
      // Example: Group by `productName` and sum `qty` and `price`
    } else if (summaryType === 'party') {
      // TODO: Implement party-wise summary logic
      // Example: Group by `supplierName` and sum totals
    }

    // 4. Format data for display and export
    let formattedData: any[][] = [];
    if (reportType === 'scales' || reportType === 'purchase') {
      filteredData.forEach(invoice => {
        invoice.items.forEach((lineItem: any) => {
          formattedData.push([
            invoice.globalState.date,
            invoice.globalState.invoiceNo,
            invoice.supplier.name,
            lineItem.name,
            lineItem.qty,
            `₹${lineItem.price.toFixed(2)}`,
            `₹${lineItem.amount.toFixed(2)}`,
            invoice.vehicleNumber,
          ]);
        });
      });
    } else if (reportType === 'editHistory') {
      formattedData = filteredData.map(item => [item.date, item.invoiceNo, item.field, item.oldValue, item.newValue, item.user]);
    }

    setReportHeaders(headers);
    setReportData(formattedData);
  };

  const handleExportPDF = () => {
    if (reportData.length === 0) return;
    const title = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;
    generatePDF(title, reportHeaders, reportData, `${reportType}-report.pdf`);
  };

  const handleExportExcel = () => {
    if (reportData.length === 0) return;
    generateExcel(reportHeaders, reportData, `${reportType}-report.xlsx`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Reports Center</h2>
        <p className="text-gray-600">Generate and download system reports.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="scales">Scales Report</SelectItem>
                <SelectItem value="purchase">Purchase Report</SelectItem>
                <SelectItem value="editHistory">Edit History Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Summary Type</Label>
            <Select value={summaryType} onValueChange={setSummaryType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="detailed">Detailed View</SelectItem>
                <SelectItem value="item">Item-wise Summary</SelectItem>
                <SelectItem value="party">Party-wise Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceNo">Invoice Number</Label>
            <Input id="invoiceNo" placeholder="Filter by Invoice #" value={filters.invoiceNo} onChange={e => setFilters({...filters, invoiceNo: e.target.value})} />
          </div>
        </div>
        <div className="flex justify-end gap-3">
            <Button onClick={handleGenerateReport} variant="gradient">
                <Filter className="w-4 h-4 mr-2" /> Generate Report
            </Button>
        </div>
      </div>

      {/* Report Preview Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 flex justify-between items-center">
            <h3 className="text-lg text-gray-900">Report Preview</h3>
            <div className="flex gap-2">
                <Button onClick={handleExportExcel} variant="outline" disabled={reportData.length === 0}>
                    <File className="w-4 h-4 mr-2" /> Export to Excel
                </Button>
                <Button onClick={handleExportPDF} variant="outline" disabled={reportData.length === 0}>
                    <Download className="w-4 h-4 mr-2" /> Export to PDF
                </Button>
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {reportHeaders.map(header => <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>)}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.length > 0 ? reportData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell: any, cellIndex: number) => <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cell}</td>)}
                </tr>
              )) : (
                <tr>
                  <td colSpan={reportHeaders.length || 1} className="text-center py-10 text-gray-500">
                    Generate a report to see the data here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};