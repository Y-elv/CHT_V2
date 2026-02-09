import React from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../layout/footer/footer";
import { motion } from "framer-motion";
import { 
  IoLocationOutline, 
  IoMailOutline, 
  IoCallOutline, 
  IoMedicalOutline,
  IoBedOutline,
  IoPeopleOutline,
  IoCarOutline,
  IoTimeOutline
} from "react-icons/io5";

function Hospital() {
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

  const hospitalData = [
    {
      id: 1,
      title: "Muhima Hospital",
      location: "Kigali City, Nyarugenge District, Muhima Sector",
      email: "muhima.hospital@moh.gov.rw",
      phone: "0784352617",
      description: "Muhima Hospital, a public healthcare facility in Nyarugenge District, City of Kigali, offers a wide range of medical services, including sexual reproductive health. Established in 2001 as an extension of Muhima Health Center, which dates back to 1988, the hospital was funded by World Bank's 'Santé Population' project.",
      icon: IoMedicalOutline,
      color: "#F7941D",
      features: ["127 Beds", "Emergency Services", "Maternity Care", "Surgical Services"],
      established: "2001",
      capacity: "127 beds"
    },
    {
      id: 2,
      title: "NGARAMA District Hospital",
      location: "Gatsibo District, Eastern Province, Rwanda",
      email: "ngarama.hospital.moh.gov.rw",
      phone: "0785398394",
      description: "NGARAMA District Hospital, situated in Gatsibo district, Eastern Province, Rwanda, is a public hospital established in 1982 with support from Dutch state. Located 20 km from main Kigali-Kagitumba road and 172 km from Kigali city.",
      icon: IoBedOutline,
      color: "#2B2F92",
      features: ["127 Beds", "Outpatient Services", "Inpatient Care", "Regional Supervision"],
      established: "1982",
      capacity: "127 beds"
    },
    {
      id: 3,
      title: "Kiziguro District Hospital",
      location: "Gatsibo District, Eastern Province, Rwanda",
      email: "kiziguro.hospital.hospital@moh.gov.rw",
      phone: "0726903769, 0788329851",
      description: "Kiziguro District Hospital, established in 1985 by the Catholic Diocese of Byumba, serves as one of two hospitals in Gatsibo district, Rwanda. Located in the Eastern Province, it provides a range of services, including sexual reproductive health.",
      icon: IoPeopleOutline,
      color: "#F7941D",
      features: ["158 Beds", "12 Departments", "5 Ambulances", "500,000 Catchment"],
      established: "1985",
      capacity: "158 beds"
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
              Our Hospitals
            </motion.h2>
            <motion.p
              className="text-center text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Comprehensive healthcare facilities providing quality medical services across Rwanda
            </motion.p>
          </motion.div>

          {/* Hospital Cards Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 w-full"
            variants={containerVariants}
          >
            {hospitalData.map((hospital, index) => {
              const Icon = hospital.icon;
              return (
                <motion.div
                  key={hospital.id}
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
                        background: `linear-gradient(90deg, ${hospital.color} 0%, ${hospital.color}CC 100%)`,
                      }}
                    />

                    <div className="p-6 sm:p-8">
                      {/* Icon Section */}
                      <motion.div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                        style={{
                          background: `linear-gradient(135deg, ${hospital.color}20 0%, ${hospital.color}10 100%)`,
                          border: `2px solid ${hospital.color}40`,
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Icon
                          size={32}
                          style={{ color: hospital.color }}
                        />
                      </motion.div>

                      {/* Content */}
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                        {hospital.title}
                      </h3>

                      <div className="flex items-center gap-2 mb-4">
                        <IoTimeOutline
                          size={14}
                          style={{ color: hospital.color }}
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Established {hospital.established}
                        </span>
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                        {hospital.description}
                      </p>

                      {/* Features Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {hospital.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 rounded-lg px-3 py-2"
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: hospital.color }}
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
                            style={{ color: hospital.color }}
                          />
                          <span className="text-xs">{hospital.location}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <IoMailOutline
                            size={16}
                            style={{ color: hospital.color }}
                          />
                          <span className="truncate">{hospital.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <IoCallOutline
                            size={16}
                            style={{ color: hospital.color }}
                          />
                          <span>{hospital.phone}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6">
                        <motion.button
                          className="flex-1 px-4 py-3 rounded-xl font-semibold text-white text-sm sm:text-base transition-all duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${hospital.color} 0%, ${hospital.color}CC 100%)`,
                            boxShadow: `0 4px 12px ${hospital.color}40`,
                          }}
                          whileHover={{ 
                            scale: 1.02, 
                            y: -2,
                            boxShadow: `0 8px 20px ${hospital.color}60`,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <IoMedicalOutline size={16} />
                            Get Care
                          </div>
                        </motion.button>
                        <motion.button
                          className="px-4 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 border-2"
                          style={{
                            borderColor: hospital.color,
                            color: hospital.color,
                          }}
                          whileHover={{ 
                            scale: 1.02, 
                            y: -2,
                            backgroundColor: `${hospital.color}10`,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <IoCarOutline size={16} />
                            Emergency
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
                  <IoMedicalOutline
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
                  Quality Healthcare Access
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
                  Our hospital network provides comprehensive medical services including emergency care, 
                  maternity services, surgical procedures, and specialized treatments. With modern facilities 
                  and experienced medical professionals, we're committed to delivering quality healthcare 
                  accessible to all communities across Rwanda.
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

export default Hospital;
