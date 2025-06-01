import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const AdminAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingOrderId, setProcessingOrderId] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  const fetchAllOrders = async () => {
    try {
      const res = await axiosPrivate.get("/v1/orders/getallorder");
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus, currentStatus) => {
    // Prevent status change for cancelled orders
    if (currentStatus === "Cancelled") {
      toast.error("Cannot update a cancelled order");
      return;
    }

    try {
      setProcessingOrderId(orderId);
      const res = await axiosPrivate.put(`/v1/orders/change-status/${orderId}`, {
        status: newStatus,
      });

      // Update orders list with new status
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      toast.success(res.data.message);
    } catch (err) {
      console.error("Failed to update status", err);
      const errorMessage = err.response?.data?.error || "Failed to update order status";
      toast.error(errorMessage);
      // Refresh orders to ensure correct state
      fetchAllOrders();
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleCancelOrder = async (orderId, currentStatus) => {
    // Only allow cancellation of pending orders
    if (currentStatus !== "Pending") {
      toast.error("Only pending orders can be cancelled");
      return;
    }

    try {
      setProcessingOrderId(orderId);
      
      const res = await axiosPrivate.delete(`/v1/orders/cancel/${orderId}`);

      if (res.data.order) {
        // Update orders list with cancelled status and updated order data
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId
              ? { ...order, ...res.data.order }
              : order
          )
        );
        toast.success("Order cancelled successfully");
      }
    } catch (err) {
      console.error("Failed to cancel order", err);
      const errorMessage = err.response?.data?.error || "Failed to cancel order";
      toast.error(errorMessage);
      // Refresh orders to ensure correct state
      await fetchAllOrders();
    } finally {
      setProcessingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

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
                  <p className={`text-sm font-medium ${
                    order.status === 'Cancelled' ? 'text-red-600' :
                    order.status === 'Delivered' ? 'text-green-600' :
                    'text-blue-600'
                  }`}>
                    Status: {order.status}
                  </p>
                </div>
                <div className="space-x-2">
                  {processingOrderId === order._id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value, order.status)
                        }
                        className={`border rounded p-1 ${
                          order.status === 'Cancelled' 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'cursor-pointer'
                        }`}
                        disabled={order.status === 'Cancelled'}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelOrder(order._id, order.status)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </>
                  )}
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
