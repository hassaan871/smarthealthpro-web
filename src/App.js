import Login from "./components/authentication/login/Login";
import DoctorChat from "./components/doctor/DoctorChat/DoctorChat";
import DoctorChatWithPatientDetails from "./components/doctor/DoctorChatWithPatientDetails/DoctorChatWithPatientDetails";
import SignUp from "./components/authentication/signup/SignUp";
import DoctorDashboard from "./components/doctor/DoctorDashboard/DoctorDashboard";
import DoctorPanel from "./components/doctor/DoctorPanel/DoctorPanel";
import UserProfileCompletion from "./components/authentication/signup/UserProfileCompletion";
import AddNotes from "./components/notes/AddNotes";
import DoctorDetailView from "./components/doctor/DoctorDetailView/DoctorDetailView";
import DoctorDetailEdit from "./components/doctor/DoctorDetailEdit/DoctorDetailEdit";


function App() {
  return (
    <div>
      <Login/>
      {/* <SignUp/> */}
      {/* <UserProfileCompletion/> */}
      {/* <DoctorDashboard/> */}
      {/* <DoctorChat/> */}
      {/* <DoctorPanel/> */}
      {/* <DoctorChatWithPatientDetails/> */}
      {/* <AddNotes/> */}
      {/* <DoctorDetailView/> */}
      {/* <DoctorDetailEdit/> */}
    </div>
  );
}

export default App;
