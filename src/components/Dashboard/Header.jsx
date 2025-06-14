import {
  Box,
  Flex,
  IconButton,
  useColorMode,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  // TODO: Replace with actual user data
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  return (
    <Box
      as="header"
      position="fixed"
      w="full"
      bg={colorMode === 'dark' ? 'gray.700' : 'white'}
      borderBottom="1px"
      borderColor={colorMode === 'dark' ? 'gray.600' : 'gray.200'}
      h="16"
      zIndex="1"
    >
      <Flex
        h="16"
        alignItems="center"
        justifyContent="space-between"
        px="4"
      >
        <Text fontSize="xl" fontWeight="bold">
          BuiltBuff
        </Text>

        <Flex alignItems="center" gap={4}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />

          <Menu>
            <MenuButton
              as={Flex}
              alignItems="center"
              gap={2}
              cursor="pointer"
              _hover={{ bg: colorMode === 'dark' ? 'gray.600' : 'gray.100' }}
              p={2}
              borderRadius="md"
            >
              <Avatar size="sm" name={user.name} />
              <Text>{user.name}</Text>
              <ChevronDownIcon />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate('/profile')}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => navigate('/settings')}>
                Settings
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header; 