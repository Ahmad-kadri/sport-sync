import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
}

const useFetchParticipants = (groupId: string) => {
  const [participants, setParticipants] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const participantsCollection = collection(db, 'groups', groupId, 'participants');
        const querySnapshot = await getDocs(participantsCollection);
        const participantsList: User[] = [];
        querySnapshot.forEach((doc) => {
          participantsList.push({ id: doc.id, ...doc.data() } as User);
        });
        setParticipants(participantsList);
      } catch (error) {
        console.error('Error fetching participants:', error);
        setError('Error fetching participants. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchParticipants();
    }
  }, [groupId]);

  const addParticipant = async (user: Omit<User, 'id'>) => {
    try {
      const participantsCollection = collection(db, 'groups', groupId, 'participants');
      const docRef = await addDoc(participantsCollection, user);
      setParticipants((prev) => [...prev, { id: docRef.id, ...user }]);
    } catch (error) {
      console.error('Error adding participant:', error);
      setError('Error adding participant. Please try again.');
    }
  };

  const deleteParticipant = async (userId: string) => {
    try {
      const participantDocRef = doc(db, 'groups', groupId, 'participants', userId);
      await deleteDoc(participantDocRef);
      setParticipants((prev) => prev.filter((participant) => participant.id !== userId));
    } catch (error) {
      console.error('Error deleting participant:', error);
      setError('Error deleting participant. Please try again.');
    }
  };

  return { participants, loading, error, addParticipant, deleteParticipant };
};

export default useFetchParticipants;