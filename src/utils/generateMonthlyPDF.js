import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {getMonthlyBarberPerformance,getMonthlyDetail }from '../api/revenue';
import { formatMoney } from "../components/Admin/RevenueView";
export const generateMonthlyPDF = async (entry, detail, barberShopName, token) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  let yPos = 20;

  // Fetch ALL needed data in parallel
  const [barberPerformance, detailData] = await Promise.all([
    getMonthlyBarberPerformance(token, entry.start).then(d => d.barbers).catch(() => null),
    // Fetch detail if not already loaded
    detail?.data 
      ? Promise.resolve(detail.data)
      : getMonthlyDetail(token, entry.start).catch(() => null)
  ]);

  // Format dates
  const startDate = new Date(entry.start);
  const endDate = new Date(entry.end);
  const startFormatted = startDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const endFormatted = endDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(33, 37, 41);
  doc.text(
    `${barberShopName} Barber Shop`,
    pageWidth / 2,
    yPos,
    { align: "center" }
  );
  
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(108, 117, 125);
  doc.text(
    `Monthly Analysis: ${startFormatted} – ${endFormatted}`,
    pageWidth / 2,
    yPos,
    { align: "center" }
  );

  // Divider line
  yPos += 8;
  doc.setDrawColor(0, 123, 255);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // Financial Summary Section
  yPos += 12;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(33, 37, 41);
  doc.text("Financial Summary", margin, yPos);

  yPos += 8;
  const summaryData = [
    ["Total Revenue", `${formatMoney(entry.totalRevenue)} Birr`],
    ["Barbers Payment", `${formatMoney(entry.barbersPayment)} Birr`],
    ["Running Cost", `${formatMoney(entry.runningCost)} Birr`],
    ["Monthly Expense", `${formatMoney(entry.monthlyExpense)} Birr`],
    ["Gross Profit", `${formatMoney(entry.profit)} Birr`],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [["Metric", "Amount"]],
    body: summaryData,
    theme: "grid",
    headStyles: {
      fillColor: [0, 123, 255],
      textColor: 255,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 11,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 80 },
      1: { halign: "left", cellWidth: 70 },
    },
    margin: { left: margin },
  });

  yPos = doc.lastAutoTable.finalY + 12;

  // Services Breakdown Section
  if (detailData?.services?.length > 0) {
    if (yPos > 230) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 37, 41);
    doc.text("Services Breakdown", margin, yPos);

    yPos += 8;
    const servicesData = detailData.services.map((s) => [
      s.name,
      `${s.count} services`,
      `${formatMoney(s.price)} Birr`,
      `${formatMoney(s.total)} Birr`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Service", "Count", "Price", "Total"]],
      body: servicesData,
      theme: "striped",
      headStyles: {
        fillColor: [40, 167, 69],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { halign: "left", cellWidth: 35 },
        2: { halign: "left", cellWidth: 40 },
        3: { halign: "left", cellWidth: 40 },
      },
      margin: { left: margin },
    });

    yPos = doc.lastAutoTable.finalY + 12;
  }

  // Barber Performance Section
  if (barberPerformance?.length > 0) {
    if (yPos > 210) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 37, 41);
    doc.text("Barber Performance", margin, yPos);

    yPos += 8;
    const barberData = barberPerformance.map((b) => [
      b.barberName,
      `${b.serviceCount} services`,
      `${formatMoney(b.totalRevenue)} Birr`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Barber", "Services Done", "Revenue Generated"]],
      body: barberData,
      theme: "striped",
      headStyles: {
        fillColor: [255, 193, 7],
        textColor: 33,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { halign: "left", cellWidth: 45 },
        2: { halign: "left", cellWidth: 45 },
      },
      margin: { left: margin },
    });

    yPos = doc.lastAutoTable.finalY + 12;
  }

  // Running Costs Section
  if (detailData?.runningCosts?.length > 0) {
    if (yPos > 210) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(33, 37, 41);
    doc.text("Running Costs Breakdown", margin, yPos);

    yPos += 8;
    const costsData = detailData.runningCosts.map((c) => [
      c.name,
      `${c.count} entries`,
      `${formatMoney(c.total)} Birr`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Cost Item", "Occurrences", "Total Amount"]],
      body: costsData,
      theme: "striped",
      headStyles: {
        fillColor: [220, 53, 69],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { halign: "left", cellWidth: 40 },
        2: { halign: "left", cellWidth: 40 },
      },
      margin: { left: margin },
    });

    yPos = doc.lastAutoTable.finalY + 15;
  }

  // N.B Section for ongoing months
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthEnd = new Date(endDate);
  
  if (today <= monthEnd) {
    const daysInMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    ).getDate();
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const daysLeft = daysInMonth - daysPassed;

    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setDrawColor(255, 193, 7);
    doc.setFillColor(255, 248, 220);
    doc.roundedRect(margin, yPos, pageWidth - margin * 2, 35, 3, 3, "FD");
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(133, 100, 4);
    doc.text(" IMPORTANT NOTE:", margin + 5, yPos + 10);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      `This month is not finished — we have ${daysLeft} day${daysLeft !== 1 ? "s" : ""} left.`,
      margin + 5,
      yPos + 18
    );
    doc.text(
      `This analysis covers ${daysPassed} day${daysPassed !== 1 ? "s" : ""} of the month.`,
      margin + 5,
      yPos + 26
    );
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated on ${new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
      margin,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin,
      doc.internal.pageSize.height - 10,
      { align: "right" }
    );
  }

  // Download
  const fileName = `${barberShopName.replace(/\s+/g, "_")}_Monthly_Analysis_${startDate.getFullYear()}_${(startDate.getMonth() + 1).toString().padStart(2, "0")}.pdf`;
  doc.save(fileName);
};