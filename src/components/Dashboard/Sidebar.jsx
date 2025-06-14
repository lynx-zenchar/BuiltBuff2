import {
  Box,
  VStack,
  Icon,
  Text,
  Link,
  useColorMode,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiActivity,
  FiCalendar,
  FiList,
  FiSettings,
  FiUser,
} from 'react-icons/fi';

const NavItem = ({ icon, children, to, isActive }) => {
  const { colorMode } = useColorMode();

  return (
    <Link
      as={RouterLink}
      to={to}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? (colorMode === 'dark' ? 'gray.700' : 'gray.100') : 'transparent'}
        _hover={{
          bg: colorMode === 'dark' ? 'gray.700' : 'gray.100',
        }}
      >
        <Icon
          mr="4"
          fontSize="16"
          as={icon}
          color={isActive ? 'brand.500' : 'inherit'}
        />
        <Text
          color={isActive ? 'brand.500' : 'inherit'}
          fontWeight={isActive ? 'bold' : 'normal'}
        >
          {children}
        </Text>
      </Flex>
    </Link>
  );
};

const Sidebar = () => {
  const { colorMode } = useColorMode();
  const location = useLocation();

  const navItems = [
    { icon: FiHome, text: 'Dashboard', path: '/dashboard' },
    { icon: FiActivity, text: 'Workout Log', path: '/workout-log' },
    { icon: FiList, text: 'Exercise Library', path: '/exercises' },
    { icon: FiCalendar, text: 'Upcoming', path: '/upcoming' },
    { icon: FiUser, text: 'Profile', path: '/profile' },
    { icon: FiSettings, text: 'Settings', path: '/settings' },
  ];

  return (
    <Box
      as="nav"
      position="fixed"
      left="0"
      w="60"
      h="full"
      bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      borderRight="1px"
      borderColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
      py="5"
      overflowY="auto"
    >
      <VStack spacing={1} align="stretch">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            to={item.path}
            isActive={location.pathname === item.path}
          >
            {item.text}
          </NavItem>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar; 