import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateReport = ({
  filename,
  atsScore,
  semanticScore,
  resumeGrade,
  overallScore,
  predictedRole,
  skills,
  education,
  experience,
  suggestions,
}) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(22);
  doc.setTextColor(25, 118, 210);
  doc.text("TalentLens AI", 20, 20);

  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("AI Resume Analysis Report", 20, 32);

  doc.setLineWidth(0.5);
  doc.line(20, 36, 190, 36);

  // Resume Info
  doc.setFontSize(12);

  doc.text(`Resume File : ${filename}`, 20, 48);
  doc.text(`ATS Score : ${atsScore}%`, 20, 58);
  doc.text(`Semantic Score : ${semanticScore}%`, 20, 68);
  doc.text(`Resume Grade : ${resumeGrade}`, 20, 78);
  doc.text(`Overall Score : ${overallScore}`, 20, 88);
  doc.text(`Predicted Role : ${predictedRole}`, 20, 98);

  // Skills
  autoTable(doc, {
    startY: 110,
    head: [["Detected Skills"]],
    body: skills.map((s) => [s]),
  });

  // Education
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Education"]],
    body: education.map((e) => [e]),
  });

  // Experience
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Experience"]],
    body: experience.map((e) => [e]),
  });

  // Suggestions
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["AI Suggestions"]],
    body: suggestions.map((s) => [s]),
  });

  doc.save("TalentLens_AI_Report.pdf");
};

export default generateReport;
