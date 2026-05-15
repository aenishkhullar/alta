import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateClientPDF = async (elementId, clientName) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#f8f9fb',
    logging: false,
    windowWidth: 794,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: 'a4',
    hotfixes: ['px_scaling']
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  const pageHeight = pdf.internal.pageSize.getHeight();
  let heightLeft = pdfHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;
  }

  const fileName = `AltaWebStudio_Report_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
