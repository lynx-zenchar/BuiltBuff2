import { Box, Container, Heading, Text, useColorMode, Flex, Image } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@chakra-ui/react';
import { Circle, Center } from '@chakra-ui/react';
import { DumbbellIcon } from 'lucide-react';

// C: Read The docs bro. CHAT GPT and Cursor can't save your ass.
const AuthLayout = ({ children, title, subtitle, linkText, linkTo }) => {
  const { colorMode } = useColorMode();

  return (
    <Flex minH="100vh" direction={{ base: 'column', md: 'row' }}>
      {/* Image Section */}
      <Box
        flex={{ base: 'none', md: '1' }}
        minH={{ base: '200px', md: '100vh' }}
        display={{ base: 'block', md: 'flex' }}
        alignItems="center"
        justifyContent="center"
        bg="gray.900"
      >
        <Image
          src="/BW_GYM.jpg"
          alt="Gym"
          objectFit="cover"
          w="100%"
          h={{ base: '200px', md: '100vh' }}
          maxH="100vh"
        />
      </Box>
      {/* Form Section */}
      <Flex
        flex="1"
        align="center"
        justify="center"
        bg={colorMode === 'dark' ? 'gray.800' : 'gray.50'}
        py={{ base: 8, md: 0 }}
      >
        <Container maxW="sm" px={{ base: 4, md: 8 }}>
          <Box
            py="8"
            px={{ base: 4, md: 10 }}
            bg={colorMode === 'dark' ? 'gray.700' : 'white'}
            boxShadow="lg"
            borderRadius="xl"
            width="100%"
          >
            <Center mb={6}>
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
      </Flex>
    </Flex>
  );
};

export default AuthLayout; 