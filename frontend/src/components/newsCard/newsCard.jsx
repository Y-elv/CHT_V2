import React from "react";
import { motion } from "framer-motion";
import "./newsCard.css";

function NewsCard({ Image, paragraph, title, category, color, index = 0 }) {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateY: -15,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
        delay: index * 0.2,
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -10,
      rotateY: 5,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      rotateY: 8,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const isEven = index % 2 === 0;

  return (
    <motion.div
      className="flex flex-col relative w-full cursor-pointer"
      variants={cardVariants}
      whileHover="hover"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className={`details bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-6 sm:gap-8 border border-slate-200 dark:border-slate-700 transition-shadow duration-300 ${
          isEven ? "sm:flex-row" : "sm:flex-row-reverse"
        }`}
        variants={hoverVariants}
        whileHover={{
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Image Section */}
        <motion.div
          className="w-full sm:w-2/5 flex items-center justify-center relative z-10"
          style={{
            transformStyle: "preserve-3d",
            backgroundColor: "transparent",
            background: "transparent",
            isolation: "isolate",
          }}
        >
          <motion.div
            className="rounded-2xl overflow-hidden relative z-20 w-full"
            style={{
              border: `4px solid ${color}`,
              backgroundColor: "transparent",
              background: "transparent",
              boxShadow: `0 0 20px ${color}40, 0 0 40px ${color === "#F7941D" ? "rgba(43, 47, 146, 0.2)" : "rgba(247, 148, 29, 0.2)"}`,
              isolation: "isolate",
            }}
            variants={imageVariants}
            whileHover={{
              boxShadow: `0 0 30px ${color}60, 0 0 60px ${color === "#F7941D" ? "rgba(43, 47, 146, 0.3)" : "rgba(247, 148, 29, 0.3)"}`,
              backgroundColor: "transparent",
              background: "transparent",
            }}
          >
            <motion.img
              src={Image}
              alt={title}
              className="object-cover rounded-2xl w-full h-auto block relative z-30"
              style={{
                backgroundColor: "transparent",
                background: "transparent",
                display: "block",
                position: "relative",
                isolation: "isolate",
                minHeight: "250px",
              }}
            />
          </motion.div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          className="w-full sm:w-3/5 flex flex-col gap-4 sm:gap-6"
          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Category Badge */}
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span
              className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color === "#F7941D" ? "#FFA84D" : "#1e2266"} 100%)`,
                color: "#F7941D",
              }}
            >
              {category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h3
            className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
            style={{
              background: `linear-gradient(135deg, ${color} 0%, ${color === "#F7941D" ? "#FFA84D" : "#1e2266"} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {title}
          </motion.h3>

          {/* Paragraph */}
          <motion.p
            className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {paragraph}
          </motion.p>

          {/* Read More Button */}
          <motion.div
            className="mt-2"
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.button
              className="px-6 py-3 rounded-xl font-semibold text-sm sm:text-base shadow-lg transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color === "#F7941D" ? "#FFA84D" : "#1e2266"} 100%)`,
                color: "#F7941D",
              }}
              whileHover={{
                boxShadow: `0 10px 30px ${color}50`,
                scale: 1.05,
              }}
            >
              Read More →
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default NewsCard;
