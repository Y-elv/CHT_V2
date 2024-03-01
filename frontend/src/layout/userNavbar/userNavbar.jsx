import "./userNavbar.css";
import logo from "../../assets/LOGO FULL.png";
import { Link } from "react-router-dom";
import OffCanvasButton from "../../components/offCanvas";
import profileAvatar from "../../assets/Profavatar.svg";
import { Dropdown, Space, Menu } from "antd";
import  {ChatState}  from "../../components/Context/chatProvider";
const UserNavbar = () => {
  // const { user, logoutUser } = useContext(AuthContext);
  const { user, logoutHandler } = ChatState();


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
      <div className="container-fluid">
        <Link className="navbar-brand" to="/profile">
          <img src={logo} className="img-fluid" alt="Logo" />
        </Link>
        <OffCanvasButton />
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link to="/home" className="nav-link mx-3">
                UPDATES
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/consultation" className="nav-link mx-3">
                OUR TEAM
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/menu" className="nav-link mx-3">
                Menu
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto d-flex align-items-center">
            {user && <h5 className="mb-0 me-3">{user?.name}</h5>}

            <Link className="iconn" style={{ textDecoration: "none" }}>
              
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
                        src={user.pic}
                        alt="Profile Avatar"
                        className="rounded-circle"
                        style={{ width: "60px", height: "60px" }}
                      />
                    </Space>
                  </a>
                </Dropdown>
              </>
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
