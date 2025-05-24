import React, { useState } from "react";
import axios from "axios";

const ResetPassword = ({ email }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      return setMessage("Passwords do not match");
    }

    try {
      setLoading(true);
      await axios.post("https://server-personal-income.onrender.com/api/auth/reset-password", {
        email,
        newPassword,
      });
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setMessage(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="p-6 mt-10 max-w-md mx-auto bg-white dark:bg-navy-800 shadow rounded text-navy-700 dark:text-white">
      <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>

      {message && <div className="mb-4 text-red-500 text-sm">{message}</div>}
      {success && (
        <div className="mb-4 text-green-600 text-sm">Password updated successfully. You can now log in.</div>
      )}

      {!success && (
        <form onSubmit={handleReset}>
          <div className="mb-4">
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/20"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full p-2 rounded border dark:bg-navy-800 dark:border-white/20"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;


