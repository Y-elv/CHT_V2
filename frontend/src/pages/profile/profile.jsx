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
import { useToast } from "@chakra-ui/react";
import UserNavbar from "../../layout/userNavbar/userNavbar";

const Profile = () => {
  const { user, logoutHandler } = ChatState();
  console.log("User in Profile:", user);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [pic, setPic] = useState();

  const handleImageClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const postDetails = async (pics) => {
    setLoading(true);

    if (!pics) {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (pics.type !== "image/jpeg" && pics.type !== "image/png") {
      toast({
        title: "Please select a valid image (JPEG or PNG)!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "chat-app");
    data.append("cloud_name", "dmzieqsir");

    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const token = user.token;
      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dmzieqsir/image/upload",
        {
          method: "post",
          body: data,
        }
      );

      const cloudinaryData = await cloudinaryResponse.json();
      console.log("Image URL:", cloudinaryData.url);

      const updateApiUrl =
        "https://chtv2-bn.onrender.com/api/v2/user/updateProfile";

      const updateApiResponse = await fetch(updateApiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ pic: cloudinaryData.url }),
      });

      const updateApiData = await updateApiResponse.json();

      console.log("Update API Response:", updateApiData);

      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...user,
          pic: cloudinaryData.url,
        })
      );

      await setPic(cloudinaryData.url.toString());

      toast({
        title: "Profile picture updated!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "An error occurred while uploading the image.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    console.log("here is the file", file);
    setSelectedImage(file);
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
      label: <Link to="/hospital">Hospital</Link>,
    },
    {
      key: "2",
      label: <Link to="/services">Health Center</Link>,
    },
    {
      key: "3",
      label: <Link to="/pharmacy">Pharmacy</Link>,
    },
  ];

  return (
    <>
      {isMobile ? (
        <>
          <UserNavbar />
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
                          src={selectedImage ? selectedImage : user.pic}
                          onClick={handleImageClick}
                        />
                      </>
                    )}

                    {isPopupOpen && (
                      <div className="popup">
                        <input type="file" onChange={handleImageUpload} />
                        <button onClick={() => postDetails(selectedImage)}>
                          Upload
                        </button>
                        <span style={{ margin: "0 4px" }}></span>
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
                {/* <Link
                  to="/consultation"
                  className="iconn"
                  style={{ textDecoration: "none" }}
                >
                  <img src={consultation} className="icons" />
                  <p>Consultation</p>
                </Link> */}
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
                <Link
                  className="iconn"
                  to="/services"
                  style={{ textDecoration: "none" }}
                >
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
                          src={selectedImage ? selectedImage : user.pic}
                          onClick={handleImageClick}
                        />
                      </>
                    )}

                    {isPopupOpen && (
                      <div className="popup">
                        <input type="file" onChange={handleImageUpload} />
                        <button onClick={() => postDetails(selectedImage)}>
                          Upload
                        </button>
                        <span style={{ margin: "0 4px" }}></span>
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
