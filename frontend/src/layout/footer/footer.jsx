import { Link } from "react-router-dom";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import "./footer.css";
import logo from "../../assets/LOGO FULL.png";

const Footer = () => {
  return (
    <div className="footer">
      <div className="logo-sec">
        <img src={logo} alt="Logo" />
      </div>
      <div className="footer-line"></div>

      <div className="footer-sections">
        <div className="reach-sec">
          <h3>Reach us</h3>
          <p>+250789287267</p>
          <p>info@kundwahealth.org</p>
          <p>
            Gatsibo District <br />
            Eastern province Rwanda
          </p>
        </div>
        <div className="partners-sec">
          <h3>Partners</h3>
          <p>UNFPA</p>
          <p>HDI</p>
          <p>HOSPITALS</p>
        </div>
        <div className="legal-sec">
          <h3>Legal</h3>
          <p>Privacy policy</p>
          <p>Terms & Services</p>
          <p>Terms of Use</p>
          <p>Refund Policy</p>
        </div>
        <div className="quick-sec">
          <h3>Quick Links</h3>
          <Link to="#">Talk to us</Link>
          <Link to="#">Peers</Link>
          <Link to="#">Meet up</Link>
        </div>
        <div className="newsletter-sec">
          <h5>Join Our Newsletter</h5>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Your email address"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
            />
            <Button variant="outline-secondary" id="button-addon2">
              Subscribe
            </Button>
          </InputGroup>
          <p className="newsletter-p">
            Will send weekly updates for your <br />better personal management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
