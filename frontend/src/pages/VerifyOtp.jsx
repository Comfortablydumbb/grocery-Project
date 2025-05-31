import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "../api/axios";

const VERIFY_OTP_URL = "http://localhost:3001/v1/auth/verify-otp";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { email } = useParams();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      toast.error("OTP must be exactly 6 digits.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        VERIFY_OTP_URL,
        JSON.stringify({ email, otp }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(response?.data);

      toast.success("OTP verified. Account Created Successfully");
      navigate("/login", { replace: true }); // or wherever you want
    } catch (err) {
      if (!err?.response) {
        toast.error("No server response.");
      } else if (err.response?.status === 400) {
        toast.error("Invalid OTP or expired. Please try again.");
      } else {
        toast.error("OTP verification failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-100 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Verify OTP</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the 6-digit code sent to your email or phone
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="number"
              value={otp}
              onChange={handleChange}
              maxLength={6}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-400 text-sm text-center tracking-widest"
              placeholder="123456"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
