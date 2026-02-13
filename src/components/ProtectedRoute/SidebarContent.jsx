// SidebarContent.jsx
import {
  Box, Flex, Text, CloseButton, useColorModeValue,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { FiPlus, FiCalendar, FiUser, FiSettings, FiList, FiActivity } from 'react-icons/fi';
import { DumbbellIcon } from 'lucide-react';

const LinkItems = [
  { name: 'Start Workout', icon: FiPlus, to: '/start-workout' },
  { name: 'Exercises', icon: DumbbellIcon, to: '/exercises' },
  { name: 'Fitness Coach Chat', icon: FiCalendar, to: '/upcoming' },
  { name: 'History', icon: FiList, to: '/history' },
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
      <Flex align="center" gap={2}>
        <Box bg="orange.400" borderRadius="full" boxSize="32px" display="flex" alignItems="center" justifyContent="center">
          <Box as={DumbbellIcon} color="white" fontSize="20px" />
        </Box>
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          BuiltBuff
        </Text>
      </Flex>
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