import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  FormErrorMessage,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  List,
  ListItem,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword, validatePasswordMatch } from './validation';
import Parse from '../../parseConfig'; // adjust path as needed


const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const navigate = useNavigate();
  const toast = useToast();

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (value && value.length < 2) {
      setNameError('Name must be at least 2 characters long');
    } else {
      setNameError('');
    }
  };

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
    const value = e.target.value;
    setPassword(value);
    const validation = validatePassword(value);
    if (value && !validation.isValid) {
      setPasswordError(validation.errors[0]);
    } else {
      setPasswordError('');
    }
    if (confirmPassword && !validatePasswordMatch(value, confirmPassword)) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value && !validatePasswordMatch(password, value)) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  let hasError = false;
  if (!name) {
    setNameError('Name is required');
    hasError = true;
  }
  if (!email) {
    setEmailError('Email is required');
    hasError = true;
  }
  if (!password) {
    setPasswordError('Password is required');
    hasError = true;
  }
  if (!confirmPassword) {
    setConfirmPasswordError('Please confirm your password');
    hasError = true;
  }
  if (hasError) return;

  setIsLoading(true);

  try {
    // Parse signup
    const user = new Parse.User();
    user.set('username', email);
    user.set('email', email);
    user.set('password', password);
    user.set('name', name); // custom field

    await user.signUp();

    toast({
      title: 'Account created successfully',
      description: 'Please check your email to verify your account',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    navigate('/login');
  } catch (error) {
    toast({
      title: 'Signup failed',
      description: error.message || 'Please try again',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Box as="form" onSubmit={handleSubmit} id="signup-form">
      <Stack spacing="6">
        <FormControl isInvalid={!!nameError}>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter your name"
            autoComplete="name"
          />
          <FormErrorMessage>{nameError}</FormErrorMessage>
        </FormControl>

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
              autoComplete="new-password"
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
          <Text fontSize="sm" color="gray.500" mt={2}>
            Password must contain:
          </Text>
          <List fontSize="sm" color="gray.500" spacing={1}>
            <ListItem>• At least 8 characters</ListItem>
            <ListItem>• One uppercase letter</ListItem>
            <ListItem>• One lowercase letter</ListItem>
            <ListItem>• One number</ListItem>
            <ListItem>• One special character</ListItem>
          </List>
        </FormControl>

        <FormControl isInvalid={!!confirmPasswordError}>
          <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
          <InputGroup>
            <Input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            <InputRightElement>
              <IconButton
                variant="ghost"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{confirmPasswordError}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="brand"
          size="lg"
          fontSize="md"
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </Stack>
    </Box>
  );
};

export default SignupForm; 