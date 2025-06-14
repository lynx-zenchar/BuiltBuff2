import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Checkbox,
  FormErrorMessage,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from './validation';
import Parse from '../../parseConfig'; // adjust path as needed

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(null);

  const navigate = useNavigate();
  const toast = useToast();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value) {
      setPasswordError('');
    }
  };

  const checkRateLimit = () => {
    const now = Date.now();
    if (lastAttemptTime && now - lastAttemptTime < 300000) { // 5 minutes
      if (attempts >= 3) {
        toast({
          title: 'Too many attempts',
          description: 'Please wait 5 minutes before trying again',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return false;
      }
    } else {
      setAttempts(0);
      setLastAttemptTime(now);
    }
    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!checkRateLimit()) return;

  let hasError = false;
  if (!email) {
    setEmailError('Email is required');
    hasError = true;
  }
  if (!password) {
    setPasswordError('Password is required');
    hasError = true;
  }
  if (hasError) return;

  setIsLoading(true);
  setAttempts(prev => prev + 1);

  try {
    // Parse login
    const user = await Parse.User.logIn(email, password);
    // Save session token or user info as needed
    localStorage.setItem('authToken', user.getSessionToken());

    toast({
      title: 'Login successful',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    navigate('/dashboard');
  } catch (error) {
    toast({
      title: 'Login failed',
      description: error.message || 'Please check your credentials and try again',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Box as="form" onSubmit={handleSubmit} id="login-form">
      <Stack spacing="6">
        <FormControl isInvalid={!!emailError}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            autoComplete="email"
          />
          <FormErrorMessage>{emailError}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!passwordError}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <InputGroup>
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword(!showPassword)}
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{passwordError}</FormErrorMessage>
        </FormControl>

        <Stack spacing="6">
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            align="start"
            justify="space-between"
          >
            {/* Placeholder: Remember me functionality not implemented yet */}
            <Checkbox
              id="remember-me"
              name="remember-me"
              isChecked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            >
              Remember me
            </Checkbox>
          </Stack>

          <Button
            type="submit"
            colorScheme="brand"
            size="lg"
            fontSize="md"
            isLoading={isLoading}
          >
            Sign in
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default LoginForm; 