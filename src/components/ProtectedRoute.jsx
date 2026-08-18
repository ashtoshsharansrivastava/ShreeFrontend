import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // If user is logged in, render the child route (Attendance component)
  return <Outlet />;
};

export default ProtectedRoute;