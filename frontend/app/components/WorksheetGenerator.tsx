"use client";

import { useState } from "react";
import { generateWorksheet } from "@/lib/api";
const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

type Props = {
  topic: string;
  classLevel: string;
  teachingMode: "foundational" | "intermediate" | "advanced";
  understandingScore: number;
};

export default function WorksheetGenerator({
  topic,
  classLevel,
  teachingMode,
  understandingScore,
}: Props) {
  const [count, setCount] = useState(5);
  const [showAnswers, setShowAnswers] = useState(true);
  const [style, setStyle] = useState<
    "basic" | "mixed" | "thinking" | "creative"
  >("mixed");

  const [loading, setLoading] = useState(false);
  const [worksheet, setWorksheet] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);

    const res = await generateWorksheet({
      topic,
      classLevel,
      teaching_mode: teachingMode,
      understanding_score: understandingScore,
      count,
      style,
    });

    if (!res?.error) {
      setWorksheet(res);
    }

    setLoading(false);
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await fetch(`${API_URL}/api/worksheet/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY as string,
        },
        body: JSON.stringify({
          topic,
          classLevel,
          questions: worksheet.questions,
          answers: showAnswers ? worksheet.answers : [],
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch PDF");

      const blob = await res.blob();
      console.log(blob.type);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      // a.download = "worksheet.pdf";
      a.download = `${topic}-worksheet.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download error:", err);
    }
  };

  const handlePrint = () => {
  if (!worksheet) return;

  const printWindow = window.open("", "_blank");

  if (!printWindow) return;

  const html = `
    <html>
      <head>
        <title>Worksheet</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #000;
          }

          h1 {
            text-align: center;
          }

          .section {
            margin-top: 20px;
          }

          .question {
            margin-bottom: 8px;
          }
        </style>
      </head>

      <body>

        <h1>Auzear Learning</h1>

        <p style="text-align:center;">
          Topic: ${topic} | Class: ${classLevel}
        </p>

        <div class="section">
          <h3>Questions</h3>
          ${worksheet.questions
            .map((q: string, i: number) => {
              return `<p class="question">${i + 1}. ${q}</p>`;
            })
            .join("")}
        </div>

        ${
          showAnswers
            ? `
        <div class="section">
          <h3>Answer Sheet</h3>
          ${worksheet.answers
            .map((a: string, i: number) => {
              return `<p class="question">${i + 1}. ${a}</p>`;
            })
            .join("")}
        </div>
        `
            : ""
        }

      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
};

  return (
    <div className="w-full max-w-lg mt-6">
      {/* Config Panel */}
      <p className="text-lg font-small text-center">Worksheet</p>
      <div className="bg-white p-4 rounded-2xl shadow space-y-4">
        <p className="text-sm text-gray-600">
          Tailored to your child’s current level
        </p>

        {/* Question Count */}
        <div>
          <p className="text-sm font-medium mb-1">Number of Questions</p>
          <div className="flex gap-2">
            {[3, 5, 8, 10].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`px-3 py-1 rounded-lg text-sm border ${
                  count === n ? "bg-black text-white" : "bg-white text-gray-700"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div>
          <p className="text-sm font-medium mb-1">Practice Style</p>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "basic", label: "Basic" },
              { key: "mixed", label: "Mixed" },
              { key: "thinking", label: "Thinking" },
              { key: "creative", label: "Creative" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setStyle(item.key as any)}
                className={`px-3 py-1 rounded-lg text-sm border ${
                  style === item.key
                    ? "bg-black text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-xl mt-2"
        >
          {loading ? "Generating..." : "Generate Worksheet"}
        </button>
      </div>

      {/* Output */}
      {worksheet && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              checked={showAnswers}
              onChange={() => setShowAnswers(!showAnswers)}
            />
            <label className="text-sm text-gray-700">Show Answers</label>
          </div>
          {/* PRINT BUTTON */}
          <button
            onClick={handlePrint}
            // onClick={() => window.print()}
            className="bg-gray-800 text-white px-4 py-2 rounded-xl"
          >
            Print Worksheet
          </button>

          <button
            onClick={handleDownloadPDF}
            className="bg-black text-white px-4 py-2 rounded-xl mt-2"
          >
            Download PDF
          </button>
        </div>
      )}

      {/* 🔥 PRINT-ONLY CLEAN LAYOUT */}
      <div className="print-only">
        {worksheet && (
          <div className="p-6 text-black">
            <h1 className="text-xl font-bold text-center mb-2">
              Auzear Learning
            </h1>

            <p className="text-center text-sm mb-4">
              Topic: {topic} | Class: {classLevel}
            </p>

            <h2 className="font-semibold mb-2">Questions</h2>
            {worksheet.questions.map((q: string, i: number) => (
              <p key={i} className="mb-2">
                {i + 1}. {q}
              </p>
            ))}

            {showAnswers && (
              <>
                <h2 className="font-semibold mt-6 mb-2">Answer Sheet</h2>
                {worksheet.answers.map((a: string, i: number) => (
                  <p key={i} className="mb-1">
                    {i + 1}. {a}
                  </p>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
