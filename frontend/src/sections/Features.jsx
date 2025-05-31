import { Award, Clock, ShoppingBag, Truck } from "lucide-react";

export default function Features() {
  return (
    <section className="bg-green-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
          Stay home & get your daily needs from our shop
        </h2>
        <p className="text-gray-600 text-base sm:text-lg mb-10">
          Start Your Daily Shopping with{" "}
          <span className="text-green-600 font-semibold">FreshBazar</span>
        </p>

        {/* Subscription Input */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full sm:w-72 px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition">
            Subscribe
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl p-6 flex flex-col items-center hover:shadow-md transition">
            <ShoppingBag className="h-10 w-10 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Best prices & offers
            </h3>
            <p className="text-gray-600 text-sm text-center">
              Orders $50 or more
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 flex flex-col items-center hover:shadow-md transition">
            <Truck className="h-10 w-10 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Free delivery
            </h3>
            <p className="text-gray-600 text-sm text-center">
              24/7 amazing services
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 flex flex-col items-center hover:shadow-md transition">
            <Award className="h-10 w-10 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Great daily deal
            </h3>
            <p className="text-gray-600 text-sm text-center">
              When you sign up
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 flex flex-col items-center hover:shadow-md transition">
            <Clock className="h-10 w-10 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Wide assortment
            </h3>
            <p className="text-gray-600 text-sm text-center">Mega Discounts</p>
          </div>

          <div className="bg-white rounded-xl p-6 flex flex-col items-center hover:shadow-md transition">
            <Clock className="h-10 w-10 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Easy returns
            </h3>
            <p className="text-gray-600 text-sm text-center">Within 30 days</p>
          </div>
        </div>
      </div>
    </section>
  );
}
