import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col, ListGroup, Badge, Nav } from 'react-bootstrap';
import DoctorChat from '../DoctorChat/DoctorChat';

function DoctorChatWithPatientDetails() {
  const location = useLocation();
  const { appointment } = location.state || {};

  const [messages, setMessages] = useState([
    { id: 1, sender: 'patient', text: 'Hello, Doctor. I have been experiencing some headaches recently.' },
    { id: 2, sender: 'doctor', text: 'Hello! How long have you been having these headaches?' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chatSummaries'); // Toggle between 'chatSummaries' and 'prescriptionNotes'

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
    { date: '2024-07-30', summary: 'Follow-up on hypertension management, adjusted ACE inhibitor dosage.' },
    { date: '2024-06-25', summary: 'Consulted on recurring angina symptoms, recommended stress test for further evaluation.' },
    { date: '2024-05-18', summary: 'Assessed insulin resistance and adjusted diabetic medication regimen.' },
    { date: '2024-04-10', summary: 'Evaluated increased blood pressure, suggested low-sodium diet and beta blockers.' },
    { date: '2024-03-12', summary: 'Reviewed HbA1c levels, modified treatment plan to better control type 2 diabetes.' },
    { date: '2024-02-28', summary: 'Discussed heart palpitations, ordered EKG and recommended cardiology referral.' },
    { date: '2024-01-19', summary: 'Addressed hypertension-related headaches, recommended 24-hour blood pressure monitoring.' },
    { date: '2024-12-05', summary: 'Monitored progress of blood pressure control, altered calcium channel blocker dose.' },
    { date: '2024-11-20', summary: 'Addressed concerns of diabetic neuropathy, initiated gabapentin for nerve pain.' },
    { date: '2024-10-15', summary: 'Reviewed post-angioplasty recovery, advised on cardiac rehabilitation exercises.' },
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
      case 'low':
        return 'info';
      case 'medium':
        return 'success';
      case 'high':
        return 'warning';
      case 'very high':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container-fluid mt-4">
      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Header as="h5" className="bg-primary text-white">Patient Details</Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <img
                  src={'https://bootdey.com/img/Content/avatar/avatar1.png'} // default avatar if not present
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
          {/* Toggle between 'Chat Summaries' and 'Prescription and Notes' */}
          <Card>
            <Card.Header as="h5" className="bg-info text-white">Options</Card.Header>
            <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
              <Nav.Item>
                <Nav.Link eventKey="chatSummaries">Chat Summaries</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="prescriptionNotes">Prescription and Notes</Nav.Link>
              </Nav.Item>
            </Nav>

            <Card.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
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
            <Card.Header as="h5" className="bg-primary text-white">Chat with Patient</Card.Header>
            <Card.Body className="d-flex flex-column" style={{ height: '80vh' }}>
              <DoctorChat />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DoctorChatWithPatientDetails;
