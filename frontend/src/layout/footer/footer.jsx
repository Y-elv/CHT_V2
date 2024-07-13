import { Link } from "react-router-dom";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import "./footer.css";
import logo from "../../assets/LOGO FULL.png";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { MdLocationPin } from "react-icons/md";

const Footer = () => {
  return (
    <div className="footer">
      <div className="logo-sec">
        <img src={logo} alt="Logo" />
      </div>
      <div className="bg-neutral-400 h-[0.5px] w-[80%] mx-auto my-3"></div>

      <div className="flex flex-wrap items-start gap-5 w-[90%] mx-auto tablet:justify-between mb-5" >
        <div className="p-2 flex flex-col rounded w-[45%] tablet:w-[16%] gap-3 ">
          <h3 className=" text-sm font-normal my-2 text-white">Reach us</h3>
          <div className="flex items-center gap-2">
          <FaPhoneAlt className="text-neutral-500 text-base"/>
          <p className="text-neutral-500 text-xs font-light hover:text-neutral-300 cursor-pointer">+250789287267</p>
          </div>
          <div className="flex items-center gap-2">
          <IoMail className="text-neutral-500 text-base"/>
          <p className="text-neutral-500 text-xs font-light hover:text-neutral-300 cursor-pointer">info@kundwahealth.org</p>
          </div>

          <div className="flex items-center gap-2 w-full">
          <MdLocationPin className="text-neutral-500 text-base"/>
          <div className="flex flex-col  w-full">
          <p className="text-neutral-500 text-xs font-light hover:text-neutral-300 cursor-pointer">  Gatsibo District </p>         
          <p className="text-neutral-500 text-xs font-light hover:text-neutral-300 cursor-pointer">  Eastern province Rwanda </p>
          </div>
          </div>
         
           
        </div>
        <div className="p-2 flex flex-col rounded w-[45%] tablet:w-[12%] gap-1">
          <h3 className="my-2 text-white">Partners</h3>
          <p className="text-neutral-500 text-sm font-light hover:text-neutral-300 cursor-pointer">UNFPA</p>
          <p className="text-neutral-500 text-sm font-light hover:text-neutral-300 cursor-pointer">HDI</p>
          <p className="text-neutral-500 text-sm font-light hover:text-neutral-300 cursor-pointer">HOSPITALS</p>
        </div>
        <div className="p-2 flex flex-col rounded w-[45%] tablet:w-[12%] gap-1">
          <h3 className="my-2 text-white">Legal</h3>
          <p className="text-neutral-500 text-sm font-light hover:text-neutral-300 cursor-pointer">Privacy policy</p>
          <p className="text-neutral-500 text-sm font-light hover:text-neutral-300 cursor-pointer">Terms & Services</p>
          <p className="text-neutral-500 text-sm font-light hover:text-neutral-300 cursor-pointer">Terms of Use</p>
          <p className="text-neutral-500 text-sm font-light hover:text-neutral-300 cursor-pointer">Refund Policy</p>
        </div>
        <div className="p-2 flex flex-col rounded w-[45%] tablet:w-[12%] gap-1">
          <h3 className="my-2 text-white">Quick Links</h3>
          <Link to="#"className="text-neutral-500 text-sm font-light hover:text-neutral-300 cursor-pointer">Talk to us</Link>
          <Link to="#"className="text-neutral-500 text-sm font-light hover:text-neutral-300 cursor-pointer">Peers</Link>
          <Link to="#"className="text-neutral-500 text-sm font-light hover:text-neutral-300 cursor-pointer">Meet up</Link>
        </div>
        <div className="p-4 w-[100%] tablet tablet:w-3/12  rounded flex flex-col gap-2 bg-neutral-900" style={{padding:"30px", color:"white"}}>
          <h5 className="my-2 text-white">Join Our Newsletter</h5>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Your email address"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              className="text-xs"
            />
            <Button variant="outline-secondary" id="button-addon2" className="text-xs">
              Subscribe
            </Button>
          </InputGroup>
          <p className="text-neutral-500 text-sm font-light hover:text-neutral-300 cursor-pointer">
            Will send weekly updates for your <br />better personal management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
