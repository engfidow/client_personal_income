import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

const CategoryManagement = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const userId = user?.id;
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", type: "income" });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://server-personal-income.onrender.com/api/categories/${userId}`);
      setCategories(res.data);
    } catch {
    //   toast.error(t("fetch_error"));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) fetchCategories();
  }, [userId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.type) return toast.warning(t("fill_required_fields"));
    try {
      if (editId) {
        await axios.put(`https://server-personal-income.onrender.com/api/categories/${editId}`, form);
        toast.success(t("update_success"));
      } else {
        await axios.post(`https://server-personal-income.onrender.com/api/categories`, {
          ...form,
          user_id: userId,
        });
        toast.success(t("create_success"));
      }
      setForm({ name: "", type: "income" });
      setEditId(null);
      setShowModal(false);
      fetchCategories();
    } catch {
      toast.error(t("save_failed"));
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, type: cat.type });
    setEditId(cat.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("confirm_delete"))) {
      try {
        await axios.delete(`https://server-personal-income.onrender.com/api/categories/${id}`);
        toast.success(t("delete_success"));
        fetchCategories();
      } catch {
        toast.error(t("delete_failed"));
      }
    }
  };

  return (
    <div className="p-4 text-navy-700 dark:text-white mt-6">
      <ToastContainer position="top-right" theme="colored" />
      <div className="flex justify-between items-center mb-4">
       
        <button
          onClick={() => {
            setForm({ name: "", type: "income" });
            setEditId(null);
            setShowModal(true);
          }}
          className="mb-2 bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          + {t("add_category")}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-navy-700 p-6 rounded w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editId ? t("edit_category") : t("add_category")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">{t("name")}</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-navy-800 dark:border-white/20"
                />
              </div>
              <div>
                <label className="block mb-1">{t("type")}</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-navy-800 dark:border-white/20"
                >
                  <option value="income">{t("income")}</option>
                  <option value="expense">{t("expense")}</option>
                </select>
              </div>
              <div className="flex justify-between mt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  {editId ? t("update") : t("create")}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="text-gray-600 dark:text-white/70 hover:underline">
                  {t("cancel")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left border dark:border-white/20">
          <thead className="bg-white dark:bg-navy-800">
            <tr>
              <th className="p-2">No</th>
              <th className="p-2">{t("name")}</th>
              <th className="p-2">{t("type")}</th>
              <th className="p-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center p-4">{t("loading")}...</td>
              </tr>
            ) : categories.length ? (
              categories.map((cat, index) => (
                <tr key={cat.id} className="border-t dark:border-white/10 hover:bg-gray-50 dark:hover:bg-navy-800/40">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{cat.name}</td>
                  <td className="p-2 capitalize">{t(cat.type)}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => handleEdit(cat)} className="bg-green-500 hover:bg-green-700 text-white p-2 rounded-full">
                      <FiEdit />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="bg-red-500 hover:bg-red-700 text-white p-2 rounded-full">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500 dark:text-white/70">
                  {t("no_categories")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManagement;
