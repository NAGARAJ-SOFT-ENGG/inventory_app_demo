import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a PDF document from a table of data.
 * @param title - The title of the document.
 * @param headers - An array of strings for the table headers.
 * @param data - An array of arrays, where each inner array is a row.
 * @param fileName - The name of the file to be downloaded.
 */
export const generatePDF = (title: string, headers: string[], data: any[][], fileName: string): void => {
  const doc = new jsPDF();

  // Set document title
  doc.setFontSize(18);
  doc.text(title, 14, 22);

  // Add table
  autoTable(doc, {
    head: [headers], 
    body: data,
    startY: 30,
  });

  doc.save(fileName);
};