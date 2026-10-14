import React, { useEffect, useState } from 'react';
import { Container, Card, Badge, Button, Row, Col, Alert } from 'react-bootstrap';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [claimMsg, setClaimMsg] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const itemRes = await api.get('/items/' + id);
        setItem(itemRes.data);
        
        // Fetch Matches
        const matchRes = await api.get('/matches/' + id);
        setMatches(matchRes.data);
      } catch (err) {
        console.error("Error fetching details");
      }
    };
    fetchDetails();
  }, [id]);

  const handleClaim = async (foundItemId) => {
    const proof = prompt("Please provide proof of ownership (e.g., specific scratch, password):");
    if (!proof) return;
    
    try {
      await api.post('/claims', { itemId: foundItemId, proofDescription: proof });
      setClaimMsg("Claim submitted successfully!");
    } catch (err) {
      setClaimMsg("Failed to submit claim.");
    }
  };

  if (!item) return <Container className="mt-4"><p>Loading...</p></Container>;

  return (
    <Container className="mt-4">
      {claimMsg && <Alert variant="success">{claimMsg}</Alert>}
      <Row>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Badge bg={item.type === 'Lost' ? 'danger' : 'success'}>{item.type}</Badge>
              <Card.Text className="mt-3">
                <strong>Category:</strong> {item.category}<br/>
                <strong>Location:</strong> {item.location}<br/>
                <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}<br/>
                <strong>Description:</strong> {item.description}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <h4>Potential Matches</h4>
          {matches.length === 0 ? <p>No matches found yet by our Smart System.</p> : (
            matches.map(m => {
              const matchedItemId = item.type === 'Lost' ? m.foundItemId : m.lostItemId;
              return (
                <Card key={m._id} className="mb-3 border-info">
                  <Card.Body>
                    <Card.Title>Match Score: {m.score}%</Card.Title>
                    <ul>
                      {m.reasons.map((r, idx) => <li key={idx}>{r}</li>)}
                    </ul>
                    <Button variant="outline-info" size="sm" onClick={() => navigate('/items/' + matchedItemId)}>View Matched Item</Button>
                    {' '}
                    {item.type === 'Lost' && (
                      <Button variant="success" size="sm" onClick={() => handleClaim(matchedItemId)}>Claim this Item</Button>
                    )}
                  </Card.Body>
                </Card>
              )
            })
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ItemDetails;
