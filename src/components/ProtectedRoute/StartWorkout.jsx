import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Text,
  HStack,
  IconButton,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import TemplateModal from './TemplateModal';
import { useNavigate } from 'react-router-dom';

// Updated template data with full exercise lists
const globalTemplates = [
  {
    id: 'global-push',
    name: 'Push',
    goal: 'finish in 45 mins',
    lastPerformed: '2025-04-15',
    exercises: [
      { name: 'Bench Press (Dumbbell)', muscle: 'Chest' },
      { name: 'Incline Bench Press (Dumbbell)', muscle: 'Chest' },
      { name: 'Arnold Press (Dumbbell)', muscle: 'Shoulders' },
      { name: 'Bench Dip', muscle: 'Arms' },
      { name: 'Lateral Raise (Dumbbell)', muscle: 'Shoulders' },
      { name: 'Triceps Extension', muscle: 'Arms' },
      { name: 'Flat Leg Raise', muscle: 'Core' },
    ],
    isGlobal: true,
  },
  {
    id: 'global-pull',
    name: 'Pull',
    goal: 'finish in 45 mins',
    lastPerformed: '2025-02-20',
    exercises: [
      { name: 'Pull Up', muscle: 'Back' },
      { name: 'Bent Over One Arm Row', muscle: 'Back' },
      { name: 'Lat Pulldown (Cable)', muscle: 'Back' },
      { name: 'Face Pull (Cable)', muscle: 'Shoulders' },
      { name: 'Bicep Curl (Dumbbell)', muscle: 'Arms' },
      { name: 'Hammer Curl (Dumbbell)', muscle: 'Arms' },
      { name: 'Russian Twist', muscle: 'Core' },
    ],
    isGlobal: true,
  },
  {
    id: 'global-legs',
    name: 'Leg',
    goal: 'finish in 45 mins',
    lastPerformed: '2025-03-10',
    exercises: [
      { name: 'Hip Thrust', muscle: 'Glutes' },
      { name: 'Bulgarian Split Squat', muscle: 'Legs' },
      { name: 'Romanian Deadlift', muscle: 'Legs' },
      { name: 'Seated Calf Raise', muscle: 'Legs' },
      { name: 'Reverse Hypers', muscle: 'Back' },
      { name: 'Hanging Leg Raise', muscle: 'Core' },
    ],
    isGlobal: true,
  },
];

const userTemplatesMock = [
  {
    id: 'user-1',
    name: 'Custom Upper',
    goal: 'finish in 50 mins',
    lastPerformed: '2025-05-01',
    exercises: [
      { name: 'Push Up', muscle: 'Chest' },
      { name: 'Pull Up', muscle: 'Back' },
    ],
    isGlobal: false,
  },
];

const StartWorkout = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userTemplates, setUserTemplates] = useState(userTemplatesMock);
  const templateModal = useDisclosure();
  const navigate = useNavigate();

  const handleOpenTemplate = (template) => {
    setSelectedTemplate(template);
    templateModal.onOpen();
  };

  const handleCloseTemplate = () => {
    setSelectedTemplate(null);
    templateModal.onClose();
  };

  const handleStartEmptyWorkout = () => {
    navigate('/track-workout/empty');
  };

  // Start workout from template: pass exercises as state
  const handleStartWorkoutFromTemplate = (template) => {
    const exercises = template.exercises.map((ex) => ({
      ...ex,
      sets: [
        { weight: '', reps: '', failed: false },
        { weight: '', reps: '', failed: false },
        { weight: '', reps: '', failed: false },
      ],
    }));
    navigate('/track-workout/temp', {
      state: {
        name: template.name,
        goal: template.goal,
        exercises,
      },
    });
    templateModal.onClose();
  };

  return (
    <Box maxW="900px" mx="auto" p={4}>
      <Heading size="xl" mb={4}>Start Workout</Heading>
      <Button colorScheme="orange" size="lg" mb={6} w="100%" onClick={handleStartEmptyWorkout}>
        Start an Empty Workout
      </Button>
      <HStack justify="space-between" mb={2}>
        <Heading size="md">Templates</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="blue" variant="ghost" size="sm">
          Template
        </Button>
      </HStack>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {[...globalTemplates, ...userTemplates].map((template) => (
          <Card
            key={template.id}
            variant="outline"
            onClick={() => handleOpenTemplate(template)}
            cursor="pointer"
            _hover={{
              boxShadow: 'lg',
              bg: 'orange.50',
              borderColor: 'orange.300',
              transition: 'all 0.2s',
            }}
          >
            <CardHeader pb={0}>
              <HStack justify="space-between">
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{template.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {template.lastPerformed ? `Last: ${template.lastPerformed}` : 'Never performed'}
                  </Text>
                </VStack>
                <HStack>
                  {!template.isGlobal && (
                    <>
                      <IconButton icon={<FiEdit2 />} size="sm" aria-label="Edit" variant="ghost" />
                      <IconButton icon={<FiTrash2 />} size="sm" aria-label="Delete" variant="ghost" />
                    </>
                  )}
                </HStack>
              </HStack>
            </CardHeader>
            <CardBody pt={2}>
              <Text fontSize="sm" noOfLines={2}>
                {template.exercises.map((ex) => ex.name).join(', ')}
              </Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
      <TemplateModal
        isOpen={templateModal.isOpen}
        onClose={handleCloseTemplate}
        template={selectedTemplate}
        onStartWorkout={handleStartWorkoutFromTemplate}
      />
    </Box>
  );
};

export default StartWorkout; 