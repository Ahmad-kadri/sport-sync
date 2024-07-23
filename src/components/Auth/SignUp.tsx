// src/components/Auth/SignUp.tsx
import React, { useState } from 'react';
import { TextField, Button, Container, Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        surname,
        email,
        createdAt: new Date()
      });

      // Redirect to sign-in page or another page
      navigate('/'); 
    } catch (error: any) {
      setError(error.message); 
      console.error('Error creating user:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          type="email"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {error && <Alert severity="error" style={{ margin: '16px 0' }}>{error}</Alert>}
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          style={{ marginTop: '16px' }}
          onClick={() => navigate('/signin')}
        >
          Already have an account? Sign In
        </Button>
      </form>
    </Container>
  );
}

export default SignUp;
