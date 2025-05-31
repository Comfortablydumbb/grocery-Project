import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-green-100 via-green-200 to-green-100 py-20 lg:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12 bg-white rounded-3xl shadow-2xl overflow-hidden w-full">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 p-6 md:p-12 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6 leading-tight">
            Don’t miss amazing{" "}
            <span className="text-green-600">grocery deals</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-8">
            Sign up for our daily newsletter and grab the best offers before
            they’re gone!
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 w-full sm:w-auto rounded-full border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none transition"
            />
            <button className="px-6 py-3 w-full sm:w-auto rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold transition">
              Subscribe
            </button>
          </div>
        </motion.div>

        {/* Image Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 h-96 p-6 md:p-12 flex justify-center"
        >
          <img
            src="/image/herosection.jpeg"
            alt="Groceries"
            className="w-full max-w-md h-full rounded-2xl object-cover shadow-lg"
          />
        </motion.div>
      </div>

      {/* Decorative Circles (Optional for Modern Feel) */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-green-300 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-400 rounded-full opacity-20 blur-3xl"></div>
    </section>
  );
}
