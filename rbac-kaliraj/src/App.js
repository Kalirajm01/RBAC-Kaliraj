import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn"; 
import Home from "./components/Home"; 
import Users from "./components/Users";
import Roles from "./components/Roles";
import Permissions from "./components/Permissions";

const AppContent = () => {

  return (
       <Routes>
          <Route path="/" element={<SignIn />} /> 
          <Route path="/home" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/permissions" element={<Permissions />} />
        </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
