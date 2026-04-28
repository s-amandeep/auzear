// services/worksheetPdfService.js
const { PDFDocument, StandardFonts } = require("pdf-lib");

async function createWorksheetPDF(data) {
  const { topic, classLevel, questions, answers } = data;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 750;

  const draw = (text, size = 12) => {
    page.drawText(text, { x: 50, y, size, font });
    y -= 18;
  };

  // Header
  draw("Auzear Learning", 18);
  draw(`Topic: ${topic} | Class: ${classLevel}`, 12);
  y -= 10;

  draw(answers.length ? "Worksheet + Answers" : "Worksheet", 12);
  // Questions
  draw("Questions:", 14);

  questions.forEach((q, i) => {
    draw(`${i + 1}. ${q}`);
  });

  y -= 20;

  draw("Answers:", 14);

  if (answers && answers.length > 0) {
    y -= 20;
    draw("Answers:", 14);

    answers.forEach((a, i) => {
      draw(`${i + 1}. ${a}`);
    });
  }

  const pdfBytes = await pdfDoc.save();

  // return pdfBytes;
  return Buffer.from(pdfBytes);
}

module.exports = { createWorksheetPDF };
