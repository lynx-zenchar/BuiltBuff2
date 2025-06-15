// SidebarWithHeader.jsx
import {
  Box,
  Drawer,
  DrawerContent,
  useDisclosure,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import SidebarContent from './SidebarContent';
import MobileNav from './MobileNav';
import { Outlet } from 'react-router-dom';

const SIDEBAR_WIDTH = 240; // or 60, or whatever you want

const SidebarWithHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      {/* Sidebar */}
      <Box
        display={{ base: 'none', md: 'block' }}
        w={{ base: 'full', md: SIDEBAR_WIDTH }}
        position="fixed"
        h="full"
        zIndex="overlay"
      >
        <SidebarContent onClose={onClose} />
      </Box>
      {/* Drawer for mobile */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* Main content area */}
      <Flex
        direction="column"
        flex="1"
        ml={{ base: 0, md: SIDEBAR_WIDTH }}
        minH="100vh"
        width="100%" // <-- Ensure full width
        bg={useColorModeValue('gray.100', 'gray.900')}
      >
        <MobileNav onOpen={onOpen} />
        {/* CHANGED: Remove p="4" and width="100%" from here, let child handle padding */}
        <Box flex="1" width="100%" height="100%">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default SidebarWithHeader;