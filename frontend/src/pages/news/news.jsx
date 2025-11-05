import React from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../layout/footer/footer";
import dating from "../../assets/dating.png";
import love from "../../assets/love.png";
import prodhealth from "../../assets/prodhealth.png";
import NewsCard from "../../components/newsCard/newsCard";
import { motion } from "framer-motion";

function News() {
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

  const newsData = [
    {
      id: 1,
      Image: dating,
      title: "Shared Interests in Relationships",
      paragraph: `Shared interests are like glue in a relationship. When you and your date have common hobbies or passions, it creates a strong bond, making your connection more meaningful. Exploring these shared activities together can lead to memorable experiences and deeper understanding between you both.`,
      category: "Relationships",
      color: "#F7941D",
    },
    {
      id: 2,
      Image: love,
      title: "Mental Health Matters",
      paragraph: `Mental health is as crucial as physical health. It affects our emotions, thoughts, and daily functioning. Just like we prioritize our physical well-being, it's essential to care for our mental health. Seeking support, practicing self-care, and reducing stigma can lead to better overall well-being and a more fulfilling life.`,
      category: "Mental Health",
      color: "#2B2F92",
    },
    {
      id: 3,
      Image: prodhealth,
      title: "Youth Reproductive Health",
      paragraph: `Youth face unique reproductive challenges. They may lack comprehensive education, access to contraception, and experience peer pressure. These factors can lead to unintended pregnancies or the spread of sexually transmitted infections. Providing accurate information, safe spaces for discussion, and accessible healthcare can empower young people to make informed decisions about their reproductive health.`,
      category: "Reproductive Health",
      color: "#F7941D",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 min-h-[100vh] w-full overflow-x-hidden">
      <Navbar />

      <div className="content p-6 sm:p-10 w-full flex flex-col items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-7xl mx-auto"
        >
          {/* Title Section */}
          <motion.div className="w-full mb-8 sm:mb-12" variants={itemVariants}>
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-bold mb-4"
              variants={titleVariants}
              style={{
                background:
                  "linear-gradient(135deg, #F7941D 0%, #FFA84D 50%, #2B2F92 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Did You Know?
            </motion.h2>
            <motion.p
              className="text-center text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Discover insightful information about health, relationships, and
              well-being
            </motion.p>
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
                className="w-full max-w-4xl"
              >
                <NewsCard
                  Image={news.Image}
                  paragraph={news.paragraph}
                  title={news.title}
                  category={news.category}
                  color={news.color}
                  index={index}
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

export default News;
