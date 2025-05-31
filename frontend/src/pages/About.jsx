import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="container mx-auto mt-4 px-4 py-20 lg:pt-40">
      {/* Hero Section */}
      <div className="relative bg-[url('/image/market.jpg')] bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden">
        <div className="bg-black/50 flex flex-col items-center text-center py-32 px-4">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            About Fresh Market
          </motion.h1>
          <div className="w-20 h-1 bg-green-400 mb-6"></div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-gray-200 max-w-2xl"
          >
            Bringing fresh, quality produce and grocery items to your
            neighborhood since 2010.
          </motion.p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-20 border-t border-gray-300"></div>

      {/* Our Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col justify-center"
        >
          <h2 className="text-3xl font-bold text-green-700 mb-6">Our Story</h2>
          <p className="text-gray-700 mb-4">
          </p>
          <p className="text-gray-700 mb-4">
          Fresh Market began with a simple idea: to create a grocery store that feels like a true community hub.
           In 2010, founder Binod Shrestha saw that his hometown of Kushma lacked a local shop offering fresh,
            high-quality produce at fair prices with a personal, neighborly touch.
          .
          </p>
          <p className="text-gray-700">
          What started as a small neighborhood store has grown into a trusted part of the Kushma community.
           Despite the growth, we've stayed true to our roots—committed to quality, freshness, and friendly, personalized service.

            By working closely with local farmers and producers, we've built a grocery experience that celebrates both the rich flavors
             of Nepal and the abundance of our local harvests.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="rounded-lg overflow-hidden shadow-xl"
        >
          <img
            src="/image/department.jpg"
            alt="Store"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Divider */}
      <div className="my-20 border-t border-gray-300"></div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {["Our Mission", "Our Vision"].map((title, idx) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-green-50 p-8 rounded-lg shadow"
          >
            <h2 className="text-2xl font-bold text-green-700 mb-4">{title}</h2>
            <p className="text-gray-700">
              {title === "Our Mission"
                ? "To provide communities with access to fresh, high-quality food products while supporting local producers and maintaining sustainable practices."
                : "To be the preferred neighborhood grocery destination that transforms shopping into a delightful experience, fostering community connections and healthier lifestyles."}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div className="my-20 border-t border-gray-300"></div>

      {/* Our Values */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {["Quality", "Community", "Sustainability", "Transparency"].map(
            (title, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg hover:-translate-y-2 transform transition"
              >
                <div className="text-4xl mb-4">
                  {idx === 0
                    ? "\u2728"
                    : idx === 1
                    ? "\uD83E\uDD1D"
                    : idx === 2
                    ? "\uD83C\uDF31"
                    : "\uD83D\uDCCB"}
                </div>
                <h3 className="text-xl font-bold text-green-700 mb-2">
                  {title}
                </h3>
                <p className="text-gray-700">
                  {/* Short description for each value */}
                  {title === "Quality"
                    ? "We select only the finest products."
                    : title === "Community"
                    ? "We build strong local connections."
                    : title === "Sustainability"
                    ? "We operate with care for the planet."
                    : "We value honesty and clarity."}
                </p>
              </motion.div>
            )
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="my-20 border-t border-gray-300"></div>

      {/* Meet the Team */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            "Sarah Chen",
            "Michael Chen",
            "Elena Rodriguez",
            "James Wilson",
          ].map((name, idx) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow hover:shadow-2xl transform hover:-translate-y-2 transition overflow-hidden"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-600 italic">[Photo]</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-700">{name}</h3>
                <p className="text-green-600 mb-2">
                  {name === "Sarah Chen"
                    ? "Co-Founder & CEO"
                    : name === "Michael Chen"
                    ? "Co-Founder & COO"
                    : name === "Elena Rodriguez"
                    ? "Chef & Food Director"
                    : "Sustainability Manager"}
                </p>
                <p className="text-gray-700">
                  {name === "Sarah Chen"
                    ? "Passionate about quality food and community building."
                    : name === "Michael Chen"
                    ? "Bringing 20+ years of retail expertise."
                    : name === "Elena Rodriguez"
                    ? "Creating seasonal recipes and menus."
                    : "Driving our eco-friendly mission."}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      {/* <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-green-600 text-white rounded-lg p-8 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Come Visit Us Today!</h2>
        <p className="text-xl mb-6">
          Experience the Fresh Market difference at any of our locations.
        </p>
        <button className="bg-white text-green-700 px-8 py-3 rounded-lg font-bold hover:bg-green-100 transition">
          <span className="inline-flex items-center">📍 Find Your Store</span>
        </button>
      </motion.div> */}
    </div>
  );
};

export default About;
