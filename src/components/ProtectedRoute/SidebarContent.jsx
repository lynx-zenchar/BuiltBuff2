// SidebarContent.jsx
import {
  Box, Flex, Text, CloseButton, useColorModeValue,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiCalendar, FiUser, FiSettings, FiList } from 'react-icons/fi';

const LinkItems = [
  { name: 'Dashboard', icon: FiHome, to: '/dashboard' },
  { name: 'Upcoming', icon: FiCalendar, to: '/upcoming' },
  { name: 'Workout Log', icon: FiList, to: '/workout-log' },
  { name: 'Profile', icon: FiUser, to: '/profile' },
  { name: 'Settings', icon: FiSettings, to: '/settings' },
];

const SidebarContent = ({ onClose, ...rest }) => (
  <Box
    transition="0.3s ease"
    bg={useColorModeValue('white', 'gray.900')}
    borderRight="1px"
    borderRightColor={useColorModeValue('gray.200', 'gray.700')}
    w={{ base: 'full', md: 60 }}
    pos="fixed"
    h="full"
    {...rest}
  >
    <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
      <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
        BuiltBuff
      </Text>
      <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
    </Flex>
    {LinkItems.map((link) => (
      <NavLink
        key={link.name}
        to={link.to}
        style={({ isActive }) => ({
          textDecoration: 'none',
          color: isActive ? '#f97316' : 'inherit',
        })}
      >
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: 'orange.400',
            color: 'white',
          }}
        >
          <Box as={link.icon} mr="4" fontSize="16" />
          {link.name}
        </Flex>
      </NavLink>
    ))}
  </Box>
);

export default SidebarContent;