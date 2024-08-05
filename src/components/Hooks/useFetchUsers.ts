import { useState, useEffect, useCallback } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';

// Define the User interface
interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
}

const useFetchUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from Firestore
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '!=', '')); // Adjust query as needed
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

      const usersList: User[] = querySnapshot.docs.map(doc => {
        const data = doc.data() as Omit<User, 'id'>; // Type cast without id
        return {
          id: doc.id,
          ...data, // Spread the data without overwriting id
        };
      });

      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error };
};

export default useFetchUsers;