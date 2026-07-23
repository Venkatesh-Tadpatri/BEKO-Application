/**
 * PDF Report Template Generator
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Import the logo - make sure this path is correct relative to your project structure
import logoReports from './assets/Logo_reports.jpg';

/**
 * Format current date and time
 * @returns {Object} Object with date and time strings
 */
const formatDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  return {
    date: `${day}/${month}/${year}`,
    time: `${displayHours}:${minutes}:${seconds}${ampm}`
  };
};

/**
 * Format date for filename (DDMMYYYY)
 */
const formatDateForFilename = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}${month}${year}`;
};

/**
 * Generate PDF HTML template
 * @param {Object} input - User input parameters
 * @param {Object} result - Calculation results
 * @returns {string} Complete HTML document as string
 */
export const generatePDFTemplate = (input, result) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      
      <title>${(input.customerName || 'Customer')}_${formatDateForFilename()}_Filter_Report</title>

      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        @page {
          size: A4;
          margin: 15mm;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          color: #1e293b;
          background: white;
          font-size: 11px;
          line-height: 1.4;
        }
        
        .page-container {
          width: 100%;
          max-width: 210mm;
          margin: 0 auto;
          border: 2px solid #2563eb;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 3px solid #2563eb;
          gap: 15px;
        }
        
        .header-left {
          flex: 0 0 180px;
          text-align: left;
        }
        
        .report-generated {
          font-size: 11px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 6px;
        }
        
        .date-time-row {
          font-size: 10px;
          color: #475569;
          margin-bottom: 2px;
        }
        
        .date-time-row strong {
          font-weight: 700;
          color: #1e293b;
        }
        
        .header-center {
          flex: 1;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 10px;
        }
        
        .report-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 6px;
          line-height: 1.2;
        }
        
        .report-subtitle {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        
        .customer-info {
          font-size: 13px;
          color: #2563eb;
          font-weight: 700;
          margin-top: 4px;
        }
        
        .header-right {
          flex: 0 0 140px;
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
        }
        
        .logo-img {
          height: 70px;
          width: auto;
          object-fit: contain;
        }
        
        .section {
          margin-bottom: 18px;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 12px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 10px;
          padding-left: 8px;
          border-left: 3px solid #2563eb;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 0;
          font-size: 10px;
        }
        
        th {
          background: #f1f5f9;
          padding: 8px 12px;
          text-align: left;
          font-weight: 600;
          color: #475569;
          border: 1px solid #cbd5e1;
        }
        
        td {
          padding: 7px 12px;
          border: 1px solid #e2e8f0;
          color: #1e293b;
        }
        
        td:first-child {
          font-weight: 500;
          color: #475569;
          width: 50%;
        }
        
        td:last-child {
          font-weight: 600;
          color: #1e293b;
        }
        
        tbody tr:nth-child(even) {
          background: #f8fafc;
        }
        
        .housing-section {
          margin-top: 15px;
          padding: 18px;
          background: linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%);
          border-radius: 8px;
          border: 2px solid #bfdbfe;
          text-align: center;
        }
        
        .housing-label {
          font-size: 11px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        
        .housing-model {
          font-size: 26px;
          font-weight: 800;
          color: #2563eb;
          letter-spacing: 2px;
        }
        
        .notes-section {
          margin-top: 15px;
          padding: 12px 15px;
          background: #fefce8;
          border-left: 3px solid #eab308;
          border-radius: 6px;
        }
        
        .notes-title {
          font-size: 11px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 6px;
        }
        
        .notes-section ul {
          margin-left: 18px;
          color: #475569;
        }
        
        .notes-section li {
          margin-bottom: 4px;
          font-size: 9px;
          line-height: 1.4;
        }
        
        .notes-section li strong {
          color: #1e293b;
          font-weight: 600;
        }
        
        .footer {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 8px;
          color: #94a3b8;
        }
        
        .footer p {
          margin: 2px 0;
        }
        
        @media print {
          body {
            font-size: 10px;
          }
          
          .page-container {
            max-width: 100%;
          }
          
          .section {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="page-container">
        <div class="header">
          <div class="header-left">
            <div class="report-generated"><strong>Report Generated On:</strong></div>
            <div class="date-time-row"><strong>Date:</strong> ${formatDate().date}</div>
            <div class="date-time-row"><strong>Time:</strong> ${formatDate().time}</div>
          </div>
          
          <div class="header-center">
            <div class="report-title">Beko Filter Selection Report</div>
            <div class="report-subtitle">Advanced Filter Sizing Calculator</div>
            ${input.customerName ? `<div class="customer-info"></div>` : ''}
          </div>
          
          <div class="header-right">
            <img src="${logoReports}" alt="BEKO Logo" class="logo-img" />
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">1. Configuration Parameters</div>
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              ${input.customerName ? `
              <tr>
                <td>Customer Name</td>
                <td><strong>${input.customerName}</strong></td>
              </tr>
              ` : ''}
              <tr>
                <td>Type of Filter</td>
                <td>${input.filterType}</td>
              </tr>
              ${input.filterTypeOption ? `
              <tr>
                <td>Filter Type</td>
                <td>${input.filterTypeOption}</td>
              </tr>
              ` : ''}
              ${input.filterScope ? `
              <tr>
                <td>Filter Scope</td>
                <td>${input.filterScope}</td>
              </tr>
              ` : ''}
              <tr>
                <td>Gas Type</td>
                <td>${input.gas}</td>
              </tr>
              <tr>
                <td>Flow Rate</td>
                <td><strong>${input.flow} m³/hr</strong></td>
              </tr>
              <tr>
                <td>Minimum Working Pressure</td>
                <td><strong>${input.minPressure} barg</strong></td>
              </tr>
              ${input.maxPressure ? `
              <tr>
                <td>Maximum Pressure</td>
                <td>${input.maxPressure} barg</td>
              </tr>
              ` : ''}
              <tr>
                <td>Inlet Air Temperature</td>
                <td><strong>${input.temperature} °C</strong></td>
              </tr>
              ${input.endConnection ? `
              <tr>
                <td>End Connection (DN)</td>
                <td>${input.endConnection}</td>
              </tr>
              ` : ''}
              ${input.moc ? `
              <tr>
                <td>MOC of Housing</td>
                <td>${input.moc}</td>
              </tr>
              ` : ''}
              ${input.filterType === "Suction" && input.moistureContent ? `
              <tr>
                <td>Simplex Moisture Content</td>
                <td>${input.moistureContent}</td>
              </tr>
              ` : ''}
              ${input.oilContent ? `
              <tr>
                <td>Inlet Oil Content</td>
                <td>${input.oilContent} ${input.filterType === "Suction" ? "mg/m³" : "ppm"}</td>
              </tr>
              ` : ''}
              ${input.dustContent ? `
              <tr>
                <td>Inlet Dust Content</td>
                <td>${input.dustContent} micron</td>
              </tr>
              ` : ''}
              <tr>
                <td>Outlet Filtration</td>
                <td><strong>${input.DuplexFiltration} micron</strong></td>
              </tr>
              ${input.DuplexOilResidual ? `
              <tr>
                <td>Outlet Oil Residual</td>
                <td>${input.DuplexOilResidual} mg/m³</td>
              </tr>
              ` : ''}
              ${input.filterType === "Discharge" && input.fittings ? `
              <tr>
                <td>Fittings</td>
                <td>${input.fittings}</td>
              </tr>
              ` : ''}
              ${input.filterType === "Discharge" && input.drainType ? `
              <tr>
                <td>Type of Drain</td>
                <td>${input.drainType}</td>
              </tr>
              ` : ''}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <div class="section-title">2. Selected Housing Model</div>
          <div class="housing-section">
            <div class="housing-label">Recommended Housing Model</div>
            <div class="housing-model">${result.housing}</div>
          </div>
        </div>
        
        <div class="notes-section">
          <div class="notes-title">Notes:</div>
          <ul>
            <li><strong>Housing selection</strong> is based on corrected flow capacity and filtration requirements.</li>
            <li>This report is generated using BEKO's internal sizing logic and should be used <strong>for technical evaluation</strong> and reference.</li>
            <li>Please verify all specifications with BEKO technical team before final procurement.</li>
          </ul>
        </div>
        
        <div class="footer">
          <p>This report was generated by BEKO Filter Housing Selection Calculator</p>
          <p>© ${new Date().getFullYear()} BEKO Technologies. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Render the report HTML (the same markup used for View) into a PDF, so the
 * plain-browser download looks identical to the preview instead of a
 * simplified re-creation of it.
 */
const renderHtmlToPdf = async (htmlContent) => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-10000px';
  iframe.style.left = '-10000px';
  iframe.style.width = '210mm';
  iframe.style.height = '297mm';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  try {
    await new Promise((resolve) => {
      iframe.onload = resolve;
      iframe.srcdoc = htmlContent;
    });

    const iframeDoc = iframe.contentDocument;
    if (iframeDoc.fonts && iframeDoc.fonts.ready) {
      await iframeDoc.fonts.ready;
    }
    // Give the @import'ed webfont and logo image a moment to paint
    await new Promise((resolve) => setTimeout(resolve, 500));

    const canvas = await html2canvas(iframeDoc.body, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = (canvas.height * pageWidth) / canvas.width;
    doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pageWidth, pageHeight);
    return doc;
  } finally {
    document.body.removeChild(iframe);
  }
};

/**
 * Generate the report. In Electron this renders the PDF and saves it into
 * the app's Reports folder, returning the saved file path. In a plain
 * browser there is no filesystem to save to, so the HTML is returned for
 * the view/download fallbacks to use instead.
 * @param {Object} input - User input parameters
 * @param {Object} result - Calculation results
 * @returns {Promise<Object>} report data consumed by viewReport/downloadReport
 */
export const generateReport = async (input, result) => {
  const htmlContent = generatePDFTemplate(input, result);
  const customerName = input.customerName || 'Customer';
  const dateStr = formatDateForFilename();
  const filename = `${customerName}_${dateStr}_Filter_Report`;

  if (window.electronAPI) {
    const { success, filePath } = await window.electronAPI.generateReport(htmlContent, filename);
    return { success, filePath, filename, htmlContent };
  }

  return { success: true, filename, htmlContent };
};

/**
 * Open the generated report for viewing.
 * @param {Object} reportData - result of generateReport()
 */
export const viewReport = async (reportData) => {
  if (window.electronAPI && reportData.filePath) {
    return window.electronAPI.viewReport(reportData.filePath);
  }

  // Browser fallback: open the report in a new tab for preview
  const previewWindow = window.open('', '_blank');
  if (!previewWindow) {
    alert('Please allow popups to view the report');
    return;
  }
  previewWindow.document.write(reportData.htmlContent);
  previewWindow.document.close();
};

/**
 * Download the generated report. In Electron the file already lives in the
 * Reports folder (written silently by generateReport) - no save dialog,
 * just reveal it. In a plain browser, render the same report HTML used for
 * View into a PDF and trigger an instant, dialog-free download so both
 * actions produce an identical-looking report.
 * @param {Object} reportData - result of generateReport()
 */
export const downloadReport = async (reportData) => {
  if (window.electronAPI && reportData.filePath) {
    return window.electronAPI.downloadReport(reportData.filePath);
  }

  const doc = await renderHtmlToPdf(reportData.htmlContent);
  doc.save(`${reportData.filename}.pdf`);
};
