import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const DashboardHome = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const axiosPrivate = useAxiosPrivate();

  const fetchStats = async () => {
    try {
      const res = await axiosPrivate.get("/v1/stats/adminstats");
      console.log(res.data);
      setStats(res.data.stats);
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-center py-20">Loading dashboard stats...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg shadow ${stat.color} ${stat.textColor} text-center`}
          >
            <p className="text-lg font-medium">{stat.label}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
