import React from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../layout/footer/footer";
import { motion } from "framer-motion";
import { 
  IoLocationOutline, 
  IoMailOutline, 
  IoCallOutline, 
  IoMedicalOutline,
  IoShieldCheckmarkOutline,
  IoFlaskOutline,
  IoCartOutline,
  IoTimeOutline
} from "react-icons/io5";

const Pharmacy = () => {
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
    hidden: { opacity: 0, y: 50, scale: 0.9 },
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

  const pharmacyData = [
    {
      id: 1,
      title: "Mila Pharmacy Ltd",
      location: "Kigali, Rwanda",
      email: "milapharmacy.org",
      phone: "+250788786699",
      description: "Mila Pharmacy is your go-to destination for sexual health needs, offering a discreet and comprehensive range of services. From contraception pills to condoms, we provide access to essential products that promote safe and responsible sexual practices. Our knowledgeable pharmacists offer personalized consultations, ensuring you receive the right guidance and support.",
      icon: IoFlaskOutline,
      color: "#F7941D",
      features: ["Contraception Pills", "Condoms", "Private Consultations", "Expert Guidance"]
    },
    {
      id: 2,
      title: "Modern Family Pharmacy",
      location: "Kigali, Rwanda", 
      email: "modernfamilypharmacy.org",
      phone: "+250788461069",
      description: "Modern Family Pharmacy specializes in providing a range of sexual and reproductive health services, including contraception pills and condoms. As a trusted healthcare provider, we offer confidential consultations and personalized guidance to ensure our clients receive the most suitable options for their needs.",
      icon: IoMedicalOutline,
      color: "#2B2F92",
      features: ["Confidential Services", "Personalized Care", "Quality Products", "Professional Staff"]
    },
    {
      id: 3,
      title: "Youth Reproductive Health Services",
      location: "Gatsibo District",
      email: "kiziguro.hospital.hospital@moh.gov.rw",
      phone: "0788329851",
      description: "Youth face unique reproductive challenges. They may lack comprehensive education, access to contraception, and experience peer pressure. These factors can lead to unintended pregnancies or spread of sexually transmitted infections. Providing accurate information, safe spaces for discussion, and accessible healthcare can empower young people.",
      icon: IoShieldCheckmarkOutline,
      color: "#F7941D",
      features: ["Youth-Focused Care", "Education Programs", "Safe Spaces", "Accessible Services"]
    }
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
              Pharmacy Services
            </motion.h2>
            <motion.p
              className="text-center text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Access confidential sexual and reproductive health products with professional guidance
            </motion.p>
          </motion.div>

          {/* Pharmacy Cards Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 w-full"
            variants={containerVariants}
          >
            {pharmacyData.map((pharmacy, index) => {
              const Icon = pharmacy.icon;
              return (
                <motion.div
                  key={pharmacy.id}
                  variants={itemVariants}
                  custom={index}
                  className="group"
                >
                  <div
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl transition-all duration-500 h-full"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
                    }}
                  >
                    {/* Header with gradient accent */}
                    <div
                      className="h-2 w-full"
                      style={{
                        background: `linear-gradient(90deg, ${pharmacy.color} 0%, ${pharmacy.color}CC 100%)`,
                      }}
                    />

                    <div className="p-6 sm:p-8">
                      {/* Icon Section */}
                      <motion.div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                        style={{
                          background: `linear-gradient(135deg, ${pharmacy.color}20 0%, ${pharmacy.color}10 100%)`,
                          border: `2px solid ${pharmacy.color}40`,
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Icon
                          size={32}
                          style={{ color: pharmacy.color }}
                        />
                      </motion.div>

                      {/* Content */}
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                        {pharmacy.title}
                      </h3>

                      <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                        {pharmacy.description}
                      </p>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {pharmacy.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: pharmacy.color }}
                            />
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-3 border-t border-slate-200 dark:border-slate-700 pt-4">
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <IoLocationOutline
                            size={16}
                            style={{ color: pharmacy.color }}
                          />
                          <span>{pharmacy.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <IoMailOutline
                            size={16}
                            style={{ color: pharmacy.color }}
                          />
                          <span className="truncate">{pharmacy.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <IoCallOutline
                            size={16}
                            style={{ color: pharmacy.color }}
                          />
                          <span>{pharmacy.phone}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6">
                        <motion.button
                          className="flex-1 px-4 py-3 rounded-xl font-semibold text-white text-sm sm:text-base transition-all duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${pharmacy.color} 0%, ${pharmacy.color}CC 100%)`,
                            boxShadow: `0 4px 12px ${pharmacy.color}40`,
                          }}
                          whileHover={{ 
                            scale: 1.02, 
                            y: -2,
                            boxShadow: `0 8px 20px ${pharmacy.color}60`,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <IoCartOutline size={16} />
                            Order Products
                          </div>
                        </motion.button>
                        <motion.button
                          className="px-4 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 border-2"
                          style={{
                            borderColor: pharmacy.color,
                            color: pharmacy.color,
                          }}
                          whileHover={{ 
                            scale: 1.02, 
                            y: -2,
                            backgroundColor: `${pharmacy.color}10`,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <IoTimeOutline size={16} />
                            Hours
                          </div>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Additional Information Section */}
          <motion.div
            className="mt-16 w-full"
            variants={itemVariants}
          >
            <div
              className="bg-gradient-to-r from-[#F7941D]/10 to-[#2B2F92]/10 dark:from-[#F7941D]/20 dark:to-[#2B2F92]/20 rounded-3xl p-8 sm:p-12 border border-[#F7941D]/20 dark:border-[#2B2F92]/20"
            >
              <div className="text-center max-w-4xl mx-auto">
                <motion.div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{
                    background: "linear-gradient(135deg, #F7941D20 0%, #2B2F9220 100%)",
                    border: "2px solid #F7941D40",
                  }}
                >
                  <IoShieldCheckmarkOutline
                    size={40}
                    style={{
                      background: "linear-gradient(135deg, #F7941D 0%, #2B2F92 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  />
                </motion.div>
                <h3
                  className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4"
                  style={{
                    background: "linear-gradient(135deg, #F7941D 0%, #2B2F92 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Confidential & Professional
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                  Our pharmacy services prioritize your privacy and well-being. All consultations are confidential, 
                  and our professional pharmacists are trained to provide non-judgmental support for your 
                  sexual and reproductive health needs. Access quality products and expert guidance in a safe environment.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Pharmacy;
