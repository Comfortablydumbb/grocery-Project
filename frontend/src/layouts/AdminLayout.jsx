import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../component/AdminSidebar";
import { Menu } from "lucide-react";

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow p-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">FreshBazar Admin</h1>
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
