// Upcoming.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Button,
  useToast,
  Spinner,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  Avatar,
  Flex,
} from '@chakra-ui/react';
import { FiSend } from 'react-icons/fi';
import Parse from '../../parseConfig';

const TRACKED_API = 'https://parseapi.back4app.com/classes/TrackedWorkouts?limit=1000';
const APP_ID = import.meta.env.VITE_PARSE_APP_ID;
const REST_KEY = import.meta.env.VITE_PARSE_REST_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const Upcoming = () => {
  const [loading, setLoading] = useState(true);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();
  const user = Parse.User.current();

  useEffect(() => {
    fetchWorkoutHistory();
  }, []);

  const fetchWorkoutHistory = async () => {
    try {
      const response = await fetch(TRACKED_API, {
        headers: {
          'X-Parse-Application-Id': APP_ID,
          'X-Parse-REST-API-Key': REST_KEY,
        },
      });
      const data = await response.json();
      const userData = data.results.filter(w => w.userId === user?.id);
      setWorkoutHistory(userData);
    } catch (error) {
      console.error('Error fetching workout history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load workout history',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Prepare workout history context
      const recentWorkouts = workoutHistory.slice(-20).map(workout => ({
        date: workout.Date,
        exercise: workout.Exercise_Name,
        weight: workout.Weight,
        reps: workout.Reps,
        muscle: workout.Target_Muscles,
      }));

      const workoutSummary = generateWorkoutSummary(recentWorkouts);

      const prompt = {
        messages: [
          {
            role: 'system',
            content: `You are a professional fitness trainer and coach. You have access to the user's workout history and can provide personalized advice. Be conversational, encouraging, and specific in your recommendations.

            User's Recent Workout History:
            ${workoutSummary}

            Provide helpful, personalized fitness advice based on their history. Keep responses concise but informative.`,
          },
          {
            role: 'user',
            content: inputMessage,
          },
        ],
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        temperature: 0.7,
        max_tokens: 500,
      };

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt),
      });

      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('API Error response:', errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid API response structure');
      }

      const aiMessage = {
        id: Date.now() + 1,
        text: data.choices[0].message.content,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'ai',
        timestamp: new Date(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Error',
        description: 'Failed to get AI response',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsTyping(false);
    }
  };

  const generateWorkoutSummary = (workouts) => {
    if (workouts.length === 0) return "No recent workout history available.";

    const muscleGroups = {};
    const exercises = {};
    
    workouts.forEach(workout => {
      // Track muscle groups
      if (!muscleGroups[workout.muscle]) {
        muscleGroups[workout.muscle] = [];
      }
      muscleGroups[workout.muscle].push({
        date: workout.date,
        exercise: workout.exercise,
        weight: workout.weight,
        reps: workout.reps,
      });

      // Track exercises
      if (!exercises[workout.exercise]) {
        exercises[workout.exercise] = [];
      }
      exercises[workout.exercise].push({
        date: workout.date,
        weight: workout.weight,
        reps: workout.reps,
      });
    });

    let summary = `Recent workout summary (last ${workouts.length} workouts):\n\n`;
    
    // Muscle group breakdown
    summary += "Muscle Groups Trained:\n";
    Object.keys(muscleGroups).forEach(muscle => {
      const count = muscleGroups[muscle].length;
      const lastWorked = muscleGroups[muscle].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      summary += `- ${muscle}: ${count} workouts, last on ${lastWorked.date}\n`;
    });

    summary += "\nTop Exercises:\n";
    const topExercises = Object.keys(exercises).slice(0, 5);
    topExercises.forEach(exercise => {
      const sessions = exercises[exercise];
      const latest = sessions.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      summary += `- ${exercise}: ${sessions.length} sessions, latest: ${latest.weight || 'bodyweight'} × ${latest.reps}\n`;
    });

    return summary;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading your workout data...</Text>
      </Box>
    );
  }

  return (
    <Box mx="auto" p={4} maxW="800px">
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Fitness Coach Chat</Heading>
        
        <Card>
          <CardBody>
            <Text color="gray.600" mb={4}>
              Chat with your AI fitness coach! I have access to your workout history and can provide personalized advice, 
              workout suggestions, form tips, and answer any fitness questions you have.
            </Text>
            
            <Box
              h="400px"
              overflowY="auto"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              p={4}
              bg="gray.50"
            >
              {messages.length === 0 ? (
                <Text color="gray.500" textAlign="center" mt={8}>
                  Start a conversation! Try asking about your workout progress, 
                  requesting a new routine, or asking for exercise tips.
                </Text>
              ) : (
                <VStack spacing={4} align="stretch">
                  {messages.map((message) => (
                    <Flex
                      key={message.id}
                      justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                    >
                      <HStack
                        maxW="70%"
                        align="flex-start"
                        spacing={2}
                        flexDirection={message.sender === 'user' ? 'row-reverse' : 'row'}
                      >
                        <Avatar
                          size="sm"
                          bg={message.sender === 'user' ? 'blue.500' : 'green.500'}
                          color="white"
                          name={message.sender === 'user' ? 'U' : 'AI'}
                        />
                        <Box
                          bg={message.sender === 'user' ? 'blue.500' : 'white'}
                          color={message.sender === 'user' ? 'white' : 'gray.800'}
                          p={3}
                          borderRadius="lg"
                          borderTopLeftRadius={message.sender === 'user' ? 'lg' : 'sm'}
                          borderTopRightRadius={message.sender === 'user' ? 'sm' : 'lg'}
                          boxShadow="sm"
                          border={message.sender === 'ai' ? '1px solid' : 'none'}
                          borderColor="gray.200"
                        >
                          <Text fontSize="sm" whiteSpace="pre-wrap">
                            {message.text}
                          </Text>
                          <Text
                            fontSize="xs"
                            color={message.sender === 'user' ? 'blue.100' : 'gray.500'}
                            mt={1}
                          >
                            {message.timestamp.toLocaleTimeString()}
                          </Text>
                        </Box>
                      </HStack>
                    </Flex>
                  ))}
                  {isTyping && (
                    <Flex justify="flex-start">
                      <HStack maxW="70%" align="flex-start" spacing={2}>
                        <Avatar size="sm" bg="green.500" color="white" name="AI" />
                        <Box bg="white" p={3} borderRadius="lg" borderTopLeftRadius="sm" boxShadow="sm" border="1px solid" borderColor="gray.200">
                          <Text fontSize="sm" color="gray.500">
                            AI is typing...
                          </Text>
                        </Box>
                      </HStack>
                    </Flex>
                  )}
                </VStack>
              )}
            </Box>

            <InputGroup mt={4}>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about fitness, workouts, or your progress..."
                onKeyPress={handleKeyPress}
                disabled={isTyping}
              />
              <InputRightElement>
                <IconButton
                  icon={<FiSend />}
                  onClick={sendMessage}
                  disabled={isTyping || !inputMessage.trim()}
                  size="sm"
                  aria-label="Send message"
                />
              </InputRightElement>
            </InputGroup>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default Upcoming;