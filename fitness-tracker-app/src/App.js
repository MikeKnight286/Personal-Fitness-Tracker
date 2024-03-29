import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar/NavBar';
import Home from './pages/Home';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PasswordResetRequest from './pages/PasswordResetRequest';
import PasswordReset from './pages/PasswordReset';
import ActivityLog from './pages/ActivityLog';
import DietLog from './pages/DietLog';
import UpdateDietEntry from './components/DietTracker/UpdateDietEntry';
import WorkoutPlanPage from './pages/WorkoutPlanPage';
import UpdateWorkoutPlan from './components/WorkoutPlan/UpdateWorkoutPlan'
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/password-reset-request" element={<PasswordResetRequest />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/activities" element={<ActivityLog />} />
          <Route path="/diets" element={<DietLog />} />
          <Route path="/diets/update/:dietId" element={<UpdateDietEntry />} />
          <Route path="/workoutplans" element={<WorkoutPlanPage />} />
          <Route path="/workoutplans/update/:planId" element={<UpdateWorkoutPlan />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
