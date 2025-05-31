import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const CustomerSettings = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const userEmail = auth?.email;
  const userName = auth?.name;

  const [profileData, setProfileData] = useState({
    name: userName,
    email: userEmail,
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileMsg("");
    try {
      await axiosPrivate.put(`v1/user/${userEmail}`, profileData);
      toast.success("Profile Updated Successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordMsg("");
    try {
      await axiosPrivate.put("/v1/changepassword", passwordData);
      toast.success("Password updated successfully");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Account Settings
      </h2>

      {/* Section 1: Profile Settings */}
      <form
        onSubmit={submitProfileUpdate}
        className="space-y-4 mb-10 border-b pb-6"
      >
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Profile Information
        </h3>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleProfileChange}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {/* Section 2: Password Change */}
      <form onSubmit={submitPasswordChange} className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Change Password
        </h3>

        <div>
          <label
            htmlFor="oldPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Old Password
          </label>
          <input
            name="oldPassword"
            type="password"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default CustomerSettings;
