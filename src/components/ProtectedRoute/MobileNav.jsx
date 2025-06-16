// MobileNav.jsx
import {
  Flex, IconButton, HStack, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Text, Box, VStack, useColorModeValue,
} from '@chakra-ui/react';
import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Parse from '../../parseConfig';

const MobileNav = ({ onOpen, ...rest }) => {
  const navigate = useNavigate();
  const user = Parse.User.current();

  const handleLogout = async () => {
    try {
      await Parse.User.logOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        BuiltBuff
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="notifications"
          icon={<FiBell />}
        />
        <Flex alignItems="center">
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Avatar
                  size="sm"
                  name={user?.get('name')}
                  src={user?.get('photo')?.url()}
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{user?.get('name')}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {user?.get('email')}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
              <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default MobileNav;