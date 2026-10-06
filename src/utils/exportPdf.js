import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPdf = ({ columns, rows, title, subtitle, filename }) => {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(16);
  doc.text(title, 14, 16);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(subtitle, 14, 23);

  autoTable(doc, {
    startY: 28,
    head: [columns.map((c) => c.label)],
    body: rows.map((row) =>
      columns.map((c) => {
        const val = row[c.key];
        return typeof val === "number" ? val.toLocaleString() : val ?? "";
      })
    ),
    headStyles: { fillColor: [22, 101, 52] },
    styles: { fontSize: 9 },
  });

  doc.save(filename);
};