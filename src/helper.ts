import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const addParticipant = async (groupId: string, userId: string) => {
    try {
      await setDoc(doc(db, 'groups', groupId, 'participants', userId), {
        userId,
        joinedAt: serverTimestamp()
      });
      console.log('Participant added');
    } catch (error) {
      console.error('Error adding participant:', error);
    }
  };
  
  export const sendMessage = async (groupId: string, senderId: string, content: string) => {
    try {
      await addDoc(collection(db, 'groups', groupId, 'messages'), {
        senderId,
        content,
        timestamp: serverTimestamp()
      });
      console.log('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };