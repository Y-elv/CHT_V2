import React from "react";
import Navbar from "../components/navbar/navbar";
import Footer from "../layout/footer/footer";
import Muhima from "../assets/muhima.png";
import Kipharma from "../assets/kipharma.png";
import Health from "../assets/reproductive.png";
import NewsCard from "../components/newsCard/newsCard";
import { motion } from "framer-motion";
import { IoHeartOutline, IoShareSocialOutline, IoTimeOutline, IoBookmarkOutline } from "react-icons/io5";

function NewsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
      },
    },
  };

  const floatingVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const newsData = [
    {
      id: 1,
      Image: Muhima,
      title: "Shared Interests in Relationships",
      paragraph: `Shared interests are like glue in a relationship. When you and your date have common hobbies or passions, it creates a strong bond, making your connection more meaningful. Exploring these shared activities together can lead to memorable experiences and deeper understanding between you both.`,
      category: "Relationships",
      color: "#F7941D",
      readTime: "3 min read",
      likes: 124,
      shares: 45,
      date: "2 days ago",
    },
    {
      id: 2,
      Image: Kipharma,
      title: "Mental Health Matters",
      paragraph: `Mental health is as crucial as physical health. It affects our emotions, thoughts, and daily functioning. Just like we prioritize our physical well-being, it's essential to care for our mental health. Seeking support, practicing self-care, and reducing stigma can lead to better overall well-being and a more fulfilling life.`,
      category: "Mental Health",
      color: "#2B2F92",
      readTime: "5 min read",
      likes: 289,
      shares: 78,
      date: "4 days ago",
    },
    {
      id: 3,
      Image: Health,
      title: "Youth Reproductive Health",
      paragraph: `Youth face unique reproductive challenges. They may lack comprehensive education, access to contraception, and experience peer pressure. These factors can lead to unintended pregnancies or the spread of sexually transmitted infections. Providing accurate information, safe spaces for discussion, and accessible healthcare can empower young people to make informed decisions about their reproductive health.`,
      category: "Reproductive Health",
      color: "#F7941D",
      readTime: "4 min read",
      likes: 156,
      shares: 62,
      date: "1 week ago",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-[100vh] w-full overflow-x-hidden">
      <Navbar active="ourTeam" />

      <div className="content p-6 sm:p-10 w-full flex flex-col items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-7xl mx-auto"
        >
          {/* Enhanced Header Section */}
          <motion.div
            className="w-full mb-8 sm:mb-16 relative"
            variants={itemVariants}
          >
            {/* Floating decorative elements */}
            <motion.div
              className="absolute top-0 left-10 w-20 h-20 rounded-full opacity-20 blur-xl hidden lg:block"
              style={{
                background: "linear-gradient(135deg, #F7941D 0%, #FFA84D 100%)",
              }}
              variants={floatingVariants}
              animate="float"
            />
            <motion.div
              className="absolute top-10 right-20 w-32 h-32 rounded-full opacity-15 blur-2xl hidden lg:block"
              style={{
                background: "linear-gradient(135deg, #2B2F92 0%, #1e2266 100%)",
              }}
              variants={floatingVariants}
              animate="float"
              transition={{ delay: 1 }}
            />

            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center font-bold mb-6 relative z-10"
              variants={titleVariants}
              style={{
                background:
                  "linear-gradient(135deg, #F7941D 0%, #FFA84D 50%, #2B2F92 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 40px rgba(247, 148, 29, 0.3)",
              }}
            >
              Did You Know?
            </motion.h2>

            <motion.p
              className="text-center text-slate-600 dark:text-slate-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-4 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Discover insightful information about health, relationships, and
              well-being
            </motion.p>

            {/* Stats Bar */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.div
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                style={{
                  border: "2px solid",
                  borderColor: "#F7941D",
                }}
              >
                <span className="text-sm font-semibold text-[#F7941D]">
                  {newsData.length} Articles
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                style={{
                  border: "2px solid",
                  borderColor: "#2B2F92",
                }}
              >
                <span className="text-sm font-semibold text-[#2B2F92]">
                  Health & Wellness
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                style={{
                  border: "2px solid",
                  borderColor: "#F7941D",
                }}
              >
                <span className="text-sm font-semibold text-[#F7941D]">
                  Updated Daily
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* News Cards Grid */}
          <motion.div
            className="flex flex-col items-center gap-8 sm:gap-10 md:gap-12 w-full"
            variants={containerVariants}
          >
            {newsData.map((news, index) => (
              <motion.div
                key={news.id}
                variants={itemVariants}
                custom={index}
                className="w-full max-w-5xl"
              >
                <EnhancedNewsCard
                  Image={news.Image}
                  paragraph={news.paragraph}
                  title={news.title}
                  category={news.category}
                  color={news.color}
                  index={index}
                  readTime={news.readTime}
                  likes={news.likes}
                  shares={news.shares}
                  date={news.date}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

// Enhanced News Card Component
function EnhancedNewsCard({
  Image,
  paragraph,
  title,
  category,
  color,
  index = 0,
  readTime,
  likes,
  shares,
  date,
}) {
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
        className={`details bg-white dark:bg-slate-800 p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center gap-6 sm:gap-8 border-2 transition-shadow duration-300 ${
          isEven ? "sm:flex-row" : "sm:flex-row-reverse"
        }`}
        variants={hoverVariants}
        whileHover={{
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
        }}
        style={{
          transformStyle: "preserve-3d",
          borderColor: color,
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
            className="rounded-3xl overflow-hidden relative z-20 w-full"
            style={{
              border: `4px solid ${color}`,
              backgroundColor: "transparent",
              background: "transparent",
              boxShadow: `0 0 30px ${color}50, 0 0 60px ${color === "#F7941D" ? "rgba(43, 47, 146, 0.3)" : "rgba(247, 148, 29, 0.3)"}`,
              isolation: "isolate",
            }}
            variants={imageVariants}
            whileHover={{
              boxShadow: `0 0 40px ${color}70, 0 0 80px ${color === "#F7941D" ? "rgba(43, 47, 146, 0.4)" : "rgba(247, 148, 29, 0.4)"}`,
              backgroundColor: "transparent",
              background: "transparent",
            }}
          >
            <motion.img
              src={Image}
              alt={title}
              className="object-cover rounded-3xl w-full h-auto block relative z-30"
              style={{
                backgroundColor: "transparent",
                background: "transparent",
                display: "block",
                position: "relative",
                isolation: "isolate",
                minHeight: "280px",
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
          {/* Category Badge and Meta Info */}
          <div className="flex flex-wrap items-center gap-3">
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

            {/* Meta Info */}
            <motion.div
              className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400"
              whileHover={{ scale: 1.05 }}
            >
              <IoTimeOutline className="text-[#F7941D]" />
              <span>{readTime}</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400"
              whileHover={{ scale: 1.05 }}
            >
              <span>{date}</span>
            </motion.div>
          </div>

          {/* Title */}
          <motion.h3
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
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
            className="text-sm sm:text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {paragraph}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-wrap items-center gap-4 mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <motion.button
              className="px-6 py-3 rounded-xl font-semibold text-sm sm:text-base shadow-lg transition-all duration-300 flex items-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color === "#F7941D" ? "#FFA84D" : "#1e2266"} 100%)`,
                color: "#F7941D",
              }}
              whileHover={{
                boxShadow: `0 10px 30px ${color}50`,
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
            >
              Read More →
            </motion.button>

            {/* Social Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                style={{ color: "#F7941D" }}
              >
                <IoHeartOutline className="text-xl" />
              </motion.button>
              <motion.button
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                style={{ color: "#2B2F92" }}
              >
                <IoShareSocialOutline className="text-xl" />
              </motion.button>
              <motion.button
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{ color: "#F7941D" }}
              >
                <IoBookmarkOutline className="text-xl" />
              </motion.button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <IoHeartOutline style={{ color: "#F7941D" }} />
                {likes}
              </span>
              <span className="flex items-center gap-1">
                <IoShareSocialOutline style={{ color: "#2B2F92" }} />
                {shares}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default NewsPage;
