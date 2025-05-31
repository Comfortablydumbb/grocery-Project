import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Package, Calendar, DollarSign } from "lucide-react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosPrivate.get("/v1/orders/myorders");
        setOrders(
          (res.data.orders || []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const calculateOrderTotal = (items) =>
    items
      .reduce((total, item) => total + item.productId.price * item.quantity, 0)
      .toFixed(2);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-indigo-100 text-indigo-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 lg:pt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">
              You haven't placed any orders yet
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Order #{order._id}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  {/* Order Items */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-2">Items</h3>
                    {order.orderItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center mb-2 border-b pb-2 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <img
                          
                            src={`http://localhost:3001/public/${item.productId.images?.[0]}` || "/placeholder.jpg"}
                            alt={item.productId.productName}
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.productId.productName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900">
                          Rs.{" "}
                          {(item.productId.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Order Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-5 h-5 mr-2" />
                          <span>Order Date</span>
                        </div>
                        <span className="font-medium">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="w-5 h-5 mr-2" />
                          <span>Total</span>
                        </div>
                        <span className="font-bold text-lg text-green-600">
                          Rs. {calculateOrderTotal(order.orderItems)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Payment</span>
                        <span>{order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
