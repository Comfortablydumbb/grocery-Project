import React from "react";
import Hero from "../sections/Hero";
import Features from "../sections/Features";
import FeaturedProducts from "../sections/FeaturedProducts";
import FeaturedCategories from "../sections/FeaturedCategories";

const HomePage = () => {
  return (
    <div className="py-20 bg-gray-50">
      {/* Hero section */}
      <Hero />
      {/* Featured Products */}
      <FeaturedProducts />
      {/* featured categories */}
      <FeaturedCategories />
      {/* Features */}
      <Features />
    </div>
  );
};

export default HomePage;
