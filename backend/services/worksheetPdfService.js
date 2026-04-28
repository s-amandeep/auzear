// services/worksheetPdfService.js
const { PDFDocument, StandardFonts } = require("pdf-lib");

function wrapText(text, maxWidth, font, fontSize) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? currentLine + " " + word : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width < maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) lines.push(currentLine);

  return lines;
}

async function createWorksheetPDF(data) {
  const { topic, classLevel, questions, answers } = data;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 750;

  // const draw = (text, size = 12) => {
  //   page.drawText(text, { x: 50, y, size, font });
  //   y -= 18;
  // };
  const drawWrappedText = (text, fontSize = 12) => {
    // const maxWidth = 500; // adjust based on page width
    const maxWidth = page.getWidth() - 100;

    const lines = wrapText(text, maxWidth, font, fontSize);

    lines.forEach((line) => {
      if (y < 50) {
        // 🔥 new page if needed
        page = pdfDoc.addPage();
        y = 750;
      }

      page.drawText(line, { x: 50, y, size: fontSize, font });
      y -= fontSize + 4;
    });

    y -= 4; // spacing between blocks
  };

  // Header
  drawWrappedText("Auzear Learning", 18);
  drawWrappedText(`Topic: ${topic} | Class: ${classLevel}`, 12);
  y -= 10;

  drawWrappedText(answers.length ? "Worksheet + Answers" : "Worksheet", 12);
  // Questions
  drawWrappedText("Questions:", 14);

  questions.forEach((q, i) => {
    drawWrappedText(`${i + 1}. ${q}`);
    y -= 6;
  });

  y -= 20;

  drawWrappedText("Answers:", 14);

  if (answers && answers.length > 0) {
    y -= 20;
    drawWrappedText("Answers:", 14);

    answers.forEach((a, i) => {
      drawWrappedText(`${i + 1}. ${a}`);
    });
  }

  const pdfBytes = await pdfDoc.save();

  // return pdfBytes;
  return Buffer.from(pdfBytes);
}

module.exports = { createWorksheetPDF };
