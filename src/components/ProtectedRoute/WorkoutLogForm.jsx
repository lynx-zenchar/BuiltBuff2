import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Stack, Heading, NumberInput, NumberInputField, IconButton, HStack, Text } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

const EXERCISE_CATEGORIES = [
  { id: 'squat', name: 'Squat' },
  { id: 'bench', name: 'Bench Press' },
  { id: 'deadlift', name: 'Deadlift' },
  { id: 'row', name: 'Barbell Row' },
  { id: 'pullup', name: 'Pull Up' },
];

const getLogs = () => JSON.parse(localStorage.getItem('workoutLogs') || '[]');
const saveLogs = (logs) => localStorage.setItem('workoutLogs', JSON.stringify(logs));

const defaultExercise = { category_id: '', sets: 1, reps: 1 };

const WorkoutLogForm = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === 'edit';
  const [completed_at, setCompletedAt] = useState('');
  const [intensity_level, setIntensityLevel] = useState('medium');
  const [rest_time, setRestTime] = useState(60);
  const [exercises, setExercises] = useState([{ ...defaultExercise }]);

  useEffect(() => {
    if (isEdit && id) {
      const logs = getLogs();
      const log = logs.find((l) => l.id === id);
      if (log) {
        setCompletedAt(log.completed_at);
        setIntensityLevel(log.intensity_level);
        setRestTime(log.rest_time);
        setExercises(log.exercises);
      }
    }
  }, [isEdit, id]);

  const handleExerciseChange = (idx, field, value) => {
    setExercises((prev) => prev.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex));
  };

  const handleAddExercise = () => {
    setExercises((prev) => [...prev, { ...defaultExercise }]);
  };

  const handleRemoveExercise = (idx) => {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const logs = getLogs();
    if (isEdit && id) {
      const updated = logs.map((log) =>
        log.id === id
          ? { ...log, completed_at, intensity_level, rest_time, exercises }
          : log
      );
      saveLogs(updated);
    } else {
      const newLog = {
        id: Date.now().toString(),
        completed_at,
        intensity_level,
        rest_time,
        exercises,
      };
      saveLogs([...logs, newLog]);
    }
    navigate('/workout-log');
  };

  return (
    <Box as="form" onSubmit={handleSubmit} maxW="2xl" mx="auto" p={4} bg="white" borderRadius="md" boxShadow="md">
      <Heading size="md" mb={4}>{isEdit ? 'Edit Workout Log' : 'New Workout Log'}</Heading>
      <Stack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Date</FormLabel>
          <Input type="date" value={completed_at} onChange={(e) => setCompletedAt(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Intensity</FormLabel>
          <Select value={intensity_level} onChange={(e) => setIntensityLevel(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Rest Time (seconds)</FormLabel>
          <NumberInput min={0} value={rest_time} onChange={(_, v) => setRestTime(Number(v))}>
            <NumberInputField />
          </NumberInput>
        </FormControl>
        <Box>
          <FormLabel>Exercises</FormLabel>
          <Stack spacing={3}>
            {exercises.map((ex, idx) => (
              <HStack key={idx} align="flex-end">
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Category</FormLabel>
                  <Select
                    value={ex.category_id}
                    onChange={(e) => handleExerciseChange(idx, 'category_id', e.target.value)}
                  >
                    <option value="">Select</option>
                    {EXERCISE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Sets</FormLabel>
                  <NumberInput min={1} value={ex.sets} onChange={(_, v) => handleExerciseChange(idx, 'sets', Number(v))}>
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Reps</FormLabel>
                  <NumberInput min={1} value={ex.reps} onChange={(_, v) => handleExerciseChange(idx, 'reps', Number(v))}>
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <IconButton
                  aria-label="Remove Exercise"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => handleRemoveExercise(idx)}
                  isDisabled={exercises.length === 1}
                />
              </HStack>
            ))}
            <Button leftIcon={<AddIcon />} onClick={handleAddExercise} mt={2} colorScheme="orange" variant="outline">
              Add Exercise
            </Button>
          </Stack>
        </Box>
        <Button type="submit" colorScheme="orange" size="lg">
          {isEdit ? 'Update Workout Log' : 'Create Workout Log'}
        </Button>
        <Button variant="ghost" onClick={() => navigate('/workout-log')}>Cancel</Button>
      </Stack>
    </Box>
  );
};

export default WorkoutLogForm; 