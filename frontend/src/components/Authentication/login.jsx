import {
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  VStack,
  Box,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { Suspense, lazy } from "react";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import axios from "../../config/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import logo from "../../assets/LOGO FULL.png";
import { CgMail } from "react-icons/cg";
import { BiSolidLockAlt } from "react-icons/bi";
import { useBadgeStore } from "../../zustandStore/store";
const EdgeGlowCard = lazy(() => import("../EdgeGlowCard"));
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [show, SetShow] = useState(false);
  const [loading, setLoading] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const history = useNavigate();
  const toast = useToast();
  const setProfile = useBadgeStore((state) => state.setProfile);
  const profile = useBadgeStore((state) => state.profile);
  const setIsLoggedIn = useBadgeStore((state) => state.setIsLoggedIn);
  const handleClick = () => SetShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        description: "Please fill all fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        " https://chtv2-bn.onrender.com/api/v2/user/login",
        {
          email,
          password,
        },
        config
      );
      console.log("Data received from login endpoint:", data);

      toast({
        description: "Login successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      setIsLoggedIn(true);
      setProfile(data);
      // navigate("/profile", {state:{data:data}})
      navigate("/profile");
      // history("/profile");
    } catch (error) {
      console.log("Login error:", error);
      console.log("Error response:", error.response);
      console.log("Error response data:", error.response?.data);

      // Extract error message from the API response
      const errorMessage = error.response?.data?.message || "An error occurred";

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
  console.log("Zus Profile", profile);
  return (
    <div className="login-container">
      <VStack
        spacing="5px"
        bg="#b6c0d694"
        width="50vw"
        height="90vh"
        alignItems="center"
        justifyContent="center"
        className="login-class"
      >
        <div className="gradient-border-2 w-[39vw] h-[70vh] max-w-full">
          <Box
            spacing="5px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
            height="100%"
            gap="3"
            className="box-login"
          >
            {/* Replace previous circle effects with an edge glow border */}
            <Suspense fallback={<div />}>
              <EdgeGlowCard
                className="w-full h-full" /* uses brand color by default */
              >
                <div className="box-content w-full h-full flex flex-col items-center justify-center gap-3 px-6 md:px-8 py-5 md:py-6 overflow-y-auto overscroll-contain max-w-full">
                  <Image src={logo} alt="Logo" w="120px" h="auto" maxW="100%" />
                  <div className="signin-text">SignIn</div>
                  <div className="w-full max-w-[420px] mx-auto space-y-4">
                    <FormControl id="email" isRequired>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Box
                            as={CgMail}
                            color="#000000"
                            bg="#F95700FF"
                            p="4px"
                            borderRadius="md"
                            fontSize="28px"
                          />
                        </InputLeftElement>
                        <Input
                          width="100%"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          _placeholder={{ color: "#000000" }}
                          color="#000000"
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl id="password" isRequired>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Box
                            as={BiSolidLockAlt}
                            color="#000000"
                            bg="#F95700FF"
                            p="4px"
                            borderRadius="md"
                            fontSize="28px"
                          />
                        </InputLeftElement>
                        <Input
                          width="100%"
                          type={show ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          _placeholder={{ color: "#000000" }}
                          color="#000000"
                        />
                        <InputRightElement width="4.5rem">
                          <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    <Link
                      align="end"
                      to="/forgot-password"
                      style={{ color: "#000000" }}
                      className="block w-full text-center"
                    >
                      Forgot Password?
                    </Link>

                    <Button
                      onClick={submitHandler}
                      width="100%"
                      colorScheme="#F95700FF"
                      color="#000000"
                      style={{ marginTop: 15 }}
                      isLoading={loading}
                      background="#F95700FF"
                    >
                      login
                    </Button>

                    <Link
                      to="/register"
                      mt="4"
                      style={{ color: "#000000" }}
                      className="block w-full text-center"
                    >
                      New here! Register
                    </Link>
                  </div>
                </div>
              </EdgeGlowCard>
            </Suspense>
          </Box>
        </div>
      </VStack>
    </div>
  );
};

export default Login;
