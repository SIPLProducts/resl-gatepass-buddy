import jsPDF from 'jspdf';

export function generateProductFeaturesPDF() {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const addPageIfNeeded = (needed: number) => {
    if (y + needed > 270) {
      doc.addPage();
      y = 20;
    }
  };

  const addTitle = (text: string, size: number = 18) => {
    addPageIfNeeded(20);
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 60, 120);
    doc.text(text, margin, y);
    y += size * 0.6;
  };

  const addSubTitle = (text: string) => {
    addPageIfNeeded(15);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text(text, margin, y);
    y += 7;
  };

  const addBody = (text: string) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(text, contentWidth);
    addPageIfNeeded(lines.length * 5 + 4);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 4;
  };

  const addBullet = (text: string) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(text, contentWidth - 8);
    addPageIfNeeded(lines.length * 5 + 2);
    doc.text('•', margin + 2, y);
    doc.text(lines, margin + 8, y);
    y += lines.length * 5 + 2;
  };

  const addSeparator = () => {
    y += 3;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;
  };

  // ===== COVER HEADER =====
  doc.setFillColor(20, 60, 120);
  doc.rect(0, 0, pageWidth, 50, 'F');
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('RESL Gate Entry Management System', margin, 25);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Product Features & Functionalities Guide', margin, 35);
  doc.setFontSize(9);
  doc.text(`Version 1.0  |  Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, margin, 44);
  y = 60;

  // ===== 1. PRODUCT OVERVIEW =====
  addTitle('1. Product Overview');
  addBody('The RESL Gate Entry Management System is an enterprise-grade, SAP-integrated web application designed to digitize and streamline the entire gate entry process for manufacturing plants and warehouses. It provides real-time material tracking, automated workflows, and seamless integration with SAP ECC/S4HANA for end-to-end visibility.');
  addSeparator();

  // ===== 2. SAP INTEGRATION =====
  addTitle('2. SAP Integration (Real-Time)');
  addBody('The system integrates with SAP ECC / S4HANA in real-time via RFC/BAPI calls through a middleware layer. SAP is the system of record for all gate entry data.');
  y += 2;
  addSubTitle('2.1 Real-Time Data Sync');
  addBullet('Purchase Order (PO) data fetched live from SAP — PO quantities, balance quantities, vendor details, material master');
  addBullet('Gate entry postings are sent back to SAP in real-time for MIGO / GR processing');
  addBullet('Vendor master data, material master data, and plant data are all sourced from SAP');
  addBullet('Subcontracting PO details fetched on-demand with live balance tracking');
  y += 2;
  addSubTitle('2.2 SAP Transaction Mapping');
  addBullet('Inward with PO Reference → SAP MIGO (Goods Receipt against PO)');
  addBullet('Outward with Billing Reference → SAP Delivery / Billing document reference');
  addBullet('Subcontracting → SAP Subcontracting PO (ME2O) integration');
  addBullet('Material master validation against SAP MM module');
  y += 2;
  addSubTitle('2.3 API Architecture');
  addBullet('RESTful API middleware connecting frontend to SAP RFC/BAPI');
  addBullet('Secure authentication and session management');
  addBullet('Error handling with SAP return messages displayed to users');
  addBullet('Retry mechanism for network failures');
  addSeparator();

  // ===== 3. INWARD GATE ENTRY =====
  addTitle('3. Inward Gate Entry');
  addSubTitle('3.1 With PO Reference');
  addBullet('Enter Purchase Order number to auto-fetch PO details from SAP');
  addBullet('Vendor name, material details, PO quantity, and balance quantity auto-populated');
  addBullet('Gate entry quantity validation against PO balance');
  addBullet('Supports multiple line items per gate entry');
  addBullet('Vehicle details, transporter, invoice/challan capture');
  y += 2;
  addSubTitle('3.2 Without Reference');
  addBullet('Manual entry for materials arriving without a Purchase Order');
  addBullet('Plant and storage location selection');
  addBullet('Free-text material description and quantity entry');
  addBullet('Used for samples, trial materials, returnable items');
  y += 2;
  addSubTitle('3.3 Subcontracting');
  addBullet('Dual mode: PO-based (auto-fetch from SAP subcontracting PO) and Manual mode');
  addBullet('PO mode: Fetches vendor, material, and balance data from SAP ME2O');
  addBullet('"PO Mode Active" indicator when PO data is loaded');
  addBullet('Manual mode: Full flexibility for non-PO subcontracting receipts');
  addBullet('Packing condition tracking (Good / Bad / N/A)');
  addSeparator();

  // ===== 4. OUTWARD GATE ENTRY =====
  addTitle('4. Outward Gate Entry');
  addSubTitle('4.1 With Billing Reference');
  addBullet('Outward dispatch linked to SAP billing/delivery documents');
  addBullet('Auto-fetch delivery details from SAP');
  addBullet('Vehicle and transporter tracking for dispatches');
  y += 2;
  addSubTitle('4.2 Returnable Gate Pass (RGP)');
  addBullet('For materials sent out temporarily (repair, testing, calibration)');
  addBullet('Expected return date tracking');
  addBullet('Linked to original inward entry for traceability');
  y += 2;
  addSubTitle('4.3 Non-Returnable Gate Pass (NRGP)');
  addBullet('For permanent outward movement (scrap, sales, disposals)');
  addBullet('No return expected — one-way gate pass');
  addBullet('Approval workflow support');
  addSeparator();

  // ===== 5. CHANGE / MODIFY =====
  addTitle('5. Change / Modify Entry');
  addBullet('Modify existing gate entries by entering Gate Entry Number');
  addBullet('Editable fields based on entry status — some fields locked after processing');
  addBullet('Audit trail maintained for all modifications');
  addBullet('Changes synced back to SAP in real-time');
  addSeparator();

  // ===== 6. CANCEL =====
  addTitle('6. Cancel Entry');
  addBullet('Cancel gate entries that haven\'t been further processed in SAP');
  addBullet('Mandatory cancellation reason / remarks');
  addBullet('Cancellation reflected in SAP immediately');
  addBullet('Cancelled entries retained for audit purposes');
  addSeparator();

  // ===== 7. DISPLAY =====
  addTitle('7. Display Entry');
  addBullet('View complete gate entry details in read-only mode');
  addBullet('Full header and item-level information display');
  addBullet('Status tracking and history');
  addSeparator();

  // ===== 8. PRINT =====
  addTitle('8. Print Gate Pass');
  addBullet('Generate printable gate pass documents (PDF format)');
  addBullet('Gate pass fetched from SAP with all relevant details');
  addBullet('Barcode / QR code support for quick scanning at gate');
  addBullet('Multiple print format support');
  addSeparator();

  // ===== 9. VEHICLE EXIT =====
  addTitle('9. Vehicle Exit Management');
  addBullet('Track vehicle exit against gate entry');
  addBullet('Exit timestamp recording');
  addBullet('Validation that all materials are accounted for before exit');
  addSeparator();

  // ===== 10. REPORTS =====
  addTitle('10. Reports & Analytics');
  addBullet('Comprehensive reporting module with multiple report types');
  addBullet('Date range filters, plant filters, material filters');
  addBullet('Export to Excel (CSV) for offline analysis');
  addBullet('Real-time data from SAP — always up-to-date');
  addBullet('Dashboard with key metrics: today\'s entries, pending exits, monthly trends');
  addSeparator();

  // ===== 11. DASHBOARD =====
  addTitle('11. Dashboard');
  addBullet('Real-time overview of gate entry operations');
  addBullet('Key statistics: Total entries, pending vehicle exits, today\'s inward/outward count');
  addBullet('Quick access cards to all modules');
  addBullet('Recent activity feed');
  addBullet('Chromecast / TV casting support for gate monitoring displays');
  addSeparator();

  // ===== 12. USER MANAGEMENT =====
  addTitle('12. User Management & Security');
  addBullet('Role-based access control');
  addBullet('User authentication with secure login');
  addBullet('Plant-level access restriction');
  addBullet('Session management and auto-logout');
  addBullet('User profile management');
  addSeparator();

  // ===== 13. TV/CAST =====
  addTitle('13. TV Display & Casting');
  addBullet('Chromecast / Android TV casting support via Google Cast SDK');
  addBullet('Fullscreen window mode for dedicated gate monitors');
  addBullet('Screen sharing capability for presentations');
  addBullet('Real-time data refresh on TV displays');
  addSeparator();

  // ===== 14. TECHNICAL =====
  addTitle('14. Technical Specifications');
  addBullet('Frontend: React.js with TypeScript, Tailwind CSS, shadcn/ui components');
  addBullet('Backend Integration: RESTful APIs to SAP ECC/S4HANA via Node.js middleware');
  addBullet('Database: Cloud-hosted for session/config data; SAP as primary data store');
  addBullet('Authentication: Secure token-based authentication');
  addBullet('Responsive: Works on desktop, tablet, and mobile devices');
  addBullet('Browser Support: Chrome, Edge, Firefox, Safari');
  addBullet('Deployment: Cloud-hosted with CI/CD pipeline');

  // ===== FOOTER ON EACH PAGE =====
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(`RESL Gate Entry System — Product Features & Functionalities  |  Page ${i} of ${pageCount}`, margin, 290);
    doc.text('© RESL / Sharvi Infotech — Confidential', pageWidth - margin - 55, 290);
  }

  doc.save('RESL_Gate_Entry_System_Features.pdf');
}
