import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the import path based on your file structure

interface Group {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
}

const useGroup = (groupId: string | undefined) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) {
      setGroup(null);
      setLoading(false);
      return;
    }

    const groupDocRef = doc(db, 'groups', groupId);
    const unsubscribe = onSnapshot(
      groupDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setGroup({ id: docSnapshot.id, ...docSnapshot.data() } as Group);
        } else {
          setGroup(null);
        }
        setLoading(false);
      },
      (err) => {
        setError('Failed to fetch group.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [groupId]);

  return { group, loading, error };
};

export default useGroup;
