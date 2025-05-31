import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import useLogout from "../hooks/useLogout";

const navLinks = [
  { name: "Dashboard", to: "/customer/dashboard" },
  { name: "MyOrders", to: "/customer/myorders" },
  { name: "Settings", to: "/customer/settings" },
];

const CustomerSidebar = ({ isOpen, toggleSidebar }) => {
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm font-medium ${
      isActive ? "bg-green-200 text-black" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-50 h-full w-64 bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b text-xl font-bold md:block">
          FreshBazar
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <NavLink key={link.name} to={link.to} className={linkClass}>
              {link.name}
            </NavLink>
          ))}
          <button
            className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default CustomerSidebar;
