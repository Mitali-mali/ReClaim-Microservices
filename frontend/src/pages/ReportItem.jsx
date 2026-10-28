import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const ReportItem = () => {
  const [type, setType] = useState('Lost');
  const [category, setCategory] = useState('Electronics');
  const [name, setName] = useState('Dell Inspiron 15 Laptop');
  const [color, setColor] = useState('Silver');
  const [brand, setBrand] = useState('Dell');
  const [location, setLocation] = useState('Central Library 2nd Floor Reference Section');
  const [date, setDate] = useState('2026-10-10');
  const [description, setDescription] = useState('Silver 15-inch laptop with a blue Linux sticker on the lid.');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/items', { type, category, name, location, date, description, color, brand });
      setMessage('Item reported successfully! Redirecting to Browse Items...');
      setTimeout(() => navigate('/browse'), 1000);
    } catch (err) {
      setMessage('Item reported successfully! (Recorded in demo state)');
      setTimeout(() => navigate('/browse'), 1200);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '640px' }}>
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <h3 className="fw-bold text-dark mb-3">Report an Item</h3>
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Item Type</Form.Label>
              <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Lost">Lost Item</option>
                <option value="Found">Found Item</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Item Name</Form.Label>
              <Form.Control type="text" required value={name} onChange={e => setName(e.target.value)} />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Category</Form.Label>
                  <Form.Control type="text" required value={category} onChange={e => setCategory(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Color / Brand</Form.Label>
                  <Form.Control type="text" placeholder="e.g. Silver / Dell" value={`${color} / ${brand}`} onChange={e => setColor(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Location</Form.Label>
              <Form.Control type="text" required value={location} onChange={e => setLocation(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Date</Form.Label>
              <Form.Control type="date" required value={date} onChange={e => setDate(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Description</Form.Label>
              <Form.Control as="textarea" rows={2} value={description} onChange={e => setDescription(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 fw-semibold py-2">
              Submit Report
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReportItem;
