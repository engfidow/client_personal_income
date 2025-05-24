import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const storedId = JSON.parse(sessionStorage.getItem("user"))?.id;
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", image: null });
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://server-personal-income.onrender.com/api/auth/me/${storedId}`);
        setUser(res.data);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          password: "",
          image: null,
        });
        setPreview(
          res.data.image ? `https://server-personal-income.onrender.com/uploads/users/${res.data.image}` : null
        );
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    if (storedId) fetchUser();
  }, [storedId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (form.name) formData.append("name", form.name);
    if (form.email) formData.append("email", form.email);
    if (form.password) formData.append("password", form.password);
    if (form.image) formData.append("image", form.image);

    try {
      await axios.put(`https://server-personal-income.onrender.com/api/auth/${storedId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Refetch updated user
      const res = await axios.get(`https://server-personal-income.onrender.com/api/auth/me/${storedId}`);
      setUser(res.data);
      sessionStorage.setItem("user", JSON.stringify({ id: storedId }));
      setEditing(false);
      setMessage("Profile updated successfully");
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("Update failed");
    }
  };

  if (!user) {
    return <div className="p-6 text-navy-700 dark:text-white">Loading profile...</div>;
  }

  return (
    <div className="p-6 mt-10 bg-white dark:bg-navy-800 shadow rounded text-navy-700 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {message && <div className="mb-4 text-green-500">{message}</div>}

      <div className="flex items-center space-x-6 mb-6">
        <img
          src={preview || "https://via.placeholder.com/100"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={!editing}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!editing}
            className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/20"
          />
        </div>
        <div>
          <label className="text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={!editing}
            className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/20"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm">New Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            disabled={!editing}
            className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/20"
            placeholder="Leave blank to keep current password"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        {editing ? (
          <>
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-gray-600 dark:text-white/70 hover:underline"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
