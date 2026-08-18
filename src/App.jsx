import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Attendance from './components/Attendance';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Pass setUser so login can update the state */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        
        {/* Protected Routes require the user to be logged in */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/attendance" element={<Attendance user={user} setUser={setUser} />} />
          <Route path="/admin" element={<AdminDashboard user={user} setUser={setUser} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;