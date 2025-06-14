import { Box, useColorMode } from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Parse from './parseConfig'; // adjust path as needed

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    // We'll implement authentication check later
    const isAuthenticated = false;
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <Box minH="100vh">
      <Outlet />
    </Box>
  );
}

export default App;
