import React, { useEffect, useState } from 'react';
import { Container, Table, Badge } from 'react-bootstrap';
import api from '../services/api';

const MyClaims = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await api.get('/claims/my-claims');
        setClaims(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClaims();
  }, []);

  return (
    <Container className="mt-4">
      <h2>My Claims</h2>
      <Table striped bordered hover className="mt-3 shadow-sm bg-white">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Proof Provided</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {claims.map(c => (
            <tr key={c._id}>
              <td>{c.itemId}</td>
              <td>{c.proofDescription}</td>
              <td><Badge bg="info">{c.status}</Badge></td>
            </tr>
          ))}
        </tbody>
      </Table>
      {claims.length === 0 && <p>You haven't made any claims.</p>}
    </Container>
  );
};

export default MyClaims;
