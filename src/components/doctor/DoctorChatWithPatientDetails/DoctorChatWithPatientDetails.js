import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col, ListGroup, Badge, Nav, Form } from 'react-bootstrap';
import DoctorChat from '../DoctorChat/DoctorChat';
import AddNotes from '../../Notes/AddNotes'; // Assuming you have this component

function DoctorChatWithPatientDetails() {
  const location = useLocation();
  const { appointment } = location.state || {};

  const [messages, setMessages] = useState([
    { id: 1, sender: 'patient', text: 'Hello, Doctor. I have been experiencing some headaches recently.' },
    { id: 2, sender: 'doctor', text: 'Hello! How long have you been having these headaches?' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chatSummaries');
  const [chatMode, setChatMode] = useState('chat'); // 'chat' or 'notes'

  // Use appointment data if available, otherwise use placeholder data
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
    // ... (other chat summaries)
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
      case 'medium': return 'success';
      case 'high': return 'warning';
      case 'very high': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="container-fluid mt-4">
      <Row>
        <Col md={3}>
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
                  </>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
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

            <Card.Body className="overflow-auto">
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

        <Col md={6}>
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
            <Card.Body className="d-flex flex-column">
              {chatMode === 'chat' ? <DoctorChat /> : <AddNotes />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DoctorChatWithPatientDetails;