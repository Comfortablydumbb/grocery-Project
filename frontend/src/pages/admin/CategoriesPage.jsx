import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import toast from "react-hot-toast";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axiosPrivate.get("/v1/categories");
      setCategories(response.data); // adjust based on your backend's response shape
    } catch (err) {
      toast.error("Failed to load categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (id) => {
    console.log("Edit category", id);
    navigate(`/admin/categories/update/${id}`);
    // Implement navigation or modal here
  };

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete(`/v1/category/${id}`);
      toast.success("Category deleted");
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const handleCreate = () => {
    navigate("create");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Categories</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <Plus className="w-4 h-4" />
          Create Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Images</th>
              <th className="text-left px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{cat.categoryName}</td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex gap-2">
                      {cat.images?.map((img, i) => (
                        <img
                          key={i}
                          src={`http://localhost:3001/public/${img}`} // or use full path from backend
                          alt={img}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(cat._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
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
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  {loading ? "Loading categories..." : "No categories found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesPage;
