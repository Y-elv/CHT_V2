import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Image,
  Box,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import wallpaper from "../../assets/wallpaper.png";
import "./signup.css";
import logo from "../../assets/LOGO FULL.png";

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
        title: "Please fill all fields !",
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
        title: "Weak Password",
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
        title: "Registration successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      
      setLoading(false);
      history("/login");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast({
          title: "Error Occurred!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else {
       
        toast({
          title: "Unexpected Error Occurred!",
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
            <Input
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </FormControl>

          <FormControl id="email" isRequired>
            <Input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <InputGroup>
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
            colorScheme="blue"
            style={{ marginTop: 15 }}
            isLoading={loading}
          >
            signUp
          </Button>
          <Link to="/login" mt="4" style={{ color: "white" }}>
            Already have an Account? SignIn
          </Link>
        </Box>
      </VStack>
    </div>
  );
};

export default Signup;
