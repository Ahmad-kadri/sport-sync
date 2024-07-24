// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Navbar from './components/Navbar';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import GroupList from './components/Group/GroupList';
import GroupDetails from './components/Group/GroupDetail';
import CreateGroup from './components/Group/CreateGroup';
import UserProfile from './components/Profile/UserProfile';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      {user && <Navbar  user={user}/>} {/* Render Navbar only if user is logged in */}
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/groups" element={<GroupList />} />
        <Route path="/groups/:groupId" element={<GroupDetails />} />
        <Route path="/" element={<GroupList />} />
      </Routes>
    </Router>
  );
}

export default App;
