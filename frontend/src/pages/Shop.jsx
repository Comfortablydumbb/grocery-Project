import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../component/ProductCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {toast} from "react-hot-toast";

export default function Shop() {
  const axiosPrivate = useAxiosPrivate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products with populated category
  const fetchProducts = async () => {
    try {
      const res = await axiosPrivate.get("/v1/products");
      setProducts(res.data.products || []);
      setFilteredProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all available categories
  const fetchCategories = async () => {
    try {
      const res = await axiosPrivate.get("/v1/categories");
      setCategories(res.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle filter change
  const handleCategoryChange = (categoryName) => {
    const updatedCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter((c) => c !== categoryName)
      : [...selectedCategories, categoryName];

    setSelectedCategories(updatedCategories);

    if (updatedCategories.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        updatedCategories.includes(product.category?.categoryName)
      );
      setFilteredProducts(filtered);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await axiosPrivate.post("/v1/cart/add", {
        productId,
        quantity: 1,
      });
      toast.success("Items added to cart",{position:"bottom-right"});
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <section className="bg-gray-50 py-20 lg:pt-40">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-green-700">
          Shop Fresh With Us!
        </h1>
        <p className="text-gray-600 mt-2">
          Explore our best selections curated just for you.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/4"
        >
          <div className="bg-white rounded-xl shadow p-6 sticky top-36">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Product Categories
            </h2>
            <ul className="space-y-4">
              {categories.map((category, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    className="accent-green-600"
                    checked={selectedCategories.includes(category.categoryName)}
                    onChange={() => handleCategoryChange(category.categoryName)}
                  />
                  <span className="text-gray-700 group-hover:text-green-600 transition">
                    {category.categoryName}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.aside>

        {/* Products Section */}
        <div className="w-full lg:w-3/4">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <p className="text-gray-700 text-sm">
              Showing {filteredProducts.length} result(s) from{" "}
              {selectedCategories.length > 0
                ? selectedCategories.length
                : categories.length}{" "}
              categorie(s)
            </p>
          </div>

          {/* Products Grid */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loading ? (
              <p>Loading...</p>
            ) : filteredProducts.length === 0 ? (
              <p>No products found.</p>
            ) : (
              filteredProducts.map((product, index) => (
                <motion.div key={index} whileHover={{ scale: 1.03 }}>
                  <ProductCard
                    id={product._id}
                    image={`http://localhost:3001/public/${product.images?.[0]}`}
                    name={product.productName}
                    category={product.category?.categoryName}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    discount={product.discount}
                    unit={product.unit}
                    onAddToCart={() => handleAddToCart(product._id)}
                  />
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
      
    </section>
  );
}
