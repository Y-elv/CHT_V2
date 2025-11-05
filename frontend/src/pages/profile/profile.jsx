import "./profile.css";
import { Link, useLocation } from "react-router-dom";
import { ChatState } from "../../components/Context/chatProvider";
import { useState, useEffect } from "react";
import { useToast, Avatar, Box } from "@chakra-ui/react";
import Navbar from "../../components/navbar/navbar";
import {
  IoChatboxOutline,
  IoLogOut,
  IoNewspaperOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { RiGamepadLine } from "react-icons/ri";
import { useBadgeStore } from "../../zustandStore/store";
import { FaUserMd } from "react-icons/fa";
import { motion } from "framer-motion";

const Profile = () => {
  const { user, logoutHandler } = ChatState();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [myUser, setMyUser] = useState(null);
  const profile = useBadgeStore((state) => state.profile) || null;
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [pic, setPic] = useState();
  const location = useLocation();

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

  const displayUser = profile || user || myUser;
  const userName = displayUser?.name || "User";
  const userPic = displayUser?.pic || "";

  const sidebarItems = [
    { to: "/consultation", label: "Consultation", icon: FaUserMd },
    { to: "/chats", label: "Chats", icon: IoChatboxOutline },
    { to: "/game", label: "Game", icon: RiGamepadLine },
    { to: "/news", label: "News", icon: IoNewspaperOutline },
    { to: "/profile", label: "Settings", icon: IoSettingsOutline },
    { label: "Sign Out", icon: IoLogOut, isLogout: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
        <div className="flex h-[calc(100vh-80px)] overflow-hidden pb-0">
          {/* Sidebar - Hidden on mobile, visible on lg+ */}
          <aside className="hidden lg:flex w-64 bg-white dark:bg-slate-800 shadow-lg border-r border-slate-200 dark:border-slate-700 flex-shrink-0 h-[calc(100vh-80px)] overflow-y-auto">
            <div className="w-full h-full flex flex-col p-6">
              {/* Navigation Links */}
              <nav className="flex-1 space-y-2 pt-4">
                {sidebarItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActiveLink = !item.isLogout && isActive(item.to);

                  if (item.isLogout) {
                    return (
                      <motion.button
                        key={item.label}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (logoutHandler) {
                            logoutHandler();
                          }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Icon className="text-2xl" />
                        <span>{item.label}</span>
                      </motion.button>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActiveLink
                          ? "bg-gradient-to-r from-[#F7941D] to-[#FFA84D] text-white shadow-lg"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-[#F7941D] dark:hover:text-[#F7941D]"
                      }`}
                    >
                      <Icon className="text-2xl" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto pb-0">
            <div className="max-w-7xl mx-auto p-6 lg:p-8 pb-0">
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <Avatar
                      src={selectedImage ? URL.createObjectURL(selectedImage) : userPic}
                      name={userName}
                      size="xl"
                      border="4px solid"
                      borderColor="#F7941D"
                      boxShadow="0 4px 12px rgba(247, 148, 29, 0.3)"
                      className="cursor-pointer"
                      onClick={handleImageClick}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#F7941D] text-white rounded-full p-1.5 cursor-pointer hover:bg-[#FFA84D] transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                      Welcome {userName}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                      Manage your profile and preferences
                    </p>
                  </div>
                </div>

                {/* Image Upload Popup */}
                {isPopupOpen && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                    >
                      <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
                        Change Profile Picture
                      </h3>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/jpeg,image/png"
                        className="mb-4 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => postDetails(selectedImage)}
                          disabled={!selectedImage || loading}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-[#F7941D] to-[#FFA84D] hover:from-[#FFA84D] hover:to-[#F7941D] text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Uploading..." : "Upload"}
                        </button>
                        <button
                          onClick={handlePopupClose}
                          className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-lg transition-all duration-300"
                        >
                          Close
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>

              {/* Dashboard Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* User Information Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
                >
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <FaUserMd className="text-[#F7941D]" />
                    User Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Email
                      </p>
                      <p className="text-slate-800 dark:text-slate-100 font-medium">
                        {displayUser?.email || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Name
                      </p>
                      <p className="text-slate-800 dark:text-slate-100 font-medium">
                        {userName}
                      </p>
                    </div>
                    <button
                      onClick={handleImageClick}
                      className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-[#F7941D] to-[#FFA84D] hover:from-[#FFA84D] hover:to-[#F7941D] text-white font-semibold rounded-lg transition-all duration-300"
                    >
                      Edit Profile
                    </button>
                  </div>
                </motion.div>

                {/* Recent Activity Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
                >
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <IoChatboxOutline className="text-[#2B2F92]" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <p className="mb-1">Last consultation: 2 days ago</p>
                      <p className="mb-1">Active chats: 3</p>
                      <p>Games played: 12</p>
                    </div>
                    <Link
                      to="/chats"
                      className="block mt-4 text-sm text-[#2B2F92] dark:text-[#F7941D] hover:text-[#F7941D] dark:hover:text-[#FFA84D] font-medium transition-colors"
                    >
                      View All Activity →
                    </Link>
                  </div>
                </motion.div>

                {/* Profile Statistics Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
                >
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <IoSettingsOutline className="text-[#F7941D]" />
                    Statistics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Consultations
                      </span>
                      <span className="text-lg font-bold text-[#F7941D]">5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Messages
                      </span>
                      <span className="text-lg font-bold text-[#2B2F92]">23</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Games
                      </span>
                      <span className="text-lg font-bold text-[#F7941D]">12</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6"
              >
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link
                    to="/consultation"
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-[#F7941D]/10 to-[#FFA84D]/10 hover:from-[#F7941D]/20 hover:to-[#FFA84D]/20 transition-all duration-300 border border-[#F7941D]/20"
                  >
                    <FaUserMd className="text-3xl text-[#F7941D] mb-2" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Consultation
                    </span>
                  </Link>
                  <Link
                    to="/chats"
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-[#2B2F92]/10 to-[#1e2266]/10 hover:from-[#2B2F92]/20 hover:to-[#1e2266]/20 transition-all duration-300 border border-[#2B2F92]/20"
                  >
                    <IoChatboxOutline className="text-3xl text-[#2B2F92] mb-2" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Chats
                    </span>
                  </Link>
                  <Link
                    to="/game"
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-[#F7941D]/10 to-[#FFA84D]/10 hover:from-[#F7941D]/20 hover:to-[#FFA84D]/20 transition-all duration-300 border border-[#F7941D]/20"
                  >
                    <RiGamepadLine className="text-3xl text-[#F7941D] mb-2" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Game
                    </span>
                  </Link>
                  <Link
                    to="/news"
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-[#2B2F92]/10 to-[#1e2266]/10 hover:from-[#2B2F92]/20 hover:to-[#1e2266]/20 transition-all duration-300 border border-[#2B2F92]/20"
                  >
                    <IoNewspaperOutline className="text-3xl text-[#2B2F92] mb-2" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      News
                    </span>
                  </Link>
                </div>
              </motion.div>

            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Profile;
