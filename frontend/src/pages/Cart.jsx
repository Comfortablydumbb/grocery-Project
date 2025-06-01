import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const axiosPrivate = useAxiosPrivate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosPrivate.get("/v1/cart/getcart");
      
      // Validate cart items
      const items = res.data.cart?.cartItems || [];
      const validItems = items.filter(item => item.productId && item.quantity > 0);
      
      if (items.length !== validItems.length) {
        console.warn("Some cart items were invalid and have been filtered out");
      }
      
      setCartItems(validItems);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError("Failed to load cart items");
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateItemPrice = (item) => {
    if (!item?.productId) return 0;
    const basePrice = item.productId.price || 0;
    const discount = item.productId.discount || 0;
    return discount > 0 
      ? basePrice - (basePrice * discount / 100)
      : basePrice;
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const price = calculateItemPrice(item);
        return total + price * (item.quantity || 0);
      }, 0)
      .toFixed(2);
  };

  const checkStock = (productId, requestedQuantity) => {
    const product = cartItems.find(item => item.productId?._id === productId)?.productId;
    if (!product) return false;
    return (product.remainingUnits || 0) >= requestedQuantity;
  };

  const increaseQuantity = async (productId, currentQty) => {
    try {
      if (!checkStock(productId, currentQty + 1)) {
        toast.error("Not enough stock available");
        return;
      }

      await axiosPrivate.put("/v1/cart/updatecart", {
        productId,
        quantity: currentQty + 1,
      });
      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Increase failed:", err);
      toast.error(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const decreaseQuantity = async (productId, currentQty) => {
    if (currentQty <= 1) return removeItem(productId);
    try {
      await axiosPrivate.put("/v1/cart/updatecart", {
        productId,
        quantity: currentQty - 1,
      });
      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Decrease failed:", err);
      toast.error(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      await axiosPrivate.delete(`/v1/cart/remove/${productId}`);
      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Remove failed:", err);
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      for (let item of cartItems) {
        if (item.productId?._id) {
          await axiosPrivate.delete(`/v1/cart/remove/${item.productId._id}`);
        }
      }
      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Cart cleared");
    } catch (err) {
      console.error("Clear cart failed:", err);
      toast.error("Failed to clear cart");
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 py-20 lg:pt-40 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 py-20 lg:pt-40 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchCart}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              {cartItems.map((item) => {
                if (!item.productId) return null;
                
                const finalPrice = calculateItemPrice(item);
                const product = item.productId;

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-lg shadow-md p-4 flex items-center"
                  >
                    <img
                      src={`http://localhost:3001/public/${product.images?.[0] || 'default-product.jpg'}`}
                      alt={product.productName}
                      className="w-24 h-24 object-cover rounded-md mr-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-product.jpg';
                      }}
                    />
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {product.productName}
                      </h3>
                      <div className="text-gray-600">
                        {product.discount ? (
                          <div className="flex items-center gap-2">
                            <span className="line-through">Rs.{product.price?.toFixed(2)}</span>
                            <span className="text-green-600">Rs.{finalPrice.toFixed(2)}</span>
                            <span className="text-sm text-red-500">(-{product.discount}%)</span>
                          </div>
                        ) : (
                          <p>Rs.{finalPrice.toFixed(2)}</p>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Available: {product.remainingUnits || 0} {product.unit || 'units'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 mr-4">
                      <button
                        onClick={() =>
                          decreaseQuantity(product._id, item.quantity)
                        }
                        className="bg-gray-200 p-1 rounded-full hover:bg-gray-300"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-medium">{item.quantity}</span>
                      <button
                        onClick={() =>
                          increaseQuantity(product._id, item.quantity)
                        }
                        className="bg-gray-200 p-1 rounded-full hover:bg-gray-300"
                        disabled={!checkStock(product._id, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="font-bold text-green-600 mr-4">
                      Rs.{(item.quantity * finalPrice).toFixed(2)}
                    </div>
                    <button
                      onClick={() => removeItem(product._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                );
              })}
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
