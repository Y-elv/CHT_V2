import "./navbar.css";
import logo from "../../assets/LOGO FULL.png";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";

const Navbar = ({active}) => {

  const [showMenu, setShowMenu] = useState(false)
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-[#B8C2D7] px-10 py-2">
      <div className="container-fluid relative">
        <Link className="navbar-brand" to="/home">
          <img src={logo} className="img-fluid w-24 " alt="Logo" />
        </Link>

        <div
          className={
            showMenu
              ? "tablet-menu translate-x-[0px] h-[100vh] absolute top-2 right-[-40px] p-10 px-24 z-3 bg-white transition-all border border-gray-400 flex items-start justify-start flex-col"
              : "tablet-menu translate-x-[9999px] h-[100vh] absolute top-2 right-10 p-10 px-24 z-3 bg-white transition-all border border-gray-400 flex items-start justify-start flex-col"
          }
        >
          <div
            onClick={() => {
              setShowMenu(false);
            }}
            className="hover:bg-gray-200 p-2 rounded-full self-end mr-[-30px] "
          >
            <IoClose className="text-xl   transition-all " />
          </div>
          <div className="links flex flex-col items-start justify-start  gap-3 my-5 ">
            <Link className="nav-link text-black" to="/updates">
              Updates
            </Link>
            <Link
              className="nav-link text-black"
              to="/our-team"
              style={{ color: active == "ourTeam" ? "orange" : "red" }}
            >
              Our Team
            </Link>
            <Link className="nav-link text-black" to="/menu">
              Menu
            </Link>
          </div>

          <div className="links flex flex-col items-start justify-start  gap-1 my-2">
            <Link
              to="/login"
              className="px-4 py-2 w-full bg-orange-400 hover:bg-orange-600 rounded-md"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 w-full bg-blue-500 hhover:bg-blue-700 transition rounded-md"
            >
              Signup
            </Link>
          </div>
        </div>
        <div className=" hidden tablet:flex items-center justify-center gap-5">
          <Link className="nav-link" to="/updates">
            Updates
          </Link>
          <Link className="nav-link" to="/our-team">
            Our Team
          </Link>
          <Link className="nav-link" to="/menu">
            Menu
          </Link>
        </div>

        <div className=" mx-3 hidden tablet:flex flex-row items-center justify-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 bg-orange-400 hover:bg-orange-600 rounded-full"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-blue-400 hover:bg-blue-600 rounded-full"
          >
            Signup
          </Link>
        </div>
        <div
          className="flex tablet:hidden  p-1 border mx-10 border-gray-400 rounded-md"
          onClick={() => {
            setShowMenu(true);
          }}
        >
          <GiHamburgerMenu className="text-3xl text-gray-500" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

