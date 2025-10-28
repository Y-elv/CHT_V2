import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  VStack,
  Image,
  Box,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import axios from "../../config/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import wallpaper from "../../assets/wallpaper.png";
import "./signup.css";
import logo from "../../assets/LOGO FULL.png";
import { CgMail } from "react-icons/cg";
import { BiSolidLockAlt } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs";

const Signup = () => {
  const [show, SetShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirm, setConfirm] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState();
  const toast = useToast();
  const history = useNavigate();

  const handleClick = () => SetShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password) {
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
    const weakPasswordRegex = /^(?=.*[a-z]).{6,}$/; // Example: At least 6 characters and at least one lowercase letter
    if (!weakPasswordRegex.test(password)) {
      toast({
        description:
          "Weak Password, your password must be at least 6 characters and at least one lowercase letter",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        " https://chtv2-bn.onrender.com/api/v2/user/register",
        {
          name,
          email,
          password,
        },
        config
      );
      console.log("data are :", data);

      toast({
        description: "Registration successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
      history("/login");
    } catch (error) {
      // Debug: Log the error structure to understand the format
      console.log("Full error object:", error);
      console.log("Error response:", error.response);
      console.log("Error response data:", error.response?.data);

      // Check for password strength error in different possible formats
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || "";
      const isPasswordError =
        errorMessage.includes("Password must be a strong password") ||
        errorMessage.includes("strong password") ||
        errorMessage.includes("password strength");

      if (isPasswordError) {
        toast({
          description: (
            <div>
              <div style={{ marginBottom: "8px" }}>{errorMessage}</div>
              <div style={{ fontSize: "14px", color: "#666" }}>
                <strong>Make sure your password:</strong>
                <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
                  <li>Has uppercase and lowercase letters</li>
                  <li>Includes a number</li>
                  <li>Has at least one special character (like @, #, !, $)</li>
                </ul>
              </div>
            </div>
          ),
          status: "error",
          duration: 8000,
          isClosable: true,
          position: "bottom",
        });
      } else if (error.response?.data?.error) {
        // Handle other errors with error field
        toast({
          description: error.response.data.error,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else if (error.response?.data?.message) {
        // Handle other errors with message field
        toast({
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
        toast({
          description: "Unexpected error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
      setLoading(false);
    }
  };
  return (
    <div className="signup-container">
      <VStack
        spacing="5px"
        bg="#b6c0d694"
        width="50vw"
        height="90vh"
        alignItems="center"
        justifyContent="center"
        className="register-class"
      >
        <Box
          spacing="5px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="25vw"
          height="70vh"
          gap="3"
          className="box-register"
        >
          <Image src={logo} alt="Logo" w="150px" h="auto" mb="-3" />
          <div className="signup-text">SignUp</div>
          <FormControl id="first-name" isRequired>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Box
                  as={BsFillPersonFill}
                  color="#000000"
                  bg="#F95700FF"
                  p="4px"
                  borderRadius="md"
                  fontSize="28px"
                />
              </InputLeftElement>

              <Input
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </InputGroup>
          </FormControl>

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
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
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
                type={show ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            onClick={submitHandler}
            width="100%"
            colorScheme="#F95700FF"
            style={{ marginTop: 15 }}
            isLoading={loading}
            color="#000000"
            background="#F95700FF"
          >
            signUp
          </Button>
          <Link to="/login" mt="4" style={{ color: "#000000" }}>
            Already have an Account? SignIn
          </Link>
        </Box>
      </VStack>
    </div>
  );
};

export default Signup;
