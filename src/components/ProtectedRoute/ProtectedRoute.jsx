// ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
  // Simple check: look for a token in localStorage (customize as needed)
  return !!localStorage.getItem('authToken');
};

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;