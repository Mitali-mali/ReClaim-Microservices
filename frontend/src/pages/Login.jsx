import React, { useState, useContext } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ width: '400px' }} className="shadow-sm">
        <Card.Body>
          <h3 className="text-center mb-4">Login</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Login</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
