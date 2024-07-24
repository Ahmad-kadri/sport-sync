// src/hooks/useUserInfo.ts

import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '../Group/GroupList';

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = useCallback(async () => {
    setLoading(true);
    setError(null);
    

    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const curentUser = userDoc.data() as User
          setUserInfo({
            id: user.uid,
            email: curentUser.email,
            name: curentUser.name,
            surname: curentUser.surname

          });
        } else {
          setError('User not found');
        }
      }
    } catch (err) {
      setError('Error fetching user information');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  return { userInfo, loading, error, refetchUserInfo: fetchUserInfo };
};

export default useUserInfo;
