import React from 'react'
import { Box, Container,Tabs,Text,Tab,TabList,TabPanels,TabPanel } from "@chakra-ui/react";
import Login from '../components/Authentication/login';
import Signup from '../components/Authentication/signup';
const Homepage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box>
        <Text>welcome to my chat app</Text>
      </Box>
      <Box>
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
            <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage
