import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  Spinner,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  List,
  ListItem,
} from '@chakra-ui/react';

const APP_ID = import.meta.env.VITE_PARSE_APP_ID;
const REST_KEY = import.meta.env.VITE_PARSE_REST_KEY;
const API_URL = 'https://parseapi.back4app.com/classes/Exercises?limit=1000';

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const modal = useDisclosure();

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_URL, {
          headers: {
            'X-Parse-Application-Id': APP_ID,
            'X-Parse-REST-API-Key': REST_KEY,
          },
        });
        const data = await res.json();
        const sorted = data.results.sort((a, b) =>
          a.Exercise_Name.localeCompare(b.Exercise_Name)
        );
        setExercises(sorted);
        setFiltered(sorted);
      } catch (err) {
        setExercises([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(exercises);
    } else {
      setFiltered(
        exercises.filter((ex) =>
          ex.Exercise_Name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, exercises]);

  const handleSelect = (ex) => {
    setSelected(ex);
    modal.onOpen();
  };

  return (
  <Box flex="1" width="100%" height="100%" p={4} bg="gray.100">
    <Heading size="xl" mb={4}>Exercises</Heading>
    <Input
      placeholder="Search exercises..."
      mb={4}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      width="100%"
    />
    {loading ? (
      <Spinner size="lg" />
    ) : (
      // Center the white box horizontally
      <Box display="flex" justifyContent="center" width="100%">
        <Box
          //maxH="600px"
          overflowY="auto"
          borderRadius="md"
          borderWidth={1}
          borderColor="gray.200"
          p={2}
          minHeight="400px"
          bg="white"
          width="100%"
          //maxW="500px" // <-- Set a max width for the list card
        >
          <List spacing={2} width="100%">
            {filtered.map((ex) => (
              <ListItem
                key={ex.objectId}
                p={3}
                borderRadius="md"
                _hover={{ bg: 'orange.50', cursor: 'pointer' }}
                onClick={() => handleSelect(ex)}
                width="100%"
                display="block"
              >
                <Text fontWeight="medium">{ex.Exercise_Name}</Text>
                <Text fontSize="sm" color="gray.500">{ex.Equipment}</Text>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    )}
    <Modal isOpen={modal.isOpen} onClose={modal.onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{selected?.Exercise_Name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="start" spacing={3}>
            <Text><b>Equipment:</b> {selected?.Equipment || 'N/A'}</Text>
            <Text><b>Preparation:</b> {selected?.Preparation || 'N/A'}</Text>
            <Text><b>Target Muscles:</b> {selected?.Target_Muscles || 'N/A'}</Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  </Box>
  );
};

export default ExercisesPage;