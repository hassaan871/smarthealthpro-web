import DoctorChat from '../DoctorChat/DoctorChat';
import PatientDetails from '../PatientDetails/PatientDetails';
import './DoctorPanel.css';

function DoctorPanel() {
  return (
    <div className="dashboard-container">
      <PatientDetails className="patient-details-container"/>
      <DoctorChat className="chat-container"/>
    </div>
  );
}

export default DoctorPanel;
