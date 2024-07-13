import "./userNavbar.css";
import logo from "../../assets/LOGO FULL.png";
import { Link } from "react-router-dom";
import OffCanvasButton from "../../components/offCanvas";
import { useNavigate } from "react-router-dom";
import { Dropdown, Space, Menu } from "antd";
import { ChatState } from "../../components/Context/chatProvider";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

const UserNavbar = () => {
  const { user, logoutHandler } = ChatState();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate()

  const items = [
    {
      key: "1",
      label: <Link to="/profile">change profile picture</Link>,
    },
    {
      key: "2",
      label: (
        <Link onClick={() => logoutHandler()} to="/login">
          logout
        </Link>
      ),
    },
  ];

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light "
      style={{
        height: "95px",
        marginTop: "0",
        padding: "0",
        boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.2)",
        background: "#B8C2D7",
      }}
    >
      <div className="container-fluid px-10">
        <div className="navbar-brand" to="" onClick={()=>{navigate("/profile")}}>
          <img src={logo} className="img-fluid1  h-20 " alt="Logo" />
        </div>


        <div className={
          showMenu ?
        "tablet-menu w-[80%] tablet:[w-50%] items-center translate-x-[0px] h-[100vh] absolute top-2 right-[-40px] p-10 px-24 z-3 bg-white transition-all border border-gray-400 flex  justify-start flex-col":
          "tablet-menu w-[80%] tablet:[w-50%]  translate-x-[9999px] h-[100vh] absolute top-2 right-10 p-10 px-24 z-3 bg-white transition-all border border-gray-400 flex items-start justify-start flex-col"}>
          <div onClick={()=>{setShowMenu(false)}} className="hover:bg-gray-200 p-2 rounded-full self-end mr-[-30px] ">
          <IoClose className="text-xl   transition-all " />
          </div>
           <div className="links flex flex-col items-start justify-start  gap-3 my-5 w-full">
          <Link className="nav-link text-black text-sm" to="/chats">Chats</Link>
          <Link className="nav-link text-black text-sm" to="/game" >Game</Link>
          <div className="nav-link text-black text-sm relative group w-full" to="/services">
          <p>Services</p>
          <div className="hidden absolute left-[-20%] w-[70%] group-hover:flex flex-col gap-2 bg-white border border-l-gray-500 rounded p-2  transition-all shadow-md">
          <Link className="nav-link text-black text-sm p-1 rounded hover:bg-gray-100" to="/hospital" >Hospital</Link>
          <Link className="nav-link text-black text-sm p-1 rounded hover:bg-gray-100" to="/services" >Health Center</Link>
          <Link className="nav-link text-black text-sm p-1 rounded hover:bg-gray-100" to="/pharmacy" >Pharmacy</Link>

          </div>
          </div>
          <Link className="nav-link text-black text-sm" to="/news">News</Link>
        </div>
        
        <div className="links flex flex-col items-start justify-start  gap-1 my-2">
        <Link  onClick={() => logoutHandler()}  to="/login" className="px-4 py-2 w-full bg-blue-400 hover:bg-blue-600 rounded-md">Logout</Link>
        </div>

        </div>
        <div className="hidden tablet:flex items-center gap-3">
   
              <Link to="/home" className="nav-link mx-3">
                UPDATES
              </Link>
              <Link to="/consultation" className="nav-link mx-3">
                OUR TEAM
              </Link>

              <Link to="/menu" className="nav-link mx-3">
                Menu
              </Link>

        </div>

        <div className="hidden tablet:flex items-center gap-3"> 
        {user && <h5 className="mb-0 me-3">{user?.name}</h5>}

        <Link className=" hidden tablet:flex iconn" style={{ textDecoration: "none" }}>
              <>
                <Dropdown
                  overlay={
                    <Menu>
                      {items.map((item) => (
                        <Menu.Item key={item.key} icon={item.icon}>
                          {item.label}
                        </Menu.Item>
                      ))}
                    </Menu>
                  }
                >
                  <a
                    onClick={(e) => e.preventDefault()}
                    className="iconn"
                    style={{ textDecoration: "none" }}
                  >
                    <Space>
                      <img
                        src={user?.pic}
                        alt="Profile Avatar"
                        className="rounded-circle"
                        style={{ width: "60px", height: "60px" }}
                      />
                    </Space>
                  </a>
                </Dropdown>
              </>
            </Link>
        </div>
        <div className="flex tablet:hidden  p-1 border mx-10 border-gray-400 rounded-md" onClick={()=>{setShowMenu(true)}}>
         <GiHamburgerMenu className="text-3xl text-gray-500"/>
      </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
