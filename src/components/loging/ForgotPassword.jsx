import React, { useState } from "react";
import axios from "axios";
import ResetPassword from "./ResetPassword"; // 🔁 Load Reset screen

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("https://server-personal-income.onrender.com/api/auth/forgot-password", { email });
      setSubmitted(true);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Request failed");
    }

    setLoading(false);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await axios.post("https://server-personal-income.onrender.com/api/auth/verify-code", { email, code });
      setVerified(true);
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    }

    setLoading(false);
  };

  // Show password reset form if verified
  if (verified) return <ResetPassword email={email} />;

  return (
    <div className="p-6 mt-10 max-w-md mx-auto bg-white dark:bg-navy-800 shadow rounded text-navy-700 dark:text-white">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

      {message && (
        <div className="mb-4 text-sm text-green-500 dark:text-green-400">{message}</div>
      )}

      {!submitted ? (
        <form onSubmit={handleSendCode}>
          <label className="block text-sm mb-1">Email Address</label>
          <input
            type="email"
            className="w-full p-2 rounded border mb-4 dark:bg-navy-800 dark:border-white/20"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode}>
          <label className="block text-sm mb-1">Enter Verification Code</label>
          <input
            type="text"
            className="w-full p-2 rounded border mb-4 dark:bg-navy-800 dark:border-white/20"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
