import "./navbar.css";
import logo from "../../assets/LOGO FULL.png";
import { Link } from "react-router-dom";
import OffCanvasButton from "../offCanvas";

const Navbar = () => {
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
        <OffCanvasButton />
        <div className="collapse navbar-collapse d-flex justify-content-end" id="navbarNav">
         
          <ul className="navbar-nav ml-auto">
            <li className="nav-item d-none d-lg-block">
              <Link
                to="/login"
                className="btn btn-primary mx-2"
                style={{ backgroundColor: "#F3931E", color: "black" }}
              >
                Log in
              </Link>
            </li>
            <li className="nav-item d-none d-lg-block">
              <Link
                to="/register"
                className="btn btn-primary mx-2"
                style={{ backgroundColor: "#1E66F3", color: "black" }}
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

