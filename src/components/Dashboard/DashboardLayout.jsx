import { Box, Flex, useColorMode } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { AbsoluteCenter, Center, Circle, Square } from "@chakra-ui/react"


const DashboardLayout = () => {
  const { colorMode } = useColorMode();

  return (
    <Box minH="100vh" bg={colorMode === 'dark' ? 'gray.800' : 'gray.50'}>
      <Sidebar />
      <Box
        ml={{ base: 0, md: 60 }}
        transition=".3s ease"
      >
        <Header />
        <AbsoluteCenter>
        <Box
          as="main"
          p="4"
          minH="calc(100vh - 64px)"
        >
          <Outlet />
        </Box>
        </AbsoluteCenter>
      </Box>
    </Box>
  );
};

export default DashboardLayout; 