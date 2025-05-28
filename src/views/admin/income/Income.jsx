import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Income = () => {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const userId = storedUser?.id;
  const { t } = useTranslation();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [filterType, setFilterType] = useState("income");
  const [loadingTable, setLoadingTable] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    amount: "", type: "income", category: "", note: "", date: "",
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
      toast.error("❌ " + t("fetch_error"));
    } finally {
      setLoadingTable(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`https://server-personal-income.onrender.com/api/categories/${userId}`);
      const incomeCats = res.data.filter((cat) => cat.type === "income");
      setCategories(incomeCats);
    } catch (err) {
      // toast.error("❌ Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTransactions();
      fetchCategories();
    }
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
    if (categories.length === 0) {
      toast.error("❌ Please create a category first.");
      return;
    }
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      if (editId) {
        await axios.put(`https://server-personal-income.onrender.com/api/transactions/${editId}`, {
          ...form, user_id: userId,
        });
        toast.success(t("update_success"));
      } else {
        await axios.post("https://server-personal-income.onrender.com/api/transactions", {
          ...form, user_id: userId,
        });
        toast.success(t("add_success"));
      }
      resetForm();
      fetchTransactions();
    } catch (err) {
      toast.error("❌ " + t("save_failed"));
      setSubmitting(false);
    }
  };

  const handleEdit = (tx) => {
    const formattedDate = tx.date ? new Date(tx.date).toISOString().split("T")[0] : "";
    setForm({ amount: tx.amount, type: tx.type, category: tx.category, note: tx.note, date: formattedDate });
    setEditId(tx.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("confirm_delete"))) {
      try {
        await axios.delete(`https://server-personal-income.onrender.com/api/transactions/${id}`);
        toast.success(t("delete_success"));
        fetchTransactions();
      } catch (err) {
        toast.error("❌ " + t("delete_failed"));
      }
    }
  };

  const filteredTransactions = filterType === "all"
    ? transactions
    : transactions.filter((tx) => tx.type === filterType);

  return (
    <div className="p-4 text-navy-700 dark:text-white mt-6">
      <ToastContainer position="top-right" theme="colored" />
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          + {t("add_transaction")}
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-navy-700 p-6 rounded shadow-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">{editId ? t("edit_transaction") : t("add_transaction")}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">{t("amount")}</label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300 dark:bg-navy-800 dark:border-white/20"
                />
                {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
              </div>
              <div>
                <label className="block mb-1">{t("category")}</label>
                {loadingCategories ? (
                  <p className="text-gray-500 dark:text-white/70">{t("loading")}...</p>
                ) : categories.length === 0 ? (
                  <p className="text-red-500 text-sm">⚠️ {t("no_categories")} - {t("please_register_category_first")}</p>
                ) : (
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300 dark:bg-navy-800 dark:border-white/20"
                  >
                    <option value="">{t("select_category")}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                )}
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              </div>
              <div>
                <label className="block mb-1">{t("date")}</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full p-2 rounded border border-gray-300 dark:bg-navy-800 dark:border-white/20"
                />
                {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1">{t("note")}</label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-2 rounded border border-gray-300 dark:bg-navy-800 dark:border-white/20"
                />
              </div>
              <div className="md:col-span-2 flex justify-between mt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                  disabled={submitting || (categories.length === 0)}
                >
                  {submitting ? <CircularProgress size={20} color="inherit" /> : editId ? t("update") : t("add")}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-700 dark:text-white/70 hover:underline"
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto mt-6">
        <table className="w-full border-collapse border dark:border-white/10 text-sm">
          <thead className="bg-gray-100 dark:bg-navy-800">
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
                <tr key={i} className="border-t dark:border-white/10">
                  {Array(6).fill().map((_, j) => (
                    <td key={j} className="p-2"><Skeleton /></td>
                  ))}
                </tr>
              ))
            ) : filteredTransactions.length ? (
              filteredTransactions.map((tx, index) => (
                <tr key={tx.id} className="border-t dark:border-white/10 hover:bg-gray-50 dark:hover:bg-navy-800/40">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">${tx.amount}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      tx.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {t(tx.type)}
                    </span>
                  </td>
                  <td className="p-2">{tx.category}</td>
                  <td className="p-2">{tx.note}</td>
                  <td className="p-2">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="p-2 flex space-x-2">
                    <button onClick={() => handleEdit(tx)} className="bg-green-500 hover:bg-green-700 text-white p-2 rounded-full">
                      <FiEdit />
                    </button>
                    <button onClick={() => handleDelete(tx.id)} className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-full">
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
