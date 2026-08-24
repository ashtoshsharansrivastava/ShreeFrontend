import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Attendance from './components/Attendance';
import AdminDashboard from './pages/AdminDashboard'; // Assuming you are using the robust one from /pages
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Restore session from localStorage to prevent logouts on page refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('shree_attendance_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Keep localStorage in sync with user state
  useEffect(() => {
    if (user) {
      localStorage.setItem('shree_attendance_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shree_attendance_user');
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Login Route */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Protected Application Routes */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/attendance" element={<Attendance user={user} setUser={setUser} />} />
          <Route path="/admin" element={<AdminDashboard user={user} setUser={setUser} />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;