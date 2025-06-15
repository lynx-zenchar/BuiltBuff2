import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  Box,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const placeholderImg = 'https://via.placeholder.com/40x40?text=Ex';

const TemplateModal = ({ isOpen, onClose, template, onStartWorkout }) => {
  if (!template) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{template.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text color="gray.500" fontSize="sm" mb={1}>
            Last Performed: {template.lastPerformed || 'Never'}
          </Text>
          <Text color="gray.600" mb={3}>
            Goal: {template.goal}
          </Text>
          <VStack align="stretch" spacing={3}>
            {template.exercises.map((ex, idx) => (
              <HStack key={idx} align="center">
                <Box>
                  <Text fontWeight="medium">{ex.name}</Text>
                  <Text fontSize="sm" color="gray.500">{ex.muscle}</Text>
                </Box>
              </HStack>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" w="100%" onClick={() => onStartWorkout(template)}>
            Start Workout
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TemplateModal; 