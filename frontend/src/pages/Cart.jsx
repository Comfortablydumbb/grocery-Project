import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const auth = useAuth();

  const axiosPrivate = useAxiosPrivate();

  const fetchCart = async () => {
    try {
      const res = await axiosPrivate.get("/v1/cart/getcart");
      console.log(res.data.cart.cartItems);
      setCartItems(res.data.cart.cartItems || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
    calculateTotal();
  }, []);

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.productId.price * item.quantity, 0)
      .toFixed(2);
  };

  const increaseQuantity = async (productId, currentQty) => {
    try {
      await axiosPrivate.put("/v1/cart/updatecart", {
        productId,
        quantity: currentQty + 1,
      });
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Increase failed:", err);
    }
  };

  const decreaseQuantity = async (productId, currentQty) => {
    if (currentQty <= 1) return removeItem(productId);
    try {
      await axiosPrivate.put("/v1/cart/updatecart", {
        productId,
        quantity: currentQty - 1,
      });
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Decrease failed:", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axiosPrivate.delete(`/v1/cart/remove/${productId}`);
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  const clearCart = async () => {
    try {
      for (let item of cartItems) {
        await axiosPrivate.delete(`/v1/cart/remove/${item.productId._id}`);
      }
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Clear cart failed:", err);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 py-20 lg:pt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <Link
              to="/shop"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md p-4 flex items-center"
                >
                  <img
                    src={`http://localhost:3001/public/${item.productId.images[0]}`}
                    alt={item.productId.productName}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.productId.productName}
                    </h3>
                    <p className="text-gray-600">
                      Rs.{item.productId.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mr-4">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.productId._id, item.quantity)
                      }
                      className="bg-gray-200 p-1 rounded-full"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() =>
                        increaseQuantity(item.productId._id, item.quantity)
                      }
                      className="bg-gray-200 p-1 rounded-full"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="font-bold text-green-600 mr-4">
                    Rs.{(item.quantity * item.productId.price).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeItem(item.productId._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-bold">Rs. {calculateTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Delivery</span>
                  <span className="font-bold">Rs. 100</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>
                    Rs. {(parseFloat(calculateTotal()) + 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <button
                  onClick={clearCart}
                  className="w-full bg-red-100 text-red-800 py-2 rounded-lg hover:bg-red-200"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
