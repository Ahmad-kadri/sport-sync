// src/hooks/useUserInfo.ts

import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<{ name: string; surname: string; email: string } | null>(null);
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
          setUserInfo(userDoc.data() as { name: string; surname: string; email: string });
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
