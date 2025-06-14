import { useEffect, useState } from 'react';
import { Box, Button, Heading, Table, Thead, Tbody, Tr, Th, Td, IconButton, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

const getLogs = () => JSON.parse(localStorage.getItem('workoutLogs') || '[]');
const saveLogs = (logs) => localStorage.setItem('workoutLogs', JSON.stringify(logs));

const WorkoutLogList = () => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  const handleDelete = (id) => {
    const updated = logs.filter((log) => log.id !== id);
    setLogs(updated);
    saveLogs(updated);
  };

  return (
    <Box>
      <Stack direction="row" justify="space-between" align="center" mb={4}>
        <Heading size="md">Workout Logs</Heading>
        <Button colorScheme="orange" onClick={() => navigate('new')}>Add Workout</Button>
      </Stack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Intensity</Th>
            <Th>Rest Time (s)</Th>
            <Th>Exercises</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {logs.map((log) => (
            <Tr key={log.id}>
              <Td>{log.completed_at}</Td>
              <Td>{log.intensity_level}</Td>
              <Td>{log.rest_time}</Td>
              <Td>{log.exercises.length}</Td>
              <Td>
                <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" mr={2} onClick={() => navigate(`${log.id}/edit`)} />
                <IconButton aria-label="Delete" icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => handleDelete(log.id)} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default WorkoutLogList; 