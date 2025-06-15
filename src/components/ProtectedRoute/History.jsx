import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  HStack,
  VStack,
  Badge,
  IconButton,
  useToast,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from '@chakra-ui/react';
import { FiEdit2 } from 'react-icons/fi';
import Parse from '../../parseConfig';

const APP_ID = 'wZx2txCduEKOjoqh6Pln5mFQlkYTyis38Iv8CcSk';
const REST_KEY = 'FkYgj1b3gFCmTefCqKUma58wpNVULpcmvslQyKBV';
const TRACKED_API = 'https://parseapi.back4app.com/classes/TrackedWorkouts?limit=1000';

function groupBySession(workouts) {
  // Group by session_key if present, else by Date+Workout_Name
  const map = new Map();
  workouts.forEach((w) => {
    const key = w.session_key ? String(w.session_key) : `${w.Date}_${w.Workout_Name}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(w);
  });
  return Array.from(map.values());
}

function calcTotalWeight(session) {
  return session.reduce((sum, s) => sum + ((s.Weight || 0) * (s.Reps || 0)), 0);
}

function calcDuration(session) {
  // Use the Duration field from the first row
  return session[0]?.Duration || '0:00';
}

function getExercisesSummary(session) {
  // Unique exercise names
  const names = Array.from(new Set(session.map((s) => s.Exercise_Name)));
  return names.join(', ');
}

function calcPRs(session, allSessions, userId) {
  // For each exercise in this session, count if any set is a PR (heaviest weight*reps ever for that user)
  let prCount = 0;
  const prevSets = allSessions.filter(s => s.userId === userId && (!s.session_key || s.session_key !== session[0].session_key));
  const prevBest = {};
  prevSets.forEach(s => {
    const key = s.Exercise_Name;
    const val = (s.Weight || 0) * (s.Reps || 0);
    if (!prevBest[key] || val > prevBest[key]) prevBest[key] = val;
  });
  // For each exercise in this session, check if any set beats previous best
  const checked = new Set();
  session.forEach(s => {
    const key = s.Exercise_Name;
    const val = (s.Weight || 0) * (s.Reps || 0);
    if (!checked.has(key) && (val > (prevBest[key] || 0))) {
      prCount++;
      checked.add(key);
    }
  });
  return prCount;
}

const History = () => {
  const [sessions, setSessions] = useState([]);
  const [allSets, setAllSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editSession, setEditSession] = useState(null);
  const [editData, setEditData] = useState([]);
  const toast = useToast();
  const user = Parse.User.current();
  const userId = user?.id;

  useEffect(() => {
    const fetchWorkouts = async () => {
      setLoading(true);
      try {
        const res = await fetch(TRACKED_API, {
          headers: {
            'X-Parse-Application-Id': APP_ID,
            'X-Parse-REST-API-Key': REST_KEY,
          },
        });
        const data = await res.json();
        const userSets = data.results.filter((w) => w.userId === userId);
        setAllSets(userSets);
        // Group by session
        const grouped = groupBySession(userSets).sort((a, b) => new Date(b[0].Date) - new Date(a[0].Date));
        setSessions(grouped);
      } catch (err) {
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, [userId]);

  const handleEdit = (session) => {
    setEditSession(session);
    setEditData(session.map(s => ({ ...s }))); // deep copy
  };

  const handleEditChange = (idx, field, value) => {
    setEditData((prev) => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handleSaveEdit = async () => {
    try {
      for (const s of editData) {
        await fetch(`${TRACKED_API}/${s.objectId}`, {
          method: 'PUT',
          headers: {
            'X-Parse-Application-Id': APP_ID,
            'X-Parse-REST-API-Key': REST_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(s),
        });
      }
      toast({ title: 'Workout updated', status: 'success', duration: 3000, isClosable: true });
      setEditSession(null);
      window.location.reload();
    } catch (err) {
      toast({ title: 'Error updating workout', description: err.message, status: 'error' });
    }
  };

  return (
    <Box maxW="1200px" mx="auto" p={4}>
      <Heading size="lg" mb={6}>Workout History</Heading>
      {loading ? <Spinner size="lg" /> : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {sessions.map((session, idx) => (
            <Card key={idx} variant="outline">
              <CardHeader>
                <HStack justify="space-between" align="center">
                  <VStack align="start" spacing={0}>
                    <Heading size="md">{session[0].Workout_Name}</Heading>
                    <Text color="gray.500" fontSize="sm">{session[0].Date}</Text>
                  </VStack>
                  <IconButton
                    icon={<FiEdit2 />}
                    onClick={() => handleEdit(session)}
                    variant="ghost"
                    colorScheme="orange"
                    aria-label="Edit workout"
                  />
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <HStack justify="space-between">
                    <Text>Duration:</Text>
                    <Text fontWeight="medium">{calcDuration(session)}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>Total Weight:</Text>
                    <Text fontWeight="medium">{calcTotalWeight(session)} kg</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text>Personal Records:</Text>
                    <Badge colorScheme="green" fontSize="sm">
                      {calcPRs(session, allSets, userId)} PRs
                    </Badge>
                  </HStack>
                  <Box pt={2}>
                    <Text fontWeight="medium" mb={2}>Exercises:</Text>
                    <Text fontSize="sm">
                      {getExercisesSummary(session)}
                    </Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
      {/* Edit Modal */}
      <Modal isOpen={!!editSession} onClose={() => setEditSession(null)} size="4xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Workout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editData.map((s, idx) => (
              <Box key={s.objectId} mb={4} borderWidth={1} borderRadius="md" p={3}>
                <HStack mb={2}>
                  <Input
                    value={s.Workout_Name}
                    onChange={e => handleEditChange(idx, 'Workout_Name', e.target.value)}
                    placeholder="Workout Name"
                  />
                  <Input
                    value={s.Date}
                    onChange={e => handleEditChange(idx, 'Date', e.target.value)}
                    placeholder="Date"
                  />
                  <Input
                    value={s.Duration}
                    onChange={e => handleEditChange(idx, 'Duration', e.target.value)}
                    placeholder="Duration"
                  />
                </HStack>
                <HStack mb={2}>
                  <Input
                    value={s.Exercise_Name}
                    onChange={e => handleEditChange(idx, 'Exercise_Name', e.target.value)}
                    placeholder="Exercise Name"
                  />
                  <Input
                    value={s.Equipment}
                    onChange={e => handleEditChange(idx, 'Equipment', e.target.value)}
                    placeholder="Equipment"
                  />
                  <Input
                    value={s.Weight}
                    type="number"
                    onChange={e => handleEditChange(idx, 'Weight', e.target.value)}
                    placeholder="Weight"
                  />
                  <Input
                    value={s.Reps}
                    type="number"
                    onChange={e => handleEditChange(idx, 'Reps', e.target.value)}
                    placeholder="Reps"
                  />
                  <Input
                    value={s.Set_Order}
                    type="number"
                    onChange={e => handleEditChange(idx, 'Set_Order', e.target.value)}
                    placeholder="Set Order"
                  />
                </HStack>
                <HStack mb={2}>
                  <Input
                    value={s.Target_Muscles}
                    onChange={e => handleEditChange(idx, 'Target_Muscles', e.target.value)}
                    placeholder="Target Muscles"
                  />
                  <Input
                    value={s.Preparation}
                    onChange={e => handleEditChange(idx, 'Preparation', e.target.value)}
                    placeholder="Preparation"
                  />
                  <Input
                    value={s.Notes}
                    onChange={e => handleEditChange(idx, 'Notes', e.target.value)}
                    placeholder="Notes"
                  />
                </HStack>
              </Box>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="orange" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default History; 