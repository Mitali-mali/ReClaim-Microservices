import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Badge, Button } from 'react-bootstrap';
import api from '../services/api';

const Notifications = () => {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    fetchNotifs();
  }, []);

  const fetchNotifs = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markRead = async (id) => {
    await api.put('/notifications/' + id + '/read');
    fetchNotifs();
  };

  return (
    <Container className="mt-4">
      <h2>Notifications</h2>
      <ListGroup className="mt-3">
        {notifs.map(n => (
          <ListGroup.Item key={n._id} className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{n.title}</strong><br/>
              <small className="text-muted">{n.message}</small>
            </div>
            {!n.isRead && (
              <Button size="sm" variant="outline-primary" onClick={() => markRead(n._id)}>Mark Read</Button>
            )}
            {n.isRead && <Badge bg="secondary">Read</Badge>}
          </ListGroup.Item>
        ))}
        {notifs.length === 0 && <p>No notifications.</p>}
      </ListGroup>
    </Container>
  );
};

export default Notifications;
