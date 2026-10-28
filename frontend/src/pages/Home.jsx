import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="text-center mt-5">
      <Row>
        <Col>
          <h1 className="display-4 fw-bold text-dark">Welcome to ReClaim</h1>
          <p className="lead text-muted">Smart Lost & Found Management System using Microservices Architecture</p>
        </Col>
      </Row>
      <Row className="mt-4 justify-content-center">
        <Col md={5}>
          <Card className="mb-4 shadow-sm border-0 h-100 text-start">
            <Card.Body className="p-4">
              <Card.Title className="text-danger fw-bold fs-4">Lost Something?</Card.Title>
              <Card.Text className="text-secondary my-3">
                Report your misplaced belongings and let our rule-based matching engine trace them across the campus.
              </Card.Text>
              <Button as={Link} to="/report" variant="primary" className="fw-semibold px-4">
                Report Lost Item
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5}>
          <Card className="mb-4 shadow-sm border-0 h-100 text-start">
            <Card.Body className="p-4">
              <Card.Title className="text-success fw-bold fs-4">Found Something?</Card.Title>
              <Card.Text className="text-secondary my-3">
                Help a fellow college student recover their items by posting found item details quickly and safely.
              </Card.Text>
              <Button as={Link} to="/report" variant="success" className="fw-semibold px-4">
                Report Found Item
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
