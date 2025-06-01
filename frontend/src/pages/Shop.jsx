import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../component/ProductCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "react-hot-toast";
import { useSearch } from "../context/SearchProvider";
import { Loader2 } from "lucide-react";

export default function Shop() {
  const axiosPrivate = useAxiosPrivate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { 
    searchQuery, 
    searchResults, 
    isSearching,
    selectedCategories,
    setSelectedCategories 
  } = useSearch();

  // Fetch all products with populated category
  const fetchProducts = async () => {
    try {
      const res = await axiosPrivate.get("/v1/products");
      const allProducts = res.data.products || [];
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
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
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Apply filters (categories and search)
  useEffect(() => {
    let filtered = searchQuery ? searchResults : products;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category?.categoryName)
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, searchResults, selectedCategories, products]);

  // Handle filter change
  const handleCategoryChange = (categoryName) => {
    if (searchQuery) {
      // If there's a search query, clear it first
      setSelectedCategories([categoryName]);
    } else {
      const updatedCategories = selectedCategories.includes(categoryName)
        ? selectedCategories.filter((c) => c !== categoryName)
        : [...selectedCategories, categoryName];
      setSelectedCategories(updatedCategories);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await axiosPrivate.post("/v1/cart/add", {
        productId,
        quantity: 1,
      });
      toast.success("Item added to cart");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error adding to cart:", err);
      const errorMessage = err.response?.data?.msg || "Failed to add to cart";
      toast.error(errorMessage);
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
              {categories.map((category) => (
                <li
                  key={category._id}
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
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Searching...
                </span>
              ) : (
                <>
                  Showing {filteredProducts.length} result(s)
                  {searchQuery && (
                    <span className="ml-1">
                      for "{searchQuery}"
                    </span>
                  )}
                  {selectedCategories.length > 0 && (
                    <span className="ml-1">
                      in {selectedCategories.length} selected {selectedCategories.length === 1 ? 'category' : 'categories'}
                    </span>
                  )}
                </>
              )}
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
            {loading || isSearching ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchQuery
                    ? `No products found matching "${searchQuery}"`
                    : "No products found in selected categories."}
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <motion.div key={product._id} whileHover={{ scale: 1.03 }}>
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
