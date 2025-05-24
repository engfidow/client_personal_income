import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun } from "docx";

const Report = () => {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const userId = storedUser?.id;
  const { t } = useTranslation();

  const [range, setRange] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params =
        range === "custom"
          ? { from: customFrom, to: customTo }
          : {};

      const actualRange = range === "all" ? "year" : range;

      const res = await axios.get(
        `https://server-personal-income.onrender.com/api/transactions/${userId}/reports/${actualRange}`,
        {
          params,
         
        }
      );

      let filtered = res.data;
      if (typeFilter !== "all") {
        filtered = filtered.filter((tx) => tx.type === typeFilter);
      }

      setTransactions(filtered);
    } catch (err) {
      console.error("Error fetching report:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) fetchReport();
    // eslint-disable-next-line
  }, [range, typeFilter]);

  const handleCustomSearch = () => {
    if (customFrom && customTo) {
      fetchReport();
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [[t("no"), t("amount"), t("type"), t("category"), t("note"), t("date")]],
      body: transactions.map((tx, index) => [
        index + 1,
        tx.amount,
        t(tx.type),
        tx.category,
        tx.note,
        new Date(tx.date).toLocaleDateString(),
      ])
    });
    doc.save("report.pdf");
  };

  const exportExcel = () => {
    const sheetData = [
      [t("no"), t("amount"), t("type"), t("category"), t("note"), t("date")],
      ...transactions.map((tx, index) => [
        index + 1,
        tx.amount,
        t(tx.type),
        tx.category,
        tx.note,
        new Date(tx.date).toLocaleDateString(),
      ])
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "report.xlsx");
  };

  const exportWord = async () => {
    const rows = transactions.map((tx, index) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(String(index + 1))] }),
          new TableCell({ children: [new Paragraph(String(tx.amount))] }),
          new TableCell({ children: [new Paragraph(t(tx.type))] }),
          new TableCell({ children: [new Paragraph(tx.category)] }),
          new TableCell({ children: [new Paragraph(tx.note)] }),
          new TableCell({ children: [new Paragraph(new Date(tx.date).toLocaleDateString())] }),
        ]
      })
    );

    const table = new Table({
      rows: [
        new TableRow({
          children: ["No", "Amount", "Type", "Category", "Note", "Date"].map(
            h => new TableCell({ children: [new Paragraph(h)] })
          )
        }),
        ...rows
      ]
    });

    const doc = new Document({ sections: [{ children: [table] }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "report.docx");
  };

  return (
    <div className="p-4 max-w-6xl mx-auto text-navy-700 dark:text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <div className="flex flex-wrap gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="border px-4 py-2 rounded dark:bg-navy-800 dark:border-white/20"
          >
            <option value="all">{t("all_time")}</option>
            <option value="week">{t("week")}</option>
            <option value="month">{t("month")}</option>
            <option value="year">{t("year")}</option>
            <option value="custom">{t("custom")}</option>
          </select>

          {range === "custom" && (
            <>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="border px-2 py-2 rounded dark:bg-navy-800 dark:border-white/20"
              />
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="border px-2 py-2 rounded dark:bg-navy-800 dark:border-white/20"
              />
              <button
                onClick={handleCustomSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {t("search")}
              </button>
            </>
          )}

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border px-4 py-2 rounded dark:bg-navy-800 dark:border-white/20"
          >
            <option value="all">{t("filter_all")}</option>
            <option value="income">{t("filter_income")}</option>
            <option value="expense">{t("filter_expense")}</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button onClick={exportPDF} className="bg-red-600 text-white px-4 py-2 rounded">
            PDF
          </button>
          <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded">
            Excel
          </button>
          <button onClick={exportWord} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Word
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left border dark:border-white/20">
          <thead className="bg-white dark:bg-navy-800">
            <tr>
              <th className="p-2">No</th>
              <th className="p-2">{t("amount")}</th>
              <th className="p-2">{t("type")}</th>
              <th className="p-2">{t("category")}</th>
              <th className="p-2">{t("note")}</th>
              <th className="p-2">{t("date")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="border-t dark:border-white/10">
                  {Array(6).fill().map((_, j) => (
                    <td key={j} className="p-2"><Skeleton /></td>
                  ))}
                </tr>
              ))
            ) : transactions.length > 0 ? (
              transactions.map((tx, index) => (
                <tr key={tx.id} className="border-t dark:border-white/10 hover:bg-gray-50 dark:hover:bg-navy-800/40">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">${tx.amount}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        tx.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {t(tx.type)}
                    </span>
                  </td>
                  <td className="p-2">{tx.category}</td>
                  <td className="p-2">{tx.note}</td>
                  <td className="p-2">{new Date(tx.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500 dark:text-white/70">
                  {t("no_transactions")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
