import React from 'react'
import { useDisclosure } from '@chakra-ui/react';
import { IconButton ,Text ,Image} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button

} from "@chakra-ui/react";


const profileModal = ({user,children}) => {
     const { isOpen, onOpen, onClose } = useDisclosure();
  
     return (
       <>
         {children ? (
           <span onClick={onOpen}>{children}</span>
         ) : (
           <IconButton
             display={{ base: "flex" }}
             icon={<ViewIcon />}
             onClick={onOpen}
           />
         )}
         <Modal si="lg" isOpen={isOpen} onClose={onClose}>
           <ModalOverlay />
           <ModalContent h="410px">
             <ModalHeader
               fontFamily="Work sans"
               display="flex"
               justifyContent="center"
               fontSize="40px"
             >
               {user.name}
             </ModalHeader>
             <ModalCloseButton />
             <ModalBody
               flexDirection="column"
               alignItems="center"
               display="flex"
               justifyContent="space-between"
               
             >
               <Image
                 borderRadius="full"
                 boxSize="150px"
                 src={user.pic}
                 alt={user.name}
               />
               <Text
                 fontSize={{ base: "28px", md: "30px" }}
                 fontFamily="work sans"
               >
                 Email:{user.email}
               </Text>
             </ModalBody>

             <ModalFooter>
               <Button colorScheme="blue" mr={3} onClick={onClose}>
                 Close
               </Button>
             </ModalFooter>
           </ModalContent>
         </Modal>
       </>
     );
    
    
    
  
};

export default profileModal
