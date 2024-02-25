import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";




const Signup = () => {
  const [show, SetShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirm, setConfirm] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState();
  const toast = useToast();
  const history = useNavigate()

  const handleClick = () => SetShow(!show);
 const postDetails = (pics) => {
   setLoading(true);

   if (pics === undefined) {
     toast({
       title: "Please select Image!",
       status: "warning",
       duration: 5000,
       isClosable: true,
       position: "bottom",
     });
     return;
   }

   if (pics.type === "image/jpeg" || pics.type === "image/png") {
     const data = new FormData();
     data.append("file", pics);
     data.append("upload_preset", "chat-app");
     data.append("cloud_name", "dmzieqsir");

     fetch("https://api.cloudinary.com/v1_1/dmzieqsir/image/upload", {
       method: "post",
       body: data,
     })
       .then((res) => res.json())
       .then((data) => {
         setPic(data.url.toString());
         setLoading(false);
       })
       .catch((err) => {
         console.log(err);
         setLoading(false);

         console.log("Image URL:", data.url);
       });
   }
   else{
      toast({
        title: "Please select Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
      return;
   }
 };


  const submitHandler =async () => {
    setLoading(true)
    if(!name || !email || !password || !confirm){
      toast({
       title: "Please fill all fields !",
       status: "warning",
       duration: 5000,
       isClosable: true,
       position: "bottom",
      });
     setLoading(false)
     return;
   }
   if(password !== confirm){
      toast({
       title: "Password do not match!",
       status: "warning",
       duration: 5000,
       isClosable: true,
       position: "bottom",
      });
      return;
   }
   try{
const config={
  headers:{
    "Content-type":"application/json",
  },
};
const { data } = await axios.post(
  " http://localhost:8100/api/v2/user/register",
  {
    name,
    email,
    password,
    pic,
  },
  config
);

   toast({
     title: "Registration successfully!",
     status: "success",
     duration: 5000,
     isClosable: true,
     position: "bottom",
   });
  localStorage.setItem("userInfo", JSON.stringify(data));
  setLoading(false);
  history.push("/chats");
   }
   catch(error){


        toast({
          title: "Error Occured!",
          description:error.response.data.message,
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
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="enter name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirm" isRequired>
        <FormLabel>confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="confirrm password"
            onChange={(e) => setConfirm(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        onClick={submitHandler}
        width="100%"
        colorScheme="blue"
        style={{ marginTop: 15 }}
        isLoading ={loading}
      >
        signUp
      </Button>
    </VStack>
  );
};

export default Signup;
