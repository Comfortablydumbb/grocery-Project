import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  id,
  image,
  name,
  category,
  unit,
  price,
  oldPrice,
  discount,
  onAddToCart,
}) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    // Prevent navigation when clicking the add to cart button
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/product/${id}`);
  };

  return (
    <div 
      className="relative bg-white rounded-2xl shadow-md p-4 w-full max-w-xs flex flex-col cursor-pointer hover:shadow-lg transition"
      onClick={handleClick}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
          {discount}%
        </div>
      )}

      {/* Product Image */}
      <img src={image} alt={name} className="w-full h-48 object-cover mb-4" />

      <p className="text-gray-400 text-sm mb-1 flex">{category}</p>
      <h2 className="text-lg font-semibold text-gray-800 leading-tight mb-2 flex">
        {name}
      </h2>

      <div className="flex items-center gap-1 text-gray-400 text-sm mb-2">
        ⭐⭐⭐⭐⭐
      </div>

      <p className="text-gray-500 text-sm mb-4 flex items-center">
        Price per <span className="text-green-500 ml-1">{unit}</span>
      </p>

      <div className="mt-auto flex items-center justify-between">
        <div>
          <p className="text-green-600 font-bold text-lg">Rs. {price}</p>
          <p className="text-gray-400 text-sm line-through">Rs. {oldPrice}</p>
        </div>
        <button
          onClick={onAddToCart}
          className="flex items-center gap-1 bg-green-100 text-green-600 px-4 py-2 rounded-full font-medium hover:bg-green-200 transition cursor-pointer"
        >
          <ShoppingCart size={18} />
          Add
        </button>
      </div>
    </div>
  );
}
