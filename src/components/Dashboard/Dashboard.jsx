import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  useColorMode,
  VStack,
  HStack,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiPlus, FiActivity, FiCalendar, FiList } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Mock data for development
const mockRecentWorkouts = [
  {
    id: 1,
    date: '2024-02-20',
    name: 'Upper Body',
    exercises: [
      { name: 'Bench Press', sets: 3, reps: 10, weight: 135 },
      { name: 'Shoulder Press', sets: 3, reps: 12, weight: 95 },
    ],
  },
  {
    id: 2,
    date: '2024-02-18',
    name: 'Lower Body',
    exercises: [
      { name: 'Squats', sets: 4, reps: 8, weight: 225 },
      { name: 'Deadlifts', sets: 3, reps: 6, weight: 315 },
    ],
  },
];

const mockTemplates = [
  {
    id: 1,
    name: 'Push Day',
    exercises: ['Bench Press', 'Shoulder Press', 'Tricep Extensions'],
  },
  {
    id: 2,
    name: 'Pull Day',
    exercises: ['Pull-ups', 'Rows', 'Bicep Curls'],
  },
  {
    id: 3,
    name: 'Leg Day',
    exercises: ['Squats', 'Deadlifts', 'Leg Press'],
  },
];

const QuickAction = ({ icon, text, onClick }) => {
  const { colorMode } = useColorMode();
  
  return (
    <Button
      leftIcon={icon}
      onClick={onClick}
      variant="outline"
      colorScheme="brand"
      w="full"
      h="full"
      py={8}
    >
      {text}
    </Button>
  );
};

const Dashboard = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  return (
    <Box pt="16">
      <VStack spacing={6} align="stretch">
        {/* Quick Actions */}
        <Box>
          <Heading size="md" mb={4}>Quick Actions</Heading>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
            <QuickAction
              icon={<FiPlus />}
              text="New Workout"
              onClick={() => navigate('/workout-log/new')}
            />
            <QuickAction
              icon={<FiActivity />}
              text="View Progress"
              onClick={() => navigate('/progress')}
            />
            <QuickAction
              icon={<FiCalendar />}
              text="Schedule Workout"
              onClick={() => navigate('/upcoming/new')}
            />
            <QuickAction
              icon={<FiList />}
              text="Browse Exercises"
              onClick={() => navigate('/exercises')}
            />
          </SimpleGrid>
        </Box>

        {/* Recent Workouts */}
        <Box>
          <Heading size="md" mb={4}>Recent Workouts</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {mockRecentWorkouts.map((workout) => (
              <Card
                key={workout.id}
                bg={colorMode === 'dark' ? 'gray.700' : 'white'}
                onClick={() => navigate(`/workout-log/${workout.id}`)}
                cursor="pointer"
                _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                transition="all 0.2s"
              >
                <CardHeader>
                  <Heading size="sm">{workout.name}</Heading>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(workout.date).toLocaleDateString()}
                  </Text>
                </CardHeader>
                <CardBody>
                  <VStack align="stretch" spacing={2}>
                    {workout.exercises.map((exercise, index) => (
                      <Text key={index} fontSize="sm">
                        {exercise.name}: {exercise.sets}x{exercise.reps} @ {exercise.weight}lbs
                      </Text>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* Workout Templates */}
        <Box>
          <Heading size="md" mb={4}>Workout Templates</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {mockTemplates.map((template) => (
              <Card
                key={template.id}
                bg={colorMode === 'dark' ? 'gray.700' : 'white'}
                onClick={() => navigate(`/templates/${template.id}`)}
                cursor="pointer"
                _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                transition="all 0.2s"
              >
                <CardHeader>
                  <Heading size="sm">{template.name}</Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="stretch" spacing={2}>
                    {template.exercises.map((exercise, index) => (
                      <Text key={index} fontSize="sm">
                        {exercise}
                      </Text>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>

        {/* Progress Charts - To be implemented */}
        <Box>
          <Heading size="md" mb={4}>Progress</Heading>
          <Text>Progress charts will be implemented here</Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default Dashboard; 