import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
}

const useFetchParticipants = (groupId: string) => {
  const [participants, setParticipants] = useState<User[]>([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const participantsCollection = collection(db, 'groups', groupId, 'participants');
        const querySnapshot = await getDocs(participantsCollection);
        const participantsList: User[] = [];
        querySnapshot.forEach((doc) => {
          participantsList.push({ id: doc.id, ...doc.data() } as User);
        });
        setParticipants(participantsList);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
  }, [groupId]);

  return participants;
};

export default useFetchParticipants;
