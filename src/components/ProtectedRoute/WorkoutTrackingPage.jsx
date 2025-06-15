import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Input,
  IconButton,
  Badge,
  Divider,
  useToast,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiFlag, FiEdit2 } from 'react-icons/fi';
import Parse from '../../parseConfig';
import { useLocation } from 'react-router-dom';

const EXERCISES_API = 'https://parseapi.back4app.com/classes/Exercises?limit=1000';
const TRACKED_API = 'https://parseapi.back4app.com/classes/TrackedWorkouts';
const APP_ID = 'wZx2txCduEKOjoqh6Pln5mFQlkYTyis38Iv8CcSk';
const REST_KEY = 'FkYgj1b3gFCmTefCqKUma58wpNVULpcmvslQyKBV';

const defaultSet = { weight: '', reps: '', failed: false };

const WorkoutTrackingPage = () => {
  const location = useLocation();
  const templateState = location.state;

  const [exercisesDB, setExercisesDB] = useState([]);
  const [workout, setWorkout] = useState(() => {
    if (templateState && templateState.exercises) {
      return {
        name: templateState.name || '',
        date: new Date().toISOString().slice(0, 10),
        goal: templateState.goal || '',
        exercises: templateState.exercises,
        notes: '',
      };
    }
    return {
      name: '',
      date: new Date().toISOString().slice(0, 10),
      goal: '',
      exercises: [],
      notes: '',
    };
  });
  const [search, setSearch] = useState('');
  const [addingExercise, setAddingExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: '', muscle: '', equipment: '', preparation: '' });
  const [timer, setTimer] = useState(0);
  const timerRef = useRef();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [exerciseModal, setExerciseModal] = useState(null);
  const modal = useDisclosure();

  // Debounced search for Add Exercise modal
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Get current userId
  const user = Parse.User.current();
  const userId = user?.id;

  // Timer logic
  useEffect(() => {
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Fetch exercises from Back4App
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
        // Show global + user-specific
        const all = data.results.filter(
          (ex) => !ex.userId || ex.userId === userId
        );
        setExercisesDB(all);
      } catch (err) {
        setExercisesDB([]);
      }
    };
    fetchExercises();
  }, [userId]);

  // Add exercise to session
  const handleAddExercise = (exerciseObj) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          ...exerciseObj,
          sets: [
            { ...defaultSet },
            { ...defaultSet },
            { ...defaultSet },
          ],
        },
      ],
    }));
    setAddingExercise(false);
    setNewExercise({ name: '', muscle: '', equipment: '', preparation: '' });
    setSearch('');
  };

  // Remove exercise from session
  const handleRemoveExercise = (exIdx) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== exIdx),
    }));
  };

  // Set CRUD
  const handleSetChange = (exIdx, setIdx, field, value) => {
    setWorkout((prev) => {
      const newExercises = prev.exercises.map((ex, i) => {
        if (i !== exIdx) return ex;
        const newSets = ex.sets.map((set, j) =>
          j === setIdx ? { ...set, [field]: value } : set
        );
        return { ...ex, sets: newSets };
      });
      return { ...prev, exercises: newExercises };
    });
  };
  const handleToggleFailed = (exIdx, setIdx) => {
    setWorkout((prev) => {
      const newExercises = prev.exercises.map((ex, i) => {
        if (i !== exIdx) return ex;
        const newSets = ex.sets.map((set, j) =>
          j === setIdx ? { ...set, failed: !set.failed } : set
        );
        return { ...ex, sets: newSets };
      });
      return { ...prev, exercises: newExercises };
    });
  };
  const handleAddSet = (exIdx) => {
    setWorkout((prev) => {
      const newExercises = prev.exercises.map((ex, i) => {
        if (i !== exIdx) return ex;
        return {
          ...ex,
          sets: [...ex.sets, { ...defaultSet }],
        };
      });
      return { ...prev, exercises: newExercises };
    });
  };
  const handleRemoveSet = (exIdx, setIdx) => {
    setWorkout((prev) => {
      const newExercises = prev.exercises.map((ex, i) => {
        if (i !== exIdx) return ex;
        return {
          ...ex,
          sets: ex.sets.filter((_, j) => j !== setIdx),
        };
      });
      return { ...prev, exercises: newExercises };
    });
  };

  // Save workout to Back4App
  const handleFinish = async () => {
    if (!userId) {
      toast({ title: 'Not logged in', status: 'error' });
      return;
    }
    setSaving(true);
    try {
      // Flatten each set as a row for TrackedWorkouts
      const rows = [];
      workout.exercises.forEach((ex, exIdx) => {
        ex.sets.forEach((set, setIdx) => {
          rows.push({
            userId,
            Date: new Date().toISOString().slice(0, 10),
            Workout_Name: workout.name,
            Exercise_Name: ex.name,
            Equipment: ex.equipment,
            Set_Order: setIdx + 1,
            Weight: set.weight ? Number(set.weight) : null,
            Reps: set.reps ? Number(set.reps) : null,
            Notes: workout.notes,
            Duration: `${Math.floor(timer / 60)}:${('0' + (timer % 60)).slice(-2)}`,
            Seconds: timer,
            Target_Muscles: ex.muscle,
            Preparation: ex.preparation,
            // Only include fields that exist in the schema
            // Remove: Failed (not in schema), and any undefined fields
          });
        });
      });
      // Save each row
      for (const row of rows) {
        // Remove undefined/null fields not in schema
        const payload = {
          userId: row.userId,
          Date: row.Date,
          Workout_Name: row.Workout_Name,
          Exercise_Name: row.Exercise_Name,
          Equipment: row.Equipment,
          Set_Order: row.Set_Order,
          Weight: row.Weight,
          Reps: row.Reps,
          Notes: row.Notes,
          Duration: row.Duration,
          Seconds: row.Seconds,
          Target_Muscles: row.Target_Muscles,
          Preparation: row.Preparation,
        };
        const response = await fetch(TRACKED_API, {
          method: 'POST',
          headers: {
            'X-Parse-Application-Id': APP_ID,
            'X-Parse-REST-API-Key': REST_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Back4App save error:', errorData);
          throw new Error(errorData.error || 'Failed to save workout');
        }
      }
      toast({ title: 'Workout Finished', description: 'Your workout has been saved!', status: 'success', duration: 3000, isClosable: true });
      setWorkout({ name: '', date: new Date().toISOString().slice(0, 10), goal: '', exercises: [], notes: '' });
      setTimer(0);
    } catch (err) {
      toast({ title: 'Error saving workout', description: err.message, status: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Add new user-specific exercise to Back4App
  const handleCreateNewExercise = async () => {
    if (!userId || !newExercise.name) return;
    try {
      const res = await fetch(EXERCISES_API, {
        method: 'POST',
        headers: {
          'X-Parse-Application-Id': APP_ID,
          'X-Parse-REST-API-Key': REST_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Exercise_Name: newExercise.name,
          Equipment: newExercise.equipment,
          Preparation: newExercise.preparation,
          Target_Muscles: newExercise.muscle,
          userId,
        }),
      });
      const data = await res.json();
      const created = {
        objectId: data.objectId,
        Exercise_Name: newExercise.name,
        Equipment: newExercise.equipment,
        Preparation: newExercise.preparation,
        Target_Muscles: newExercise.muscle,
        userId,
      };
      setExercisesDB((prev) => [...prev, created]);
      handleAddExercise({
        name: created.Exercise_Name,
        muscle: created.Target_Muscles,
        equipment: created.Equipment,
        preparation: created.Preparation,
      });
    } catch (err) {
      toast({ title: 'Error creating exercise', description: err.message, status: 'error' });
    }
  };

  // Memoized filtered and limited exercise options
  const exerciseOptions = useMemo(() => {
    return exercisesDB.filter(
      (ex) =>
        !workout.exercises.some((e) => e.name === ex.Exercise_Name) &&
        ex.Exercise_Name.toLowerCase().includes(debouncedSearch.toLowerCase())
    ).slice(0, 20);
  }, [exercisesDB, workout.exercises, debouncedSearch]);

  return (
    <Box maxW="900px" mx="auto" p={4}>
      <Card bg="white" boxShadow="xl" p={6} borderRadius="lg" mb={8}>
        <CardBody>
          <HStack justify="space-between" mb={4}>
            <Heading size="lg">{workout.name || 'New Workout'}</Heading>
            <Button colorScheme="green" onClick={handleFinish} isLoading={saving}>
              Finish
            </Button>
          </HStack>
          <Text color="gray.500" mb={2}>{workout.date}</Text>
          <Text color="gray.600" mb={4}>Elapsed Time: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</Text>
          <Input
            placeholder="Workout Name"
            mb={2}
            value={workout.name}
            onChange={(e) => setWorkout((prev) => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder="Goal (optional)"
            mb={2}
            value={workout.goal}
            onChange={(e) => setWorkout((prev) => ({ ...prev, goal: e.target.value }))}
          />
          <Input
            placeholder="Notes (optional)"
            mb={4}
            value={workout.notes}
            onChange={(e) => setWorkout((prev) => ({ ...prev, notes: e.target.value }))}
          />
          <Divider mb={4} />
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            mb={4}
            onClick={() => setAddingExercise(true)}
          >
            Add Exercise
          </Button>
          {workout.exercises.map((ex, exIdx) => (
            <Card key={exIdx} mb={8} bg="white" boxShadow="md">
              <CardBody>
                <HStack justify="space-between">
                  <Box>
                    <Heading size="md" mb={1}>{ex.name}</Heading>
                    <Text color="gray.500">{ex.muscle}</Text>
                    <Text color="gray.400" fontSize="sm">{ex.equipment}</Text>
                  </Box>
                  <IconButton
                    icon={<FiTrash2 />}
                    aria-label="Remove Exercise"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleRemoveExercise(exIdx)}
                  />
                </HStack>
                <VStack align="stretch" spacing={2} mt={2}>
                  {ex.sets.map((set, setIdx) => (
                    <HStack key={setIdx}>
                      <Badge colorScheme={set.failed ? 'red' : 'gray'}>
                        {set.failed ? 'F' : setIdx + 1}
                      </Badge>
                      <Input
                        placeholder="Weight"
                        type="number"
                        value={set.weight}
                        onChange={(e) => handleSetChange(exIdx, setIdx, 'weight', e.target.value)}
                        width="100px"
                      />
                      <Input
                        placeholder="Reps"
                        type="number"
                        value={set.reps}
                        onChange={(e) => handleSetChange(exIdx, setIdx, 'reps', e.target.value)}
                        width="100px"
                      />
                      <IconButton
                        icon={<FiFlag />}
                        aria-label="Toggle Failed"
                        colorScheme={set.failed ? 'red' : 'gray'}
                        variant={set.failed ? 'solid' : 'outline'}
                        onClick={() => handleToggleFailed(exIdx, setIdx)}
                      />
                      <IconButton
                        icon={<FiTrash2 />}
                        aria-label="Remove Set"
                        colorScheme="red"
                        variant="ghost"
                        isDisabled={ex.sets.length === 1}
                        onClick={() => handleRemoveSet(exIdx, setIdx)}
                      />
                    </HStack>
                  ))}
                  <Button
                    leftIcon={<FiPlus />}
                    onClick={() => handleAddSet(exIdx)}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    alignSelf="flex-start"
                  >
                    Add Set
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </CardBody>
      </Card>
      {/* Add Exercise Modal */}
      <Modal isOpen={addingExercise} onClose={() => setAddingExercise(false)} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Exercise</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Search or add exercise name..."
              mb={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <VStack align="stretch" spacing={2} maxH="300px" overflowY="auto">
              {exerciseOptions.map((ex) => (
                <Button
                  key={ex.objectId}
                  variant="ghost"
                  justifyContent="flex-start"
                  onClick={() => handleAddExercise({
                    name: ex.Exercise_Name,
                    muscle: ex.Target_Muscles,
                    equipment: ex.Equipment,
                    preparation: ex.Preparation,
                  })}
                >
                  <Box textAlign="left">
                    <Text fontWeight="medium">{ex.Exercise_Name}</Text>
                    <Text fontSize="sm" color="gray.500">{ex.Equipment}</Text>
                  </Box>
                </Button>
              ))}
            </VStack>
            {/* If not found, allow creating new */}
            {search && !exerciseOptions.some((ex) => ex.Exercise_Name.toLowerCase() === search.toLowerCase()) && (
              <Box mt={4}>
                <Text mb={2} fontWeight="bold">Create new exercise:</Text>
                <Input
                  placeholder="Exercise Name"
                  mb={2}
                  value={newExercise.name}
                  onChange={(e) => setNewExercise((prev) => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Target Muscles"
                  mb={2}
                  value={newExercise.muscle}
                  onChange={(e) => setNewExercise((prev) => ({ ...prev, muscle: e.target.value }))}
                />
                <Input
                  placeholder="Equipment"
                  mb={2}
                  value={newExercise.equipment}
                  onChange={(e) => setNewExercise((prev) => ({ ...prev, equipment: e.target.value }))}
                />
                <Input
                  placeholder="Preparation"
                  mb={2}
                  value={newExercise.preparation}
                  onChange={(e) => setNewExercise((prev) => ({ ...prev, preparation: e.target.value }))}
                />
                <Button colorScheme="orange" onClick={handleCreateNewExercise} isFullWidth>
                  Create and Add
                </Button>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default WorkoutTrackingPage; 