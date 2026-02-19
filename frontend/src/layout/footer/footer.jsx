import { Link } from "react-router-dom";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import "./footer.css";
import logo from "../../assets/LOGO FULL.png";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { MdLocationPin } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="logo-sec">
        <img src={logo} alt="Kundwa Health logo" />
      </div>

      <div className="footer-line bg-neutral-400 h-[0.5px] w-[80%] mx-auto my-3"></div>

      <div className="footer-sections flex flex-wrap items-start gap-5 w-[90%] mx-auto tablet:justify-between mb-5">
        {/* Reach us */}
        <div className="reach-sec p-2 flex flex-col rounded w-[45%] tablet:w-[16%] gap-3">
          <h3 className="text-sm font-semibold my-2 text-white tracking-wide">
            Reach us
          </h3>
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-neutral-400 text-base" />
            <p className="text-neutral-400 text-xs font-light hover:text-neutral-200 cursor-pointer">
              +250 789 287 267
            </p>
          </div>
          <div className="flex items-center gap-2">
            <IoMail className="text-neutral-400 text-base" />
            <p className="text-neutral-400 text-xs font-light hover:text-neutral-200 cursor-pointer">
              info@kundwahealth.org
            </p>
          </div>
          <div className="flex items-center gap-2 w-full">
            <MdLocationPin className="text-neutral-400 text-base" />
            <div className="flex flex-col w-full">
              <p className="text-neutral-400 text-xs font-light hover:text-neutral-200 cursor-pointer">
                Gatsibo District
              </p>
              <p className="text-neutral-400 text-xs font-light hover:text-neutral-200 cursor-pointer">
                Eastern Province, Rwanda
              </p>
            </div>
          </div>
        </div>

        {/* Partners */}
        <div className="partners-sec p-2 flex flex-col rounded w-[45%] tablet:w-[12%] gap-1">
          <h3 className="my-2 text-white font-semibold tracking-wide">Partners</h3>
          <p className="text-neutral-400 text-sm font-light hover:text-neutral-200 cursor-pointer">
            UNFPA
          </p>
          <p className="text-neutral-400 text-sm font-light hover:text-neutral-200 cursor-pointer">
            HDI
          </p>
          <p className="text-neutral-400 text-sm font-light hover:text-neutral-200 cursor-pointer">
            Hospitals
          </p>
        </div>

        {/* Legal */}
        <div className="legal-sec p-2 flex flex-col rounded w-[45%] tablet:w-[12%] gap-1">
          <h3 className="my-2 text-white font-semibold tracking-wide">Legal</h3>
          <p className="text-neutral-400 text-sm font-light hover:text-neutral-200 cursor-pointer">
            Privacy Policy
          </p>
          <p className="text-neutral-400 text-sm font-light hover:text-neutral-200 cursor-pointer">
            Terms &amp; Services
          </p>
          <p className="text-neutral-400 text-sm font-light hover:text-neutral-200 cursor-pointer">
            Terms of Use
          </p>
          <p className="text-neutral-400 text-sm font-light hover:text-neutral-200 cursor-pointer">
            Refund Policy
          </p>
        </div>

        {/* Quick Links */}
        <div className="quick-sec p-2 flex flex-col rounded w-[45%] tablet:w-[12%] gap-1">
          <h3 className="my-2 text-white font-semibold tracking-wide">
            Quick Links
          </h3>
          <Link
            to="#"
            className="text-neutral-400 text-sm font-light hover:text-neutral-200 cursor-pointer"
          >
            Talk to us
          </Link>
          <Link
            to="#"
            className="text-neutral-400 text-sm font-light hover:text-neutral-200 cursor-pointer"
          >
            Peers
          </Link>
          <Link
            to="#"
            className="text-neutral-400 text-sm font-light hover:text-neutral-200 cursor-pointer"
          >
            Meet up
          </Link>
        </div>

        {/* Newsletter */}
        <div className="newsletter-sec p-4 w-[100%] tablet:w-3/12 rounded flex flex-col gap-3">
          <h5 className="my-1 text-white font-semibold tracking-wide">
            Join our newsletter
          </h5>
          <p className="newsletter-p text-xs mb-1">
            Get weekly updates and resources to support your wellbeing.
          </p>
          <InputGroup className="mb-2 newsletter-group">
            <FormControl
              type="email"
              placeholder="Your email address"
              aria-label="Newsletter email"
              aria-describedby="button-addon2"
              className="text-xs newsletter-input"
            />
            <Button
              variant="outline-secondary"
              id="button-addon2"
              className="text-xs newsletter-button"
            >
              Subscribe
            </Button>
          </InputGroup>
          <p className="newsletter-p text-xs">
            We respect your privacy. No spam, only helpful content.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
