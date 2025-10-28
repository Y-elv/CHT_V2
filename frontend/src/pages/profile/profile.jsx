import "./profile.css";
import logo from "../../assets/LOGO FULL.png";
import { Link, useLocation } from "react-router-dom";
import { ChatState } from "../../components/Context/chatProvider";
import { useContext, useState, useEffect } from "react";
import { Dropdown, Space, Menu } from "antd";
import { useToast } from "@chakra-ui/react";
import UserNavbar from "../../layout/userNavbar/userNavbar";
import {
  IoChatboxOutline,
  IoLogOut,
  IoNewspaperOutline,
} from "react-icons/io5";
import { RiGamepadLine } from "react-icons/ri";
import { MdMiscellaneousServices } from "react-icons/md";
import { useBadgeStore } from "../../zustandStore/store";
import consultation from "../../assets/consultation.png";
import { FaUserMd } from "react-icons/fa";

const Profile = () => {
  const { user, logoutHandler } = ChatState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [myUser, setMyUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const profile = useBadgeStore((state) => state.profile) || null;
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [pic, setPic] = useState();

  console.log("Zustand profile: ", profile);

  console.log("User Info from localStorage yyy:", user);
  const getUser = async () => {
    if (!profile) {
      setMyUser(user);
    }

    setMyUser(profile);
  };

  useEffect(() => {
    getUser();
  }, []);

  console.log("User in setUser:", myUser);
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
        description: "Please select an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (pics?.type !== "image/jpeg" && pics?.type !== "image/png") {
      toast({
        description: "Please select a valid image (JPEG or PNG)!",
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
      const user = await JSON.parse(localStorage.getItem("userInfo"));
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
        description: "Profile picture updated!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);

      // Extract error message from the API response
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while uploading the image.";

      toast({
        description: errorMessage,
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
                    {/* {user && ( */}
                    <>
                      {console.log("User profile picture:", myUser?.pic)}
                      <img
                        src={selectedImage ? selectedImage : myUser?.pic}
                        onClick={handleImageClick}
                      />
                    </>
                    {/* )} */}

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
                    {/* {profile && ( */}
                    <div className="username-sec">Welcome {profile?.name}</div>
                    {/* )} */}
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
                <img src={logo} className="h-20 " />
              </div>
              <div className="content-menu my-5 flex flex-col items-start">
                <Link
                  to="/consultation"
                  className="iconn flex items-center justify-center gap-3 p-2 px-3 rounded hover:bg-[#F95700FF]"
                  style={{ textDecoration: "none" }}
                >
                  <FaUserMd className="text-2xl" />
                  <p>Consultation</p>
                </Link>
                <Link
                  to="/chats"
                  className="iconn flex items-center justify-center gap-3 p-2 px-3 rounded hover:bg-[#F95700FF]"
                  style={{ textDecoration: "none" }}
                >
                  {/* <img src={chat} className="icons" /> */}
                  <IoChatboxOutline className="text-2xl" />
                  <p>Chats</p>
                </Link>
                <Link
                  to="/game"
                  className="iconn flex items-center justify-center gap-3 p-2 px-3 rounded hover:bg-[#F95700FF]"
                  style={{ textDecoration: "none" }}
                >
                  <RiGamepadLine className="text-2xl" />
                  <p>Game</p>
                </Link>
                {/* <Link
                  className="iconn flex items-center justify-center gap-3 p-2 px-3 rounded hover:bg-white"
                  to="/services"
                  style={{ textDecoration: "none" }}
                >
                  <MdMiscellaneousServices className="text-2xl" />
                 
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
                        className="iconn flex items-center justify-center gap-3 p-2 px-3 rounded hover:bg-white"
                        style={{ textDecoration: "none" }}
                      >
                        <Space>
                          <p>Services</p>
                        </Space>
                      </a>
                    </Dropdown>
                  </>
                </Link> */}

                <Link
                  to="/news"
                  className="iconn flex items-center justify-center gap-3 p-2 px-3 rounded hover:bg-[#F95700FF]"
                  style={{ textDecoration: "none" }}
                >
                  <IoNewspaperOutline className="text-2xl" />
                  <p> News</p>
                </Link>
                {profile && (
                  <Link
                    onClick={() => logoutHandler()}
                    to="/login"
                    className="iconn flex items-center justify-center gap-3 p-2 px-3 rounded hover:bg-[#F95700FF]"
                    style={{ textDecoration: "none" }}
                  >
                    <IoLogOut className="text-2xl" />
                    <p className="text-xs">Sign Out</p>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="profile-right">
            <div className="welcome-text">Welcome to FH D</div>
            <div className="user-box-container">
              <div className="user-box">
                <div className="profile-image-container ">
                  <div>
                    {profile && (
                      <>
                        {console.log("User profile picture:", profile?.pic)}
                        <img
                          src={selectedImage ? selectedImage : profile?.pic}
                          onClick={handleImageClick}
                          className="object-cover w-32 h-32 rounded-full"
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
                    {profile && (
                      <div className="username-sec">
                        Welcome {profile?.name}
                      </div>
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
