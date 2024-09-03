import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/authentication/login/Login';
import SignUp from './components/authentication/signup/SignUp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;