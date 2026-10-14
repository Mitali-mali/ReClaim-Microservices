import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import api from '../services/api';
import { Link } from 'react-router-dom';

const BrowseItems = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get('/items');
        setItems(res.data);
      } catch (err) {
        console.error("Failed to fetch items");
      }
    };
    fetchItems();
  }, []);

  return (
    <Container className="mt-4">
      <h2>Browse Items</h2>
      <Row className="mt-4">
        {items.map(item => (
          <Col md={4} key={item._id} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Badge bg={item.type === 'Lost' ? 'danger' : 'success'} className="mb-2">
                  {item.type}
                </Badge>
                <Card.Text>
                  <strong>Category:</strong> {item.category}<br/>
                  <strong>Location:</strong> {item.location}<br/>
                  <strong>Status:</strong> {item.status}
                </Card.Text>
                <Button as={Link} to={/items/ + item._id} variant="primary" size="sm">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {items.length === 0 && <p>No items found.</p>}
      </Row>
    </Container>
  );
};

export default BrowseItems;
