import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

interface Group {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
}

interface useGroupParams {
  groupId: string;
  title?: string;
  description?: string;
  location?: string;
  time?: string;
}

const useGroup = (groupId: string) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchGroup = async () => {
      if (!groupId) return;

      try {
        const groupDocRef = doc(db, 'groups', groupId);
        const groupDoc = await getDoc(groupDocRef);

        if (groupDoc.exists()) {
          setGroup({ id: groupDoc.id, ...groupDoc.data() } as Group);
        } else {
          setMessage('Group not found.');
        }
      } catch (error) {
        console.error('Error fetching group:', error);
        setMessage('Error fetching group.');
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  const updateGroup = async ({ groupId, title, description, location, time }: useGroupParams) => {
    if (!groupId) {
      setMessage('Group ID is required.');
      return;
    }

    try {
      const groupDocRef = doc(db, 'groups', groupId);

      await updateDoc(groupDocRef, { title, description, location, time });

      setGroup((prevGroup) => prevGroup ? {
        ...prevGroup,
        title: title ?? prevGroup.title,
        description: description ?? prevGroup.description,
        location: location ?? prevGroup.location,
        time: time ?? prevGroup.time,
      } : null);
      setMessage('Group updated successfully!');
    } catch (error) {
      console.error('Error updating group:', error);
      setMessage('Error updating group. Please try again.');
    }
  };

  const deleteGroup = async (groupId: string) => {
    if (!groupId) {
      setMessage('Group ID is required.');
      return;
    }

    try {
      const groupDocRef = doc(db, 'groups', groupId);
      
      // Delete all subcollections first
      const participantsCollection = collection(db, 'groups', groupId, 'participants');
      const participantsSnapshot = await getDocs(participantsCollection);
      participantsSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      const messagesCollection = collection(db, 'groups', groupId, 'messages');
      const messagesSnapshot = await getDocs(messagesCollection);
      messagesSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Delete the group document
      await deleteDoc(groupDocRef);
      setGroup(null);
      setMessage('Group deleted successfully!');
    } catch (error) {
      console.error('Error deleting group:', error);
      setMessage('Error deleting group. Please try again.');
    }
  };

  return { group, loading, updateGroup, deleteGroup, message };
};

export default useGroup;