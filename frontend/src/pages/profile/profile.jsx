import "./profile.css";
import logo from "../../assets/LOGO FULL.png";
import { Link } from "react-router-dom";
import consultation from "../../assets/consultation.png";
import chat from "../../assets/chats.png";
import notification from "../../assets/notification.png";
import menu from "../../assets/menu.png";
import gameIcon from "../../assets/gameIcon.png";
import logoutcurve from "../../assets/logoutcurve.png";

import { ChatState } from "../../components/Context/chatProvider";
import { useContext, useState, useEffect } from "react";
import ProfileNavbar from "../../components/profileNavbar/profileNavbar";
import { Dropdown, Space, Menu } from "antd";

const Profile = () => {
  const { user, logoutHandler } = ChatState();
  console.log("User in Profile:", user);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleImageClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

   const postDetails = (pics) => {
     setLoading(true);

     if (pics === undefined) {
       toast({
         title: "Please select Image!",
         status: "warning",
         duration: 5000,
         isClosable: true,
         position: "bottom",
       });
       return;
     }

     if (pics.type === "image/jpeg" || pics.type === "image/png") {
       const data = new FormData();
       data.append("file", pics);
       data.append("upload_preset", "chat-app");
       data.append("cloud_name", "dmzieqsir");

       fetch("https://api.cloudinary.com/v1_1/dmzieqsir/image/upload", {
         method: "post",
         body: data,
       })
         .then((res) => res.json())
         .then((data) => {
           setPic(data.url.toString());
           setLoading(false);
         })
         .catch((err) => {
           console.log(err);
           setLoading(false);

           console.log("Image URL:", data.url);
         });
     }
     else{
        toast({
          title: "Please select Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false)
        return;
     }
   };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const items = [
    {
      key: "1",
      label: <Link to="/services">Counseling and Therapy</Link>,
    },
    {
      key: "2",
      label: <Link to="/services">Mental Health</Link>,
    },
    {
      key: "3",
      label: <Link to="/services">Sexual Advices</Link>,
    },
  ];

  return (
    <>
      {isMobile ? (
        <>
          <ProfileNavbar />
          <div className="profile-right">
            <div className="welcome-text">Welcome to FH D</div>
            <div className="user-box-container">
              <div className="user-box">
                <div className="profile-image-container">
                  <div>
                    {user && (
                      <>
                        {console.log("User profile picture:", user?.pic)}
                        <img
                          src={selectedImage || user.pic}
                          onClick={handleImageClick}
                        />
                      </>
                    )}

                    {isPopupOpen && (
                      <div className="popup">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <button onClick={handlePopupClose}>Close</button>
                      </div>
                    )}
                  </div>

                  <div>
                    {user && (
                      <div className="username-sec">Welcome {user?.name}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="profile-sec">
          <div className="profile-left">
            <div className="profile-contents">
              <div className="logo">
                <img src={logo} />
              </div>
              <div className="content-menu">
                <Link
                  to="/consultation"
                  className="iconn"
                  style={{ textDecoration: "none" }}
                >
                  <img src={consultation} className="icons" />
                  <p>Consultation</p>
                </Link>
                <Link
                  to="/chats"
                  className="iconn"
                  style={{ textDecoration: "none" }}
                >
                  <img src={chat} className="icons" />
                  <p>Chats</p>
                </Link>
                <Link
                  to="/game"
                  className="iconn"
                  style={{ textDecoration: "none" }}
                >
                  <img src={gameIcon} className="icons" />
                  <p>Game</p>
                </Link>
                <Link className="iconn" style={{ textDecoration: "none" }}>
                  <img src={menu} className="icons" />
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
                          <p>Services</p>
                        </Space>
                      </a>
                    </Dropdown>
                  </>
                </Link>
                <Link
                  to="/news"
                  className="iconn"
                  style={{ textDecoration: "none" }}
                >
                  <img src={notification} className="icons" />
                  <p> News</p>
                </Link>
                {user && (
                  <Link
                    onClick={() => logoutHandler()}
                    to="/login"
                    className="iconn"
                    style={{ textDecoration: "none" }}
                  >
                    <img src={logoutcurve} className="icons" />
                    <p>Sign Out</p>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="profile-right">
            <div className="welcome-text">Welcome to FH D</div>
            <div className="user-box-container">
              <div className="user-box">
                <div className="profile-image-container">
                  <div>
                    {user && (
                      <>
                        {console.log("User profile picture:", user?.pic)}
                        <img
                          src={selectedImage || user.pic}
                          onClick={handleImageClick}
                        />
                      </>
                    )}

                    {isPopupOpen && (
                      <div className="popup">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <button onClick={handlePopupClose}>Close</button>
                      </div>
                    )}
                  </div>

                  <div>
                    {user && (
                      <div className="username-sec">Welcome {user?.name}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
