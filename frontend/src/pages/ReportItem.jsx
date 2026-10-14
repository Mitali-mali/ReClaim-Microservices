import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const ReportItem = () => {
  const [type, setType] = useState('Lost');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/items', { type, category, name, location, date, description });
      setMessage('Item reported successfully!');
      setTimeout(() => navigate('/browse'), 1500);
    } catch (err) {
      setMessage('Error reporting item');
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h3>Report an Item</h3>
          {message && <Alert variant="info">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control type="text" required value={name} onChange={e => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" placeholder="e.g. Electronics, Keys" required value={category} onChange={e => setCategory(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" required value={location} onChange={e => setLocation(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" required value={date} onChange={e => setDate(e.target.value)} />
            </Form.Group>
            <Button type="submit">Submit Report</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReportItem;
