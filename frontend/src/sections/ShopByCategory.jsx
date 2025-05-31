import { Link } from "react-router-dom";

const categories = [
  { id: 1, name: "Fruits & Vegetables", image: "/api/placeholder/300/200" },
  { id: 2, name: "Dairy & Eggs", image: "/api/placeholder/300/200" },
  { id: 3, name: "Meat & Seafood", image: "/api/placeholder/300/200" },
  { id: 4, name: "Bakery", image: "/api/placeholder/300/200" },
  { id: 5, name: "Pantry Staples", image: "/api/placeholder/300/200" },
  { id: 6, name: "Beverages", image: "/api/placeholder/300/200" },
];

export default function ShopByCategory() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Shop by Category
        </h2>
        <p className="text-gray-600 text-lg mb-12">
          Find exactly what you need
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-48 object-cover group-hover:scale-110 transform transition duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
