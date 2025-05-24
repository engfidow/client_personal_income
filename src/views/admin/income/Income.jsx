



import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";

const Income = () => {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const userId = storedUser?.id;
  const { t } = useTranslation();

  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("income");
  const [loadingTable, setLoadingTable] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    type: "income",
    category: "",
    note: "",
    date: "",
  });
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTransactions = async () => {
    setLoadingTable(true);
    try {
      const res = await axios.get(`https://server-personal-income.onrender.com/api/transactions/${userId}`);
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
    setLoadingTable(false);
  };

  useEffect(() => {
    if (userId) fetchTransactions();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.amount) newErrors.amount = t("amount") + " " + t("required");
    if (!form.category) newErrors.category = t("category") + " " + t("required");
    if (!form.date) newErrors.date = t("date") + " " + t("required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setForm({ amount: "", type: "income", category: "", note: "", date: "" });
    setEditId(null);
    setErrors({});
    setShowForm(false);
    setSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      if (editId) {
        await axios.put(`https://server-personal-income.onrender.com/api/transactions/${editId}`, {
          ...form,
          user_id: userId,
        });
      } else {
        await axios.post("https://server-personal-income.onrender.com/api/transactions", {
          ...form,
          user_id: userId,
        });
      }
      resetForm();
      fetchTransactions();
    } catch (err) {
      console.error("Error saving transaction:", err);
      setSubmitting(false);
    }
  };

  const handleEdit = (tx) => {
  const formattedDate = tx.date ? new Date(tx.date).toISOString().split("T")[0] : "";
  setForm({
    amount: tx.amount,
    type: tx.type,
    category: tx.category,
    note: tx.note,
    date: formattedDate,
  });
  setEditId(tx.id);
  setShowForm(true);
};


  const handleDelete = async (id) => {
    if (window.confirm(t("confirm_delete"))) {
      try {
        await axios.delete(`https://server-personal-income.onrender.com/api/transactions/${id}`);
        fetchTransactions();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const filteredTransactions =
    filterType === "all"
      ? transactions
      : transactions.filter((tx) => tx.type === filterType);

  return (
    <div className="p-4 text-navy-700 dark:text-white mt-6">
      <div className="flex items-center justify-between mb-4">
        
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          + {t("add_transaction")}
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-navy-700 p-6 rounded shadow-lg w-full max-w-3xl">
            <h2 className="text-xl font-bold mb-4">
              {editId ? t("edit_transaction") : t("add_transaction")}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">{t("amount")}</label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/20"
                />
                {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
              </div>
              {/* <div>
                <label className="block mb-1">{t("type")}</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/20"
                >
                  <option value="income">{t("income")}</option>
                  <option value="expense">{t("expense")}</option>
                </select>
              </div> */}
              <div>
                <label className="block mb-1">{t("category")}</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/20"
                />
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              </div>
              <div>
                <label className="block mb-1">{t("date")}</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/20"
                />
                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1">{t("note")}</label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/20"
                  rows={2}
                />
              </div>
              <div className="md:col-span-2 flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={20} color="inherit" /> : editId ? t("update") : t("add")}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-600 dark:text-white/70 hover:underline"
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              <th className="p-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {loadingTable ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="border-t dark:border-white/10 ">
                  {Array(6).fill().map((_, j) => (
                    <td key={j} className="p-2"><Skeleton /></td>
                  ))}
                </tr>
              ))
            ) : filteredTransactions.length ? (
              filteredTransactions.map((tx, index) => (
                <tr key={tx.id} className="border-t dark:border-white/10 hover:bg-gray-50 dark:hover:bg-navy-800/40 bg-white">
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
                  <td className="p-2 space-x-2">
                    <button onClick={() => handleEdit(tx)} className="bg-green-400 hover:bg-green-600 text-white p-2 rounded-full">
                      <FiEdit />
                    </button>
                    <button onClick={() => handleDelete(tx.id)} className="bg-red-400 hover:bg-red-600 text-white p-2 rounded-full">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500 dark:text-white/70">
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

export default Income;
