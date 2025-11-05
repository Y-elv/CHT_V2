import "./cardProf.css";
import { motion } from "framer-motion";
import { IoMailOutline, IoCallOutline } from "react-icons/io5";

const CardProf = ({ imgName }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 40, rotateY: -10, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18,
        duration: 0.5,
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -8,
      rotateY: 4,
      scale: 1.02,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  return (
    <>
      <motion.div
        className="whole-card-cons"
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        whileHover="hover"
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      >
        <motion.div className="card-surface" variants={hoverVariants}>
          <div className="avatar-wrap">
            <motion.div className="avatar-ring">
              <img src={imgName} alt="Doctor" className="avatar-img" />
            </motion.div>
          </div>
          <div className="texts-card">
            <div className="text-inside">
              <h4 className="doc-name">Luke Belmar</h4>
              <p className="doc-desc">
                I provide a safe and confidential space to discuss your
                thoughts, emotions, and challenges. Together, we’ll work on
                developing coping strategies and managing stress.
              </p>
              <div className="contact-row">
                <div className="contact-item">
                  <IoMailOutline className="contact-icon mail" />
                  <span className="contact-text">doctor@example.com</span>
                </div>
                <div className="contact-item">
                  <IoCallOutline className="contact-icon phone" />
                  <span className="contact-text">+250 788 000 000</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default CardProf;
