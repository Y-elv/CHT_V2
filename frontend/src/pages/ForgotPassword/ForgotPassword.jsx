import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
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

const ForgotPassword = () => {
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
          <FormControl id="newPassword" isRequired>
            <Input
              type={show ? "text" : "password"}
              placeholder="new Passowrd"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="confirmPassword" isRequired>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                placeholder="confirm Password"
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
            submit
          </Button>
        </Box>
      </VStack>
    </div>
  );
};

export default ForgotPassword;
