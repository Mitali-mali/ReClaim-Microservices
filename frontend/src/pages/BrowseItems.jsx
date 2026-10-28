import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import api from '../services/api';
import { Link } from 'react-router-dom';

const sampleItems = [
  {
    _id: "6709820fa8e1b23456789abd",
    name: "Dell Inspiron 15 Laptop",
    type: "Lost",
    category: "Electronics",
    location: "Central Library 2nd Floor",
    status: "Active"
  },
  {
    _id: "6709825ba8e1b23456789abf",
    name: "Silver Laptop",
    type: "Found",
    category: "Electronics",
    location: "Central Library Desk",
    status: "Active"
  },
  {
    _id: "6709831a8e1b23456789ac2",
    name: "Black Titan Wallet",
    type: "Lost",
    category: "Wallet / Cards",
    location: "College Canteen",
    status: "Active"
  }
];

const BrowseItems = () => {
  const [items, setItems] = useState(sampleItems);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get('/items');
        if (res.data && res.data.length > 0) {
          setItems(res.data);
        }
      } catch (err) {
        console.log("Using demo sample items");
      }
    };
    fetchItems();
  }, []);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Browse Items</h2>
        <Button as={Link} to="/report" variant="outline-primary" size="sm">+ Report New Item</Button>
      </div>
      <Row>
        {items.map(item => (
          <Col md={4} key={item._id} className="mb-4">
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title className="fs-5 fw-bold mb-0">{item.name}</Card.Title>
                  <Badge bg={item.type === 'Lost' ? 'danger' : 'success'}>
                    {item.type}
                  </Badge>
                </div>
                <Card.Text className="text-secondary small my-3">
                  <strong>Category:</strong> {item.category}<br/>
                  <strong>Location:</strong> {item.location}<br/>
                  <strong>Status:</strong> <span className="text-primary fw-bold">{item.status}</span>
                </Card.Text>
                <Button as={Link} to={`/items/${item._id}`} variant="primary" size="sm" className="w-100">
                  View Details & Matches
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BrowseItems;
