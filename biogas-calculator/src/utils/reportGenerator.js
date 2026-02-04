import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const generatePDFReport = (formData, results) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(34, 139, 34);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('Biogas System Calculator', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Calculation Report', 105, 30, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Date and time
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 50);
  
  // Input Parameters
  doc.setFontSize(16);
  doc.setTextColor(34, 139, 34);
  doc.text('Input Parameters', 14, 65);
  
  doc.autoTable({
    startY: 70,
    head: [['Parameter', 'Value']],
    body: [
      ['Feedstock Type', formData.feedstockType || 'N/A'],
      ['Feedstock Quantity', `${formData.feedstockQuantity || 'N/A'} tons/day`],
      ['Organic Content', `${formData.organicContent || 'N/A'} %`],
      ['Operating Temperature', `${formData.operatingTemp || 'N/A'} °C`],
      ['Reactor Type', formData.reactorType || 'N/A'],
      ['Gas Utilization', formData.gasUtilization || 'N/A']
    ],
    theme: 'grid',
    headStyles: { fillColor: [34, 139, 34] }
  });
  
  // Calculation Results
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.setTextColor(34, 139, 34);
  doc.text('Calculation Results', 14, finalY);
  
  doc.autoTable({
    startY: finalY + 5,
    head: [['Metric', 'Value', 'Unit']],
    body: [
      ['Biogas Production', results.biogasProduction, 'm³/day'],
      ['Methane Production', results.methaneProduction, 'm³/day'],
      ['Energy Content', results.energyContent, 'kWh/day'],
      ['Electrical Power Output', results.electricalPower, 'kWh/day'],
      ['Thermal Power Output', results.thermalPower, 'kWh/day'],
      ['CO₂ Emission Reduction', results.co2Reduction, 'kg/day']
    ],
    theme: 'grid',
    headStyles: { fillColor: [34, 139, 34] }
  });
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  return doc;
};

export const savePDFReport = (formData, results) => {
  const doc = generatePDFReport(formData, results);
  const fileName = `Biogas_Report_${new Date().getTime()}.pdf`;
  doc.save(fileName);
};

export const generateExcelReport = (formData, results) => {
  // Input Parameters Sheet
  const inputData = [
    ['Biogas System Calculator - Input Parameters'],
    [''],
    ['Parameter', 'Value'],
    ['Feedstock Type', formData.feedstockType || 'N/A'],
    ['Feedstock Quantity (tons/day)', formData.feedstockQuantity || 'N/A'],
    ['Organic Content (%)', formData.organicContent || 'N/A'],
    ['Moisture Content (%)', formData.moistureContent || 'N/A'],
    ['Operating Temperature (°C)', formData.operatingTemp || 'N/A'],
    ['Operating Pressure (bar)', formData.operatingPressure || 'N/A'],
    ['Retention Time (days)', formData.retentionTime || 'N/A'],
    ['pH Level', formData.pH || 'N/A'],
    ['Reactor Type', formData.reactorType || 'N/A'],
    ['System Capacity (m³)', formData.systemCapacity || 'N/A'],
    ['Gas Utilization', formData.gasUtilization || 'N/A']
  ];
  
  // Results Sheet
  const resultsData = [
    ['Biogas System Calculator - Calculation Results'],
    [''],
    ['Metric', 'Value', 'Unit'],
    ['Biogas Production', results.biogasProduction, 'm³/day'],
    ['Methane Production', results.methaneProduction, 'm³/day'],
    ['Energy Content', results.energyContent, 'kWh/day'],
    ['Electrical Power Output', results.electricalPower, 'kWh/day'],
    ['Thermal Power Output', results.thermalPower, 'kWh/day'],
    ['CO₂ Emission Reduction', results.co2Reduction, 'kg/day'],
    ['Annual CO₂ Reduction', (results.co2Reduction * 365 / 1000).toFixed(2), 'tons/year']
  ];
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.aoa_to_sheet(inputData);
  const ws2 = XLSX.utils.aoa_to_sheet(resultsData);
  
  XLSX.utils.book_append_sheet(wb, ws1, 'Input Parameters');
  XLSX.utils.book_append_sheet(wb, ws2, 'Results');
  
  return wb;
};

export const saveExcelReport = (formData, results) => {
  const wb = generateExcelReport(formData, results);
  const fileName = `Biogas_Report_${new Date().getTime()}.xlsx`;
  XLSX.writeFile(wb, fileName);
};