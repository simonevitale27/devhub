import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to load image
const loadImage = (src: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        resolve('');
      }
    };
    img.onerror = () => {
        console.warn('Could not load logo for PDF');
        resolve('');
    };
  });
};

export const generateUnifiedPDF = async (
  data: any[],
  filename: string,
  appName = 'DevHub Export'
) => {
  if (!data || data.length === 0) return;

  // Determine orientation based on columns
  const numColumns = Object.keys(data[0]).length;
  const orientation = numColumns > 6 ? 'landscape' : 'portrait';

  const doc = new jsPDF({ orientation });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- DESIGN CONFIG ---
  // Typed as tuple for autoTable compatibility
  const colors = {
      primary: [59, 130, 246] as [number, number, number], // Blue 500
      darkBg: [15, 23, 42],    // Slate 900
      textLight: [248, 250, 252], // Slate 50
      textDark: [51, 65, 85],     // Slate 700
      textMuted: [148, 163, 184], // Slate 400
      cardBg: [248, 250, 252],    // Slate 50
      cardBorder: [226, 232, 240] // Slate 200
  };

  // --- HEADER SECTION (Banner) ---
  doc.setFillColor(colors.darkBg[0], colors.darkBg[1], colors.darkBg[2]);
  doc.rect(0, 0, pageWidth, 50, 'F');

  // Load Logo
  try {
     const logoData = await loadImage('/logo192.png');
     if (logoData) {
         doc.addImage(logoData, 'PNG', 20, 10, 30, 30);
     }
  } catch (e) {
     // Ignore logo error
  }

  // Title: DEV HUB
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  
  doc.setTextColor(255, 255, 255);
  doc.text('DEV', 60, 25);
  
  const devWidth = doc.getTextWidth('DEV');
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text('HUB', 60 + devWidth + 2, 25);

  // Subtitle / App Name
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
  doc.text(appName.toUpperCase(), 60, 38);

  // Metadata (Right aligned)
  const now = new Date();
  const dateStr = now.toLocaleDateString('it-IT', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
  });
  const timeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  
  doc.setFontSize(10);
  // Manual alignment
  doc.text(dateStr, pageWidth - 20, 22, { align: 'right' });
  doc.text(timeStr, pageWidth - 20, 34, { align: 'right' });

  let yPosition = 65;
  
  // --- STATISTICS SECTION (Cards) ---
  if (data.length > 0) {
      const columns = Object.keys(data[0]);
      const numericColumns = columns.filter(col => {
          return data.every(row => 
              row[col] === null || row[col] === undefined || !isNaN(Number(row[col]))
          );
      });
      
      if (numericColumns.length > 0) {
          doc.setFontSize(12);
          doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
          doc.setFont('helvetica', 'bold');
          doc.text('STATISTICHE RAPIDE', 20, yPosition);
          
          // Decorative line
          doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          doc.setLineWidth(0.5);
          doc.line(20, yPosition + 4, 70, yPosition + 4);
          
          yPosition += 15;
          
          // Calculate stats for top 4 numeric columns
          const statsData = numericColumns.slice(0, 4).map(col => {
              const values = data
                  .map(row => Number(row[col]))
                  .filter(val => !isNaN(val));
              
              if (values.length === 0) return null;
              
              const sum = values.reduce((a, b) => a + b, 0);
              const avg = sum / values.length;
              const min = Math.min(...values);
              const max = Math.max(...values);
              
              return {
                  col,
                  avg: avg.toLocaleString('it-IT', { maximumFractionDigits: 2 }),
                  min: min.toLocaleString('it-IT'),
                  max: max.toLocaleString('it-IT'),
                  sum: sum.toLocaleString('it-IT', { maximumFractionDigits: 2 })
              };
          }).filter(Boolean);
          
          // Draw Cards
          if (statsData.length > 0) {
              const cardWidth = 85;
              const cardHeight = 40;
              const gap = 15;
              
              statsData.forEach((stat, index) => {
                  if (stat) {
                      const colIndex = index % 2;
                      const rowIndex = Math.floor(index / 2);
                      const xPos = 20 + (colIndex * (cardWidth + gap));
                      const yPos = yPosition + (rowIndex * (cardHeight + gap));
                      
                      // Card Background
                      doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
                      doc.setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
                      doc.roundedRect(xPos, yPos, cardWidth, cardHeight, 3, 3, 'FD');
                      
                      // Accent Border (Left)
                      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                      doc.rect(xPos, yPos, 4, cardHeight - 0.2, 'F'); 
                      
                      // Content
                      const contentX = xPos + 12;
                      
                      // Label
                      doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
                      doc.setFontSize(8);
                      doc.setFont('helvetica', 'bold');
                      doc.text(stat.col.toUpperCase(), contentX, yPos + 10);
                      
                      // Big Average
                      doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
                      doc.setFontSize(14);
                      doc.text(stat.avg, contentX, yPos + 24);
                      
                      doc.setFontSize(7);
                      doc.setFont('helvetica', 'normal');
                      doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
                      doc.text('MEDIA', contentX, yPos + 32);

                      // Detailed Stats (Right)
                      const rightX = xPos + cardWidth - 8;
                      
                      doc.text(`Min: ${stat.min}`, rightX, yPos + 14, { align: 'right' });
                      doc.text(`Max: ${stat.max}`, rightX, yPos + 22, { align: 'right' });
                      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                      doc.text(`Tot: ${stat.sum}`, rightX, yPos + 32, { align: 'right' });
                  }
              });
              
              yPosition += Math.ceil(statsData.length / 2) * (cardHeight + gap) + 20;
          }
      }
  }

  // --- TABLE SECTION ---
  doc.setFontSize(12);
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('DATI', 20, yPosition);
  
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setLineWidth(0.5);
  doc.line(20, yPosition + 4, 35, yPosition + 4);
  
  yPosition += 10;
  
  const headers = Object.keys(data[0]);
  const tableData = data.map((row: any) => Object.values(row));

  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: yPosition,
    theme: 'grid',
    styles: { 
        fontSize: 8,
        cellPadding: 4,
        overflow: 'linebreak',
        lineColor: [226, 232, 240], // Slate 200
        textColor: [51, 65, 85]     // Slate 700
    },
    headStyles: { 
        fillColor: colors.primary,
        textColor: 255,
        fontStyle: 'bold',
        lineWidth: 0
    },
    alternateRowStyles: {
        fillColor: [248, 250, 252] // Slate 50
    },
    margin: { top: 60, left: 20, right: 20 },
    didDrawPage: (data: any) => {
        // Footer (Page Numbers)
        const str = 'Pagina ' + (doc as any).internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
        doc.text(str, pageWidth - 20, pageHeight - 10, { align: 'right' });
        doc.text('Generato con DevHub', 20, pageHeight - 10);
    }
  });

  doc.save(filename);
};
