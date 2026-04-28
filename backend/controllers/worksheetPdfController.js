// controllers/worksheetPdfController.js
const { createWorksheetPDF } = require("../services/worksheetPdfService");

async function handleWorksheetPDF(req, res) {
  try {
    const pdfBuffer = await createWorksheetPDF(req.body);

    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader("Content-Disposition", "attachment; filename=worksheet.pdf");
    // res.setHeader("Content-Length", pdfBuffer.length);

    // res.end(pdfBuffer);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=worksheet.pdf",
      "Content-Length": pdfBuffer.length,
    });

    res.send(Buffer.from(pdfBuffer));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "PDF generation failed" });
  }
}

module.exports = { handleWorksheetPDF };
