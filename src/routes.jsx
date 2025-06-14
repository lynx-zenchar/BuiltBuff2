import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import SidebarWithHeader from './components/ProtectedRoute/SidebarWithHeader';
import Dashboard from './components/ProtectedRoute/Dashboard';
import Upcoming from './components/ProtectedRoute/Upcoming';
import Profile from './components/ProtectedRoute/Profile';
import Settings from './components/ProtectedRoute/Settings';
import WorkoutLog from './components/ProtectedRoute/WorkoutLog';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Navigate to="/login" replace /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      {
        path: '/',
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <SidebarWithHeader />,
            children: [
              { path: 'dashboard', element: <Dashboard /> },
              { path: 'upcoming', element: <Upcoming /> },
              { path: 'profile', element: <Profile /> },
              { path: 'settings', element: <Settings /> },
              { path: 'workout-log', element: <WorkoutLog /> },
              { path: '', element: <Navigate to="/dashboard" replace /> },
            ],
          },
        ],
      },
    ],
  },
]);