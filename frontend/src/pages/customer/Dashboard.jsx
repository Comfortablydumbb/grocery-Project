import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, Clock, CreditCard } from "lucide-react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const CustomerDashboardHome = () => {
  const [stats, setStats] = useState([]);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchCustomerStats = async () => {
      try {
        const res = await axiosPrivate.get("/v1/stats/customerstats"); // Update if your route is different
        const data = res.data.stats;

        const mappedStats = [
          {
            label: "Total Orders",
            value: data.totalOrders,
            icon: ShoppingCart,
            color: "bg-indigo-100",
            textColor: "text-indigo-700",
          },
          {
            label: "Pending Orders",
            value: data.pendingOrders,
            icon: Clock,
            color: "bg-orange-100",
            textColor: "text-orange-700",
          },
          {
            label: "Cart Items",
            value: data.cartItems,
            icon: ShoppingCart,
            color: "bg-green-100",
            textColor: "text-green-700",
          },
          {
            label: "Total Spend",
            value: `NPR ${data.totalSpend}`,
            icon: CreditCard,
            color: "bg-yellow-100",
            textColor: "text-yellow-700",
          },
        ];

        setStats(mappedStats);
      } catch (err) {
        console.error("❌ Failed to fetch customer stats:", err);
      }
    };

    fetchCustomerStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Your Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-md transition hover:shadow-lg hover:scale-[1.02] ${stat.color} ${stat.textColor} flex items-center gap-4`}
            >
              <div className="p-3 rounded-full bg-white shadow">
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <div>
                <p className="text-md font-medium">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerDashboardHome;
