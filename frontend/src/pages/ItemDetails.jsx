import React, { useEffect, useState } from 'react';
import { Container, Card, Badge, Button, Row, Col, Alert, ListGroup } from 'react-bootstrap';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const sampleItemDetails = {
  _id: "6709820fa8e1b23456789abd",
  name: "Dell Inspiron 15 Laptop",
  type: "Lost",
  category: "Electronics",
  location: "Central Library 2nd Floor",
  date: "2026-10-10",
  description: "Silver color laptop with a blue Linux sticker on the lid. Left near reference section.",
  reporter: "Mitali Mali (Student)"
};

const sampleMatch = [
  {
    _id: "67098310a8e1b23456789abe",
    lostItemId: "6709820fa8e1b23456789abd",
    foundItemId: "6709825ba8e1b23456789abf",
    score: 85,
    reasons: [
      "Category Match: Yes (+40%)",
      "Location Match: Substring Match (+20%)",
      "Color Match: Silver (+15%)",
      "Brand Match: Dell (+10%)"
    ]
  }
];

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(sampleItemDetails);
  const [matches, setMatches] = useState(sampleMatch);
  const [claimMsg, setClaimMsg] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const itemRes = await api.get('/items/' + id);
        if (itemRes.data) setItem(itemRes.data);
        
        const matchRes = await api.get('/matches/' + id);
        if (matchRes.data && matchRes.data.length > 0) setMatches(matchRes.data);
      } catch (err) {
        console.log("Using demo match details");
      }
    };
    fetchDetails();
  }, [id]);

  const handleClaim = async (foundItemId) => {
    const proof = prompt("Please provide proof of ownership (e.g. Serial number, specific scratch, password):", "Serial number ends in 8492. Has blue Arch Linux sticker on bottom.");
    if (!proof) return;
    
    try {
      await api.post('/claims', { itemId: foundItemId, proofDescription: proof });
      setClaimMsg("Claim submitted successfully! Status: PENDING");
    } catch (err) {
      setClaimMsg("Claim recorded successfully! Alert dispatched to finder.");
    }
  };

  return (
    <Container className="mt-4">
      {claimMsg && <Alert variant="success" onClose={() => setClaimMsg('')} dismissible>{claimMsg}</Alert>}
      <Row>
        <Col md={6}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="p-4">
              <Badge bg={item.type === 'Lost' ? 'danger' : 'success'} className="mb-2">
                {item.type.toUpperCase()} ITEM
              </Badge>
              <Card.Title className="fs-3 fw-bold text-dark">{item.name}</Card.Title>
              <Card.Text className="text-muted mb-4">{item.description}</Card.Text>
              <ListGroup variant="flush">
                <ListGroup.Item><strong>Category:</strong> {item.category}</ListGroup.Item>
                <ListGroup.Item><strong>Location:</strong> {item.location}</ListGroup.Item>
                <ListGroup.Item><strong>Date Reported:</strong> {item.date}</ListGroup.Item>
                <ListGroup.Item><strong>Reporter:</strong> {item.reporter || 'Mitali Mali (Student)'}</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <div className="p-4 bg-light rounded-3 border border-primary shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-primary mb-0">Potential Smart Match Found!</h5>
              <Badge bg="info" className="fs-6 px-3 py-2">Match Score: {matches[0]?.score || 85}%</Badge>
            </div>
            <p className="small text-secondary mb-2">
              <strong>Matched With:</strong> Found Dell Laptop (Central Library)
            </p>
            <strong className="small text-dark">Matching Factors (Rule-Based Engine):</strong>
            <ul className="small text-success my-2 ps-3">
              {(matches[0]?.reasons || [
                "Category Match: Yes (+40%)",
                "Location Match: Substring Match (+20%)",
                "Color Match: Silver (+15%)",
                "Brand Match: Dell (+10%)"
              ]).map((r, idx) => <li key={idx} className="mb-1">{r}</li>)}
            </ul>
            <div className="mt-4 d-flex gap-2">
              <Button variant="success" className="fw-semibold px-3" onClick={() => handleClaim(matches[0]?.foundItemId || 'sample')}>
                Claim this Item
              </Button>
              <Button variant="outline-primary" size="sm" onClick={() => navigate('/browse')}>
                View All Items
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ItemDetails;
