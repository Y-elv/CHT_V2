import React from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../layout/footer/footer";
import { motion } from "framer-motion";
import { 
  IoLocationOutline, 
  IoMailOutline, 
  IoCallOutline, 
  IoMedicalOutline,
  IoHeartOutline,
  IoShieldCheckmarkOutline,
  IoPeopleOutline
} from "react-icons/io5";

function ServicesPage() {
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

  const servicesData = [
    {
      id: 1,
      title: "Rugarama Health Center",
      location: "Burera District",
      email: "butaro.hospital@moh.gov.rw",
      phone: "0788331114",
      description: "Rugarama Health Center in Northern Rwanda's Burera District offers vital sexual and reproductive health services tailored for youth. Our dedicated team provides comprehensive care, including counseling, screenings, and education on family planning, STIs, and reproductive rights. We prioritize confidentiality, respect, and accessibility to ensure every young person receives the support they need for a healthy future.",
      icon: IoHeartOutline,
      color: "#F7941D",
      features: ["Confidential Counseling", "STI Screening", "Family Planning", "Youth-Friendly Services"]
    },
    {
      id: 2,
      title: "Kabarore Health Center",
      location: "Gatsibo District",
      email: "kiziguro.hospital.hospital@moh.gov.rw",
      phone: "0788329851",
      description: "Kabarore Health Center, situated in Eastern Province's Gatsibo District, Kabarore Sector, is dedicated to delivering essential sexual and reproductive health services tailored for youth. Our compassionate team provides a wide range of services including counseling, screenings, and education on family planning, STIs, and reproductive rights.",
      icon: IoMedicalOutline,
      color: "#2B2F92",
      features: ["Comprehensive Care", "Educational Programs", "Confidential Services", "Professional Staff"]
    },
    {
      id: 3,
      title: "Kiziguro Health Center",
      location: "Gatsibo District",
      email: "kiziguro.hospital.hospital@moh.gov.rw",
      phone: "0788329851",
      description: "Kiziguro Health Center, nestled in Eastern Province's Gatsibo District, Kiziguro Sector, specializes in empowering youth through comprehensive sexual and reproductive health services. Our dedicated team offers confidential consultations, screenings, and education on family planning, STIs, and reproductive health rights.",
      icon: IoShieldCheckmarkOutline,
      color: "#F7941D",
      features: ["Youth Empowerment", "Confidential Consultations", "Health Education", "Supportive Environment"]
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
              Our Services
            </motion.h2>
            <motion.p
              className="text-center text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Comprehensive healthcare services tailored for youth wellness and reproductive health
            </motion.p>
          </motion.div>

          {/* Services Cards Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 w-full"
            variants={containerVariants}
          >
            {servicesData.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
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
                        background: `linear-gradient(90deg, ${service.color} 0%, ${service.color}CC 100%)`,
                      }}
                    />

                    <div className="p-6 sm:p-8">
                      {/* Icon Section */}
                      <motion.div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                        style={{
                          background: `linear-gradient(135deg, ${service.color}20 0%, ${service.color}10 100%)`,
                          border: `2px solid ${service.color}40`,
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Icon
                          size={32}
                          style={{ color: service.color }}
                        />
                      </motion.div>

                      {/* Content */}
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                        {service.title}
                      </h3>

                      <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                        {service.description}
                      </p>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {service.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: service.color }}
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
                            style={{ color: service.color }}
                          />
                          <span>{service.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <IoMailOutline
                            size={16}
                            style={{ color: service.color }}
                          />
                          <span className="truncate">{service.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <IoCallOutline
                            size={16}
                            style={{ color: service.color }}
                          />
                          <span>{service.phone}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <motion.button
                        className="w-full mt-6 px-4 py-3 rounded-xl font-semibold text-white text-sm sm:text-base transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}CC 100%)`,
                          boxShadow: `0 4px 12px ${service.color}40`,
                        }}
                        whileHover={{ 
                          scale: 1.02, 
                          y: -2,
                          boxShadow: `0 8px 20px ${service.color}60`,
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Contact Center
                      </motion.button>
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
                  <IoPeopleOutline
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
                  Youth-Friendly Healthcare
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                  Our health centers are committed to providing confidential, respectful, and accessible services 
                  tailored specifically for young people. We understand the unique challenges youth face and 
                  offer a safe, supportive environment where you can access quality healthcare without judgment.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default ServicesPage;
