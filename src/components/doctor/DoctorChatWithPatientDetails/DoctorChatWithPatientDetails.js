import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col, ListGroup, Badge, Nav, Form, Button, Alert } from 'react-bootstrap';
import DoctorChat from '../DoctorChat/DoctorChat';
import AddNotes from '../../notes/AddNotes';


function DoctorChatWithPatientDetails() {
  const location = useLocation();
  const { appointment } = location.state || {};

  const [messages, setMessages] = useState([
    { id: 1, sender: 'patient', text: 'Hello, Doctor. I have been experiencing some headaches recently.' },
    { id: 2, sender: 'doctor', text: 'Hello! How long have you been having these headaches?' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chatSummaries');
  const [chatMode, setChatMode] = useState('chat');
  const [newPriority, setNewPriority] = useState('');
  const [updateStatus, setUpdateStatus] = useState(null);

  const patientInfo = appointment
    ? {
        fullName: appointment.patient.name,
        age: appointment.patient.age || 'N/A',
        gender: appointment.patient.gender || 'N/A',
        email: appointment.patient.email || 'N/A',
        medicalHistory: appointment.patient.medicalHistory || [],
        imageUrl: appointment.avatar || '/api/placeholder/100/100',
      }
    : {
        fullName: 'Patient Name Not Available',
        age: 'N/A',
        gender: 'N/A',
        email: 'N/A',
        medicalHistory: [],
        imageUrl: '/api/placeholder/100/100',
      };

  const chatSummaries = [
    { date: '2024-09-01', summary: 'Discussed management strategies for fluctuating blood glucose levels in diabetes.' },
    { date: '2024-08-15', summary: 'Reviewed lab results indicating elevated LDL cholesterol, prescribed statins to reduce cardiovascular risk.' },
    // ... (rest of the chat summaries)
  ];

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

  const getPriorityBadgeVariant = (priority) => {
    switch (priority.toLowerCase()) {
      case 'low': return 'info';
      case 'mild': return 'success';
      case 'moderate': return 'warning';
      case 'high': return 'danger';
      case 'very high': return 'dark';
      default: return 'secondary';
    }
  };

  const handleUpdatePriority = async () => {
    console.warn('this is appointment id ',appointment._id);
    console.warn('this is new priority ',newPriority);
    if (!appointment || !appointment._id || !newPriority) {
      setUpdateStatus({ type: 'error', message: 'Invalid appointment data or priority' });
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/appointment/updateAppointment/${appointment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priority: newPriority }),
      });

      if (!response.ok) {
        throw new Error('Failed to update priority');
      }

      const updatedAppointment = await response.json();
      setUpdateStatus({
        type: 'success',
        message: `${patientInfo.fullName}'s priority updated from ${appointment.priority} to ${newPriority}`,
      });
      // Update the appointment state here if you're keeping it in state
    } catch (error) {
      setUpdateStatus({
        type: 'error',
        message: `Error updating priority: ${error.message}`,
      });
    }
  };

  return (
    <div className="container-fluid mt-4" style={{ height: '100vh' }}>
      <Row className="h-100">
        <Col md={3} className="h-100">
          <Card className="h-100">
            <Card.Header as="h5" className="bg-primary text-white">Patient Details</Card.Header>
            <Card.Body className="overflow-auto">
              <div className="text-center mb-3">
                <img
                  src={'https://bootdey.com/img/Content/avatar/avatar1.png'}
                  alt={appointment?.patient?.name}
                  className="rounded-circle"
                  style={{ width: '80px', height: '80px' }}
                />
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item><strong>Name:</strong> {patientInfo.fullName}</ListGroup.Item>
                <ListGroup.Item><strong>Age:</strong> {patientInfo.age}</ListGroup.Item>
                <ListGroup.Item><strong>Gender:</strong> {patientInfo.gender}</ListGroup.Item>
                <ListGroup.Item><strong>Email:</strong> {patientInfo.email}</ListGroup.Item>
                {appointment && (
                  <>
                    <ListGroup.Item><strong>Appointment Date:</strong> {appointment.date}</ListGroup.Item>
                    <ListGroup.Item><strong>Appointment Time:</strong> {appointment.time}</ListGroup.Item>
                    <ListGroup.Item><strong>Location:</strong> {appointment.location}</ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Status:</strong>{' '}
                      <Badge bg={appointment.appointmentStatus.toLowerCase() === 'pending' ? 'warning' : 'success'}>
                        {appointment.appointmentStatus}
                      </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Priority:</strong>{' '}
                      <Badge bg={getPriorityBadgeVariant(appointment.priority)}>
                        {appointment.priority}
                      </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Form.Group>
                        <Form.Label><strong>Update Priority:</strong></Form.Label>
                        <Form.Control
                          as="select"
                          value={newPriority}
                          onChange={(e) => setNewPriority(e.target.value)}
                        >
                          <option value="">Select Priority</option>
                          <option value="Low">Low</option>
                          <option value="Mild">Mild</option>
                          <option value="Moderate">Moderate</option>
                          <option value="High">High</option>
                          <option value="Very High">Very High</option>
                        </Form.Control>
                      </Form.Group>
                      <Button 
                        variant="primary" 
                        className="mt-2" 
                        onClick={handleUpdatePriority}
                        disabled={!newPriority}
                      >
                        Update Priority
                      </Button>
                    </ListGroup.Item>
                  </>
                )}
              </ListGroup>
              {updateStatus && (
                <Alert variant={updateStatus.type === 'success' ? 'success' : 'danger'} className="mt-3">
                  {updateStatus.message}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="h-100">
          <Card className="h-100">
            <Card.Header as="h5" className="bg-info text-white">Summaries and Notes</Card.Header>
            <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
              <Nav.Item>
                <Nav.Link eventKey="chatSummaries">Chat Summaries</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="prescriptionNotes">Prescription and Notes</Nav.Link>
              </Nav.Item>
            </Nav>

            <Card.Body className="overflow-auto" style={{ height: '85vh' }}>
              <ListGroup variant="flush">
                {activeTab === 'chatSummaries' &&
                  chatSummaries.map((summary, index) => (
                    <ListGroup.Item key={index}>
                      <div className="fw-bold">{summary.date}</div>
                      <div>{summary.summary}</div>
                    </ListGroup.Item>
                  ))}

                {activeTab === 'prescriptionNotes' &&
                  patientInfo.medicalHistory.map((item, index) => (
                    <ListGroup.Item key={index}>{item}</ListGroup.Item>
                  ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="h-100">
          <Card className="h-100">
            <Card.Header as="h5" className="bg-primary text-white d-flex justify-content-between align-items-center">
              <span>{chatMode === 'chat' ? 'Chat with Patient' : 'Add Notes'}</span>
              <Form.Check 
                type="switch"
                id="chat-mode-switch"
                label={chatMode === 'chat' ? 'Switch to Notes' : 'Switch to Chat'}
                onChange={() => setChatMode(chatMode === 'chat' ? 'notes' : 'chat')}
              />
            </Card.Header>
            <Card.Body className="d-flex flex-column overflow-auto">
              {chatMode === 'chat' ? <DoctorChat /> : <AddNotes />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DoctorChatWithPatientDetails;