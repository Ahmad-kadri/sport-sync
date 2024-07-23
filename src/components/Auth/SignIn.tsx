import React, { useState } from 'react';
import { TextField, Button, Container, Alert, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // For error handling
  const [loading, setLoading] = useState(false); // For loading state
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      const errorMessage = (error as any)?.message || 'An error occurred during sign-in.';
      setError(errorMessage);
      console.log('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup'); // Redirect to sign-up page
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Sign In
        </Typography>
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
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
        <Button
          sx={{display: 'block'}}
          variant="outlined"
          color="secondary"
          style={{ marginTop: '16px' }}
          onClick={handleSignUpClick}
        >
          Don't have an account? Sign Up
        </Button>
      </form>
    </Container>
  );
};

export default SignIn;
