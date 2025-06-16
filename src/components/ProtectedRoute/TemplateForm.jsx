import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  Box,
  IconButton,
  useToast,
  Select,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import Parse from '../../parseConfig';

const EXERCISES_API = 'https://parseapi.back4app.com/classes/Exercises?limit=1000';
const TEMPLATES_API = 'https://parseapi.back4app.com/classes/WorkoutTemplates';
const APP_ID = import.meta.env.VITE_PARSE_APP_ID;
const REST_KEY = import.meta.env.VITE_PARSE_REST_KEY;

const TemplateForm = ({ isOpen, onClose, template, onSave }) => {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [exercises, setExercises] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const user = Parse.User.current();
  const userId = user?.id;

  useEffect(() => {
    if (template) {
      setName(template.name);
      setGoal(template.goal);
      // Ensure exercises is always an array with proper structure
      setExercises(template.exercises || []);
    } else {
      setName('');
      setGoal('');
      setExercises([]);
    }
  }, [template]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch(EXERCISES_API, {
          headers: {
            'X-Parse-Application-Id': APP_ID,
            'X-Parse-REST-API-Key': REST_KEY,
          },
        });
        const data = await res.json();
        const all = data.results.filter(
          (ex) => !ex.userId || ex.userId === userId
        );
        setAvailableExercises(all);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setAvailableExercises([]);
      }
    };
    fetchExercises();
  }, [userId]);

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', muscle: '' }]);
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
  };

  const handleExerciseSelect = (index, exerciseName) => {
    const selected = availableExercises.find(
      (ex) => ex.Exercise_Name === exerciseName
    );
    
    if (selected) {
      handleExerciseChange(index, 'name', selected.Exercise_Name);
      handleExerciseChange(index, 'muscle', selected.Target_Muscles);
    }
  };

  const handleSubmit = async () => {
    if (!name || exercises.length === 0) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate that all exercises have names
    const incompleteExercises = exercises.filter(ex => !ex.name || !ex.muscle);
    if (incompleteExercises.length > 0) {
      toast({
        title: 'Error',
        description: 'Please select an exercise for all entries',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name,
        goal,
        exercises, // This should now contain proper name and muscle data
        userId,
        lastPerformed: null,
      };

      console.log('Saving template with payload:', payload); // Debug log

      let response;
      if (template?.objectId) {
        // Update existing template
        response = await fetch(`${TEMPLATES_API}/${template.objectId}`, {
          method: 'PUT',
          headers: {
            'X-Parse-Application-Id': APP_ID,
            'X-Parse-REST-API-Key': REST_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new template
        response = await fetch(TEMPLATES_API, {
          method: 'POST',
          headers: {
            'X-Parse-Application-Id': APP_ID,
            'X-Parse-REST-API-Key': REST_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Template saved successfully:', result); // Debug log

      toast({
        title: 'Success',
        description: `Template ${template ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save template',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{template ? 'Edit Template' : 'Create Template'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {console.log('Available exercises:', availableExercises)}
          {console.log('Current exercises state:', exercises)}
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Template Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter template name"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Goal</FormLabel>
              <Input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., finish in 45 mins"
              />
            </FormControl>

            <Box w="100%">
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="medium">Exercises</Text>
                <Button
                  leftIcon={<FiPlus />}
                  size="sm"
                  onClick={handleAddExercise}
                >
                  Add Exercise
                </Button>
              </HStack>

              <VStack spacing={2} align="stretch">
                {exercises.map((exercise, index) => (
                  <HStack key={index}>
                    <Box flex="1">
                      <Select
                        value={exercise.name || ''}
                        onChange={(e) => handleExerciseSelect(index, e.target.value)}
                        placeholder="Select exercise"
                      >
                        {availableExercises.map((ex) => (
                          <option key={ex.objectId} value={ex.Exercise_Name}>
                            {ex.Exercise_Name}
                          </option>
                        ))}
                      </Select>
                      {exercise.muscle && (
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          Target: {exercise.muscle}
                        </Text>
                      )}
                    </Box>
                    <IconButton
                      icon={<FiTrash2 />}
                      onClick={() => handleRemoveExercise(index)}
                      aria-label="Remove exercise"
                      colorScheme="red"
                      variant="ghost"
                    />
                  </HStack>
                ))}
                {exercises.length === 0 && (
                  <Text color="gray.500" textAlign="center" py={4}>
                    No exercises added yet. Click "Add Exercise" to get started.
                  </Text>
                )}
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={exercises.length === 0}
          >
            {template ? 'Update' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TemplateForm;