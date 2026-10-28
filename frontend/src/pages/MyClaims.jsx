import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Card, Row, Col } from 'react-bootstrap';
import api from '../services/api';

const sampleClaims = [
  {
    _id: "claim1",
    itemId: "6709825ba8e1b23456789abf",
    proofDescription: "Serial number ends in 8492. Has scratch on left hinge and Arch Linux sticker on bottom.",
    status: "APPROVED"
  },
  {
    _id: "claim2",
    itemId: "6709831a8e1b23456789ac2",
    proofDescription: "Black leather Titan wallet containing college ID card ending in 1023.",
    status: "PENDING"
  }
];

const MyClaims = () => {
  const [claims, setClaims] = useState(sampleClaims);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await api.get('/claims/my-claims');
        if (res.data && res.data.length > 0) {
          setClaims(res.data);
        }
      } catch (err) {
        console.log("Using demo claims");
      }
    };
    fetchClaims();
  }, []);

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8}>
          <h3 className="fw-bold mb-3">My Submitted Claims</h3>
          <Table striped bordered hover responsive className="shadow-sm bg-white">
            <thead className="table-light">
              <tr>
                <th style={{ width: '25%' }}>Item ID</th>
                <th>Proof of Ownership Provided</th>
                <th style={{ width: '20%' }}>Claim Status</th>
              </tr>
            </thead>
            <tbody>
              {claims.map(c => (
                <tr key={c._id}>
                  <td className="font-monospace small">{c.itemId.substring(0, 10)}...</td>
                  <td className="small">{c.proofDescription}</td>
                  <td>
                    <Badge bg={c.status === 'APPROVED' ? 'success' : 'warning'} className="px-2 py-1">
                      {c.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        
        <Col md={4}>
          <h4 className="fw-bold mb-3">Real-Time Alerts</h4>
          <Card className="border-0 shadow-sm mb-2 border-start border-4 border-success">
            <Card.Body className="p-3">
              <strong className="text-success small">Claim Approved</strong><br/>
              <span className="text-secondary small">Your claim for Dell Laptop has been verified and approved!</span>
            </Card.Body>
          </Card>
          <Card className="border-0 shadow-sm mb-2 border-start border-4 border-info">
            <Card.Body className="p-3">
              <strong className="text-info small">New Potential Match</strong><br/>
              <span className="text-secondary small">85% match detected for your lost Dell laptop.</span>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyClaims;
