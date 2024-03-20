import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  VStack,
  Box,
  Link,
  Image,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import logo from "../../assets/LOGO FULL.png";
import { CgMail } from "react-icons/cg";
import { BiSolidLockAlt } from "react-icons/bi";

const ForgotPassword = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useNavigate();
  const toast = useToast();
  const handleClick = () => setShow(!show);

const submitHandler = async () => {
  setLoading(true);

  if (!email || !newPassword || !confirmPassword) {
    toast({
      title: "Please fill all fields!",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
    return;
  }


  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    toast({
      title:
        "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one of the following symbols: @, $, !, %, *, ?, &",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
    return;
  }

  
  if (newPassword !== confirmPassword) {
    toast({
      title: "New Password and Confirm Password do not match",
      status: "error",
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
      "  https://chtv2-bn.onrender.com/api/v2/user/reset",
      {
        email,
        newPassword,
        confirmPassword,
      },
      config
    );

    console.log("Data received from password reset endpoint:", data);

    toast({
      title: "Password reset successful!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });

    setLoading(false);
    history("/login"); 
  } catch (error) {
    console.error("Error during password reset:", error);

    toast({
      title: "Error Occurred!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });

    setLoading(false);
  }
};

  return (
    <div className="forgot-container">
      <VStack
        spacing="5px"
        bg="#b6c0d694"
        width="50vw"
        height="90vh"
        alignItems="center"
        justifyContent="center"
        className="forgot-class"
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
          className="box-forgot"
        >
          <Image src={logo} alt="Logo" w="150px" h="auto" mb="4" />
          <div className="forgot-text">Forget Password</div>

          <FormControl id="email" isRequired>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Box
                  as={CgMail}
                  color="#2c17ae"
                  bg="#f3931e"
                  p="4px"
                  borderRadius="md"
                  fontSize="28px"
                />
              </InputLeftElement>
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </FormControl>

          <FormControl id="newPassword" isRequired>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Box
                  as={BiSolidLockAlt}
                  color="#2c17ae"
                  bg="#f3931e"
                  p="4px"
                  borderRadius="md"
                  fontSize="28px"
                />
              </InputLeftElement>
              <Input
                type={show ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="confirmPassword" isRequired>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Box
                  as={BiSolidLockAlt}
                  color="#2c17ae"
                  bg="#f3931e"
                  p="4px"
                  borderRadius="md"
                  fontSize="28px"
                />
              </InputLeftElement>
              <Input
                type={show ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            colorScheme="#f3931e"
            style={{ marginTop: 15 }}
            isLoading={loading}
            color="#2c17ae"
            background="#f3931e"
          >
            submit
          </Button>
        </Box>
      </VStack>
    </div>
  );
};

export default ForgotPassword;
