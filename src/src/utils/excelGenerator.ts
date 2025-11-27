import * as XLSX from 'xlsx';

/**
 * Generates an Excel file from headers and data.
 * @param headers - An array of strings for the table headers.
 * @param data - An array of arrays, where each inner array represents a row.
 * @param fileName - The name of the file to be downloaded.
 */
export const generateExcel = (headers: string[], data: any[][], fileName: string): void => {
  const worksheetData = [headers, ...data];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  XLSX.writeFile(workbook, fileName);
};