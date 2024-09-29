import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';

function DoctorChat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'patient', text: 'Hello, Doctor. I have been experiencing some headaches recently.' },
    { id: 2, sender: 'doctor', text: 'Hello! How long have you been having these headaches?' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const messageListRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'doctor',
      text: newMessage,
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <Card className="h-100">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Doctor Chat</h5>
      </Card.Header>
      <Card.Body className="d-flex flex-column p-0">
        <div className="message-list flex-grow-1 overflow-auto p-3" ref={messageListRef}>
          {messages.map((message) => (
            <div key={message.id} className={`d-flex ${message.sender === 'doctor' ? 'justify-content-end' : 'justify-content-start'} mb-2`}>
              <div className={`message-bubble p-2 rounded ${message.sender === 'doctor' ? 'bg-primary text-white' : 'bg-light'}`}>
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <Form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="mt-auto p-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button variant="primary" type="submit">
              Send
            </Button>
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default DoctorChat;