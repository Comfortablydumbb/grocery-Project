import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import useAuth from "../hooks/useAuth";
import AccountLink from "../component/AccountLink";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  const { auth } = useAuth();
  const name = auth.name;

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await axiosPrivate.get("/v1/cart/getcart");
        console.log(res.data);
        const items = res.data.cart.cartItems || [];
        const totalCount = items.reduce((sum, item) => sum + item.quantity, 0); // Count total quantity
        setCartCount(totalCount);
        console.log(totalCount);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCartCount();

    // Listen to custom cart update event
    window.addEventListener("cartUpdated", fetchCartCount);

    return () => window.removeEventListener("cartUpdated", fetchCartCount);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "My Orders", path: "/orders" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-green-50"
      }`}
    >
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center font-bold text-green-600 text-2xl"
          >
            फ्रेशBazar
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-6 max-w-xl">
            <div className="flex w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 px-4 py-2 rounded-l-full border-t border-b border-l border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-r-full"
              >
                Search
              </button>
            </div>
          </div>

          {/* Account & Cart */}
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative group flex justify-center items-center gap-2"
            >
              <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-green-600 transition" />
              <span className="absolute -top-2 left-3 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
            <AccountLink />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 md:hidden ml-4"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Nav Links */}
      <div className="hidden md:flex justify-center bg-white">
        <div className="flex gap-10 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative text-gray-700 hover:text-green-600 font-medium ${
                location.pathname === link.path ? "text-green-600" : ""
              }`}
            >
              {link.name}
              {location.pathname === link.path && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-600 rounded"></span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col items-center py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="py-2 text-gray-700 hover:text-green-600 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
