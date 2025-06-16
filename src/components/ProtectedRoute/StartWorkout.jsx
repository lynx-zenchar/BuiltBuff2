import React, { useState, useEffect } from 'react';
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
  useToast,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import TemplateModal from './TemplateModal';
import TemplateForm from './TemplateForm';
import { useNavigate } from 'react-router-dom';
import Parse from '../../parseConfig';

const TEMPLATES_API = 'https://parseapi.back4app.com/classes/WorkoutTemplates';
const APP_ID = import.meta.env.VITE_PARSE_APP_ID;
const REST_KEY = import.meta.env.VITE_PARSE_REST_KEY;

// Global templates remain unchanged
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

const StartWorkout = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userTemplates, setUserTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const templateModal = useDisclosure();
  const templateFormModal = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const user = Parse.User.current();
  const userId = user?.id;

  useEffect(() => {
    fetchUserTemplates();
  }, [userId]);

  const fetchUserTemplates = async () => {
    try {
      const response = await fetch(`${TEMPLATES_API}?where={"userId":"${userId}"}`, {
        headers: {
          'X-Parse-Application-Id': APP_ID,
          'X-Parse-REST-API-Key': REST_KEY,
        },
      });
      const data = await response.json();
      setUserTemplates(data.results);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load templates',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

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

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    templateFormModal.onOpen();
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    templateFormModal.onOpen();
  };

  const handleDeleteTemplate = async (template) => {
    try {
      const response = await fetch(`${TEMPLATES_API}/${template.objectId}`, {
        method: 'DELETE',
        headers: {
          'X-Parse-Application-Id': APP_ID,
          'X-Parse-REST-API-Key': REST_KEY,
        },
      });
      if (!response.ok) throw new Error('Failed to delete template');
      
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      fetchUserTemplates();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box mx="auto" p={4}>
      <Heading size="xl" mb={4}>Start Workout</Heading>
      <Button colorScheme="orange" size="lg" mb={6} w="100%" onClick={handleStartEmptyWorkout}>
        Start an Empty Workout
      </Button>
      <HStack justify="space-between" mb={2}>
        <Heading size="md">Templates</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="blue" variant="ghost" size="sm" onClick={handleCreateTemplate}>
          Create Template
        </Button>
      </HStack>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {[...globalTemplates, ...userTemplates].map((template) => (
          <Card
            key={template.objectId || template.id}
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
                      <IconButton
                        icon={<FiEdit2 />}
                        size="sm"
                        aria-label="Edit"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTemplate(template);
                        }}
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        size="sm"
                        aria-label="Delete"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template);
                        }}
                      />
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
      <TemplateForm
        isOpen={templateFormModal.isOpen}
        onClose={templateFormModal.onClose}
        template={editingTemplate}
        onSave={fetchUserTemplates}
      />
    </Box>
  );
};

export default StartWorkout; 