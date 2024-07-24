import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import { User } from '../Group/GroupList';
import { userInfo } from 'os';
import useUserInfo from './useUserInfo';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: User;
}

export const useMessages = (groupId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const {userInfo} = useUserInfo();

  useEffect(() => {
    const messagesRef = collection(db, 'groups', groupId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [groupId]);


  const sendMessage = async () => {
    if (message.trim() === '' || !userInfo) return;

    try {
      const messagesRef = collection(db, 'groups', groupId, 'messages');
      await addDoc(messagesRef, {
        text: message,
        timestamp: new Date().toISOString(),
        sender: userInfo,
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {
    messages,
    message,
    setMessage,
    sendMessage
  };
};
