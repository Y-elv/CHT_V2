import { Box, Button, Tooltip } from "@chakra-ui/react";
import React, { useState } from "react";

const SideDrawer = () => {
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  return (
    <>
      <Box>
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost">
            <i
              class="fas fa-search"
              
            ></i>
          </Button>
        </Tooltip>
      </Box>
    </>
  );
 
};

export default SideDrawer;
