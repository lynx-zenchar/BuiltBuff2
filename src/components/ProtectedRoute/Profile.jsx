// Profile.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Avatar,
  useToast,
  Card,
  CardBody,
  SimpleGrid,
  IconButton,
  useColorMode,
  Select,
} from '@chakra-ui/react';
import { FiEdit2, FiCamera } from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import Parse from '../../parseConfig';

const TRACKED_API = 'https://parseapi.back4app.com/classes/TrackedWorkouts?limit=1000';
const APP_ID = 'wZx2txCduEKOjoqh6Pln5mFQlkYTyis38Iv8CcSk';
const REST_KEY = 'FkYgj1b3gFCmTefCqKUma58wpNVULpcmvslQyKBV';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [workoutData, setWorkoutData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [weightProgressionData, setWeightProgressionData] = useState({});
  const [volumeData, setVolumeData] = useState([]);
  const [frequencyData, setFrequencyData] = useState([]);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const fileInputRef = React.useRef();

  useEffect(() => {
    const currentUser = Parse.User.current();
    if (currentUser) {
      setUser(currentUser);
      setName(currentUser.get('name') || '');
      setEmail(currentUser.get('email') || '');
    }
    fetchWorkoutData();
  }, []);

  const fetchWorkoutData = async () => {
    try {
      const response = await fetch(TRACKED_API, {
        headers: {
          'X-Parse-Application-Id': APP_ID,
          'X-Parse-REST-API-Key': REST_KEY,
        },
      });
      const data = await response.json();
      const userData = data.results.filter(w => w.userId === user?.id);
      setWorkoutData(userData);

      // Process data for charts
      processWeightProgression(userData);
      processVolumeData(userData);
      processFrequencyData(userData);
    } catch (error) {
      console.error('Error fetching workout data:', error);
    }
  };

  const processWeightProgression = (data) => {
    // Group by exercise and date
    const exerciseData = {};
    data.forEach(workout => {
      if (!exerciseData[workout.Exercise_Name]) {
        exerciseData[workout.Exercise_Name] = [];
      }
      exerciseData[workout.Exercise_Name].push({
        date: workout.Date,
        weight: workout.Weight,
        reps: workout.Reps,
      });
    });

    // Sort by date and get max weight per exercise
    Object.keys(exerciseData).forEach(exercise => {
      exerciseData[exercise].sort((a, b) => new Date(a.date) - new Date(b.date));
      exerciseData[exercise] = exerciseData[exercise].map(entry => ({
        date: entry.date,
        weight: entry.weight,
      }));
    });

    setWeightProgressionData(exerciseData);
  };

  const processVolumeData = (data) => {
    // Group by muscle group and calculate total volume
    const volumeByMuscle = {};
    data.forEach(workout => {
      const muscle = workout.Target_Muscles;
      const volume = (workout.Weight || 0) * (workout.Reps || 0);
      
      if (!volumeByMuscle[muscle]) {
        volumeByMuscle[muscle] = 0;
      }
      volumeByMuscle[muscle] += volume;
    });

    const volumeData = Object.entries(volumeByMuscle).map(([muscle, volume]) => ({
      muscle,
      volume,
    }));

    setVolumeData(volumeData);
  };

  const processFrequencyData = (data) => {
    // Group by date and count workouts
    const frequencyByDate = {};
    data.forEach(workout => {
      if (!frequencyByDate[workout.Date]) {
        frequencyByDate[workout.Date] = 0;
      }
      frequencyByDate[workout.Date]++;
    });

    const frequencyData = Object.entries(frequencyByDate).map(([date, count]) => ({
      date,
      count,
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    setFrequencyData(frequencyData);
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const parseFile = new Parse.File(file.name, file);
      await parseFile.save();

      user.set('photo', parseFile);
      await user.save();

      toast({
        title: 'Success',
        description: 'Profile photo updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile photo',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      user.set('name', name);
      await user.save();

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box mx="auto" p={4} maxW="1200px">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        {/* Profile Section */}
        <Card>
          <CardBody>
            <VStack spacing={6}>
              <Box position="relative">
                <Avatar
                  size="2xl"
                  name={name}
                  src={user?.get('photo')?.url()}
                />
                <IconButton
                  icon={<FiCamera />}
                  position="absolute"
                  bottom="0"
                  right="0"
                  colorScheme="blue"
                  rounded="full"
                  onClick={() => fileInputRef.current?.click()}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </Box>

              {isEditing ? (
                <VStack spacing={4} w="100%">
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input value={email} isReadOnly />
                  </FormControl>
                  <HStack>
                    <Button
                      colorScheme="blue"
                      onClick={handleUpdateProfile}
                      isLoading={isLoading}
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </HStack>
                </VStack>
              ) : (
                <VStack spacing={2}>
                  <Heading size="md">{name}</Heading>
                  <Text color="gray.500">{email}</Text>
                  <Button
                    leftIcon={<FiEdit2 />}
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                </VStack>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Workout Data Visualization */}
        <VStack spacing={8}>
          {/* Weight Progression Chart */}
          <Card w="100%">
            <CardBody>
              <VStack spacing={4}>
                <Heading size="md">Weight Progression</Heading>
                <FormControl>
                  <FormLabel>Select Exercise</FormLabel>
                  <Select
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                  >
                    <option value="">Select an exercise</option>
                    {Object.keys(weightProgressionData || {}).map((exercise) => (
                      <option key={exercise} value={exercise}>
                        {exercise}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                {selectedExercise && weightProgressionData?.[selectedExercise] && (
                  <Box w="100%" h="300px">
                    <ResponsiveContainer>
                      <LineChart
                        data={weightProgressionData[selectedExercise]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="weight"
                          stroke={colorMode === 'dark' ? '#fff' : '#000'}
                          name="Weight (lbs)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Volume by Muscle Group Chart */}
          <Card w="100%">
            <CardBody>
              <VStack spacing={4}>
                <Heading size="md">Volume by Muscle Group</Heading>
                <Box w="100%" h="300px">
                  <ResponsiveContainer>
                    <BarChart data={volumeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="muscle" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="volume"
                        fill={colorMode === 'dark' ? '#fff' : '#000'}
                        name="Volume (lbs × reps)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Workout Frequency Chart */}
          <Card w="100%">
            <CardBody>
              <VStack spacing={4}>
                <Heading size="md">Workout Frequency</Heading>
                <Box w="100%" h="300px">
                  <ResponsiveContainer>
                    <LineChart
                      data={frequencyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke={colorMode === 'dark' ? '#fff' : '#000'}
                        name="Workouts per Day"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default Profile;