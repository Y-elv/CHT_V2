
import logo from "../../assets/LOGO FULL.png";
import { Link } from "react-router-dom";
import OffCanvasProfile from "./offcanvasprofile";
import { ChatState } from "../Context/chatProvider";
import { useContext } from "react";

const ProfileNavbar = () => {
  const { user } = ChatState();
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-light"
      style={{
        height: "95px",
        marginTop: "0",
        padding: "0",
        boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">
          <img src={logo} className="img-fluid" alt="Logo" />
        </Link>
        <OffCanvasProfile/>
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link to="/consultation" className="nav-link mx-3">
              Consultation
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/chats" className="nav-link mx-3">
                Chat
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/services" className="nav-link mx-3">
               Services
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/news" className="nav-link mx-3">
               News
              </Link>
            </li>
            <li className="nav-item">
              <Link 
              // onClick={() => logoutUser()}  to="/login" 
              className="nav-link mx-3">
               Sign Out
              </Link>
            </li>
          </ul>
          
        </div>
      </div>
    </nav>
  );
};

export default ProfileNavbar;
