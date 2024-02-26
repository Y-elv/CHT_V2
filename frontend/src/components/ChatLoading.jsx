import { Stack } from '@chakra-ui/react'
import React from 'react'
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height="40px" />
      <Skeleton height="40px" />
      <Skeleton height="40px" />
   
      <Skeleton height="40px" />
      <Skeleton height="40px" />
      <Skeleton height="40px" />
      
      <Skeleton height="40px" />
      <Skeleton height="40px" />
      <Skeleton height="40px" />
    </Stack>
  );
}

export default ChatLoading
