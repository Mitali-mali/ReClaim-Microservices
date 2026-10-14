import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Home = () => {
  return (
    <Container className="text-center mt-5">
      <Row>
        <Col>
          <h1 className="display-4">Welcome to ReClaim</h1>
          <p className="lead">Smart Lost & Found Management System</p>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Lost Something?</Card.Title>
              <Card.Text>Report your lost item and let our smart matching system find it.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Found Something?</Card.Title>
              <Card.Text>Report a found item and help return it to its rightful owner.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
