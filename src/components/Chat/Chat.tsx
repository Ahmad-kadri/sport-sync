import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { sendMessage } from '../../helper';

interface Message {
  senderId: string;
  content: string;
  timestamp: any; // Use appropriate type for timestamp
}

const Chat: React.FC<{ groupId: string }> = ({ groupId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'groups', groupId, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data() as Message);
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [groupId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    await sendMessage(groupId, 'userId', newMessage); // Replace 'userId' with actual user ID
    setNewMessage('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.senderId}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
