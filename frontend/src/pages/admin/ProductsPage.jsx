import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axiosPrivate.get("/v1/products");
      setProducts(response.data.products); // adjust based on your backend's response shape
      console.log(response.data.products); // adjust based on your backend's response shape
    } catch (err) {
      toast.error("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/products/update/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete(`/v1/product/${id}`);
      toast.success("Product deleted");
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const handleCreate = () => {
    navigate("create");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Products</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <Plus className="w-4 h-4" />
          Create Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Price</th>
              <th className="text-left px-4 py-2 border-b">Images</th>
              <th className="text-left px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{product.productName}</td>
                  <td className="px-4 py-2 border-b">Rs.{product.price}</td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex gap-2">
                      {product.images?.map((img, i) => (
                        <img
                          key={i}
                          src={`http://localhost:3001/public/${img}`} // update if your backend gives full URL
                          alt={img}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  {loading ? "Loading products..." : "No products found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;
