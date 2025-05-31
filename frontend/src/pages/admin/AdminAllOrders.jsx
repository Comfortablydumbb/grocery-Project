import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";

const AdminAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const axiosPrivate = useAxiosPrivate();

  const fetchAllOrders = async () => {
    try {
      const res = await axiosPrivate.get("/v1/orders/getallorder");
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosPrivate.put(`/v1/orders/change-status/${orderId}`, {
        status: newStatus,
      });
      fetchAllOrders();
      toast.success(`Order ${orderId} status changed to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error(
        "Failed to change order status. Status of cancelled orders cannot be changed"
      );
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axiosPrivate.delete(`/v1/orders/cancel/${orderId}`);
      fetchAllOrders();
      toast.success(`Order ${orderId} cancelled successfully`);
    } catch (err) {
      console.error("Failed to cancel order", err);
      toast.error(
        "Failed to cancel order. Products in pending status can only be cancelled"
      );
    }
  };

  if (loading) return <p className="text-center py-20">Loading orders...</p>;

  return (
    <div className="py-20 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">All Orders (Admin)</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-lg shadow-md space-y-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-xl">Order #{order._id}</h2>
                  <p className="text-sm text-gray-600">
                    Placed by: {order.userId?.email || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Address: {order.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    Payment: {order.paymentMethod} ({order.paymentStatus})
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: {order.phoneNumber}
                  </p>
                </div>
                <div className="space-x-2">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border rounded p-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                {order.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span>{item.productId?.productName}</span>
                    <span>
                      {item.quantity} × Rs. {item.productId?.price?.toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="text-right font-semibold text-green-600">
                  Total: Rs. {order.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAllOrders;
