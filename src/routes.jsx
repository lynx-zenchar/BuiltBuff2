import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import Dashboard from './components/Dashboard/Dashboard';

// We'll create these components next
const ExerciseLibrary = () => <div>Exercise Library Page</div>;
const WorkoutLog = () => <div>Workout Log Page</div>;
const Profile = () => <div>Profile Page</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'exercises',
            element: <ExerciseLibrary />,
          },
          {
            path: 'workout-log',
            element: <WorkoutLog />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
        ],
      },
    ],
  },
]); 