import React from "react";

export const getSender = (loggedUser, users) => {

    
    var user = users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  console.log("hi am from sender",user);
  return user
 
};


