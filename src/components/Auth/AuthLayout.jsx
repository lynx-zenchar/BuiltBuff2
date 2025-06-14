import { Box, Container, Heading, Text, useColorMode } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@chakra-ui/react';
import { AbsoluteCenter, Center, Circle, Square } from "@chakra-ui/react"
import { DumbbellIcon, UserIcon, LockIcon } from 'lucide-react'

// C: Read The docs bro. CHAT GPT and Cursor can't save your ass.
const AuthLayout = ({ children, title, subtitle, linkText, linkTo }) => {
  const { colorMode } = useColorMode();

  return (
  <AbsoluteCenter>

    <Box  bg={colorMode === 'dark' ? 'gray.800' : 'gray.50'} display="flex" alignItems="center" justifyContent="center">
    
      <Container maxW="container.sm" py="8" px="8">
      
        <Box
          py="8"
          px="10"
          bg={colorMode === 'dark' ? 'gray.700' : 'white'}
          boxShadow="lg"
          borderRadius="xl"
          width="100%"
        >
        <Center>
          <Circle size="12" bg="orange.500" color="white">
            <div className="p-3 bg-orange-600 rounded-full">
              <DumbbellIcon size={32} className="text-white" />
            </div>
          </Circle>
          </Center>


          
          <Box mb="8">
            <Heading textAlign="center" size="xl" fontWeight="extrabold">
              {title}
            </Heading>
            <Text mt="2" textAlign="center" color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}>
              {subtitle}{' '}
              <Link as={RouterLink} to={linkTo} color="brand.500">
                {linkText}
              </Link>
            </Text>
          </Box>
          {children}
        </Box>
      </Container>
    </Box>
    </AbsoluteCenter>
  );
};

export default AuthLayout; 