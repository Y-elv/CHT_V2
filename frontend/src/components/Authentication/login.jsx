import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Box
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import wallpaper from "../../assets/wallpaper.png";


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
        " http://localhost:8200/api/v2/user/login",
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
   
      <VStack spacing="5px">
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="enter password"
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

        <Button
          onClick={submitHandler}
          width="100%"
          colorScheme="blue"
          style={{ marginTop: 15 }}
          isLoading={loading}
        >
          login
        </Button>

        <Button
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
          }}
          width="100%"
          variant="solid"
          colorScheme="red"
        >
          Get Guest User Credentials
        </Button>
      </VStack>
 
  );
};

export default Login;
