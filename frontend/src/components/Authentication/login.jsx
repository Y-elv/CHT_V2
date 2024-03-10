import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Box,
  Image,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import logo from "../../assets/LOGO FULL.png";

const Login = () => {
  const [show, SetShow] = useState(false);
  const [loading, setLoading] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const history = useNavigate();
  const toast = useToast();
  const handleClick = () => SetShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
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
        title: "Login successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history("/profile");
    } catch (error) {
      toast({
        title: "Error Occured!",

        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
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
        <Box
          spacing="5px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="25vw"
          height="70vh"
          gap="3"
          className="box-login"
        >
          <Image src={logo} alt="Logo" w="150px" h="auto" mb="-3" />
          <div className="signin-text">SignIn</div>
          <FormControl id="email" isRequired>
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Link align="end" to="/forgot-password" style={{ color: "white" }}>
            Forgot Password?
          </Link>

          <Button
            onClick={submitHandler}
            width="100%"
            colorScheme="blue"
            style={{ marginTop: 15 }}
            isLoading={loading}
          >
            login
          </Button>
          <Link to="/register" mt="4" style={{ color: "white" }}>
            New here! Register
          </Link>
        </Box>
      </VStack>
    </div>
  );
};

export default Login;
