import { useState } from 'react';
import { doc, updateDoc, collection, deleteDoc, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the import path based on your file structure
import { Participant } from '../Group/GroupList';


interface UpdateGroupParams {
  groupId: string;
  title: string;
  description: string;
  location: string;
  time: string;
  selectedParticipants: Participant[];
}

const useUpdateGroup = () => {
  const [message, setMessage] = useState<string>('');

  const updateGroup = async ({
    groupId,
    title,
    description,
    location,
    time,
    selectedParticipants,
  }: UpdateGroupParams) => {
    if (!groupId) {
      setMessage('Group ID is required.');
      return;
    }

    try {
      const groupDocRef = doc(db, 'groups', groupId);

      // Update group details
      await updateDoc(groupDocRef, {
        title,
        description,
        location,
        time,
      });

      // Handle participants
      const participantsCollection = collection(db, 'groups', groupId, 'participants');

      // Remove all existing participants
      const existingParticipantsSnapshot = await getDocs(participantsCollection);
      const removePromises = existingParticipantsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(removePromises);

      // Add new participants
      const addPromises = selectedParticipants.map(participant =>
        addDoc(participantsCollection, participant)
      );
      await Promise.all(addPromises);

      setMessage('Group updated successfully!');
    } catch (error) {
      console.error('Error updating group:', error);
      setMessage('Error updating group. Please try again.');
    }
  };

  return { updateGroup, message };
};

export default useUpdateGroup;