import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import SidebarWithHeader from './components/ProtectedRoute/SidebarWithHeader';
import StartWorkout from './components/ProtectedRoute/StartWorkout';
import Upcoming from './components/ProtectedRoute/Upcoming';
import Profile from './components/ProtectedRoute/Profile';
import Settings from './components/ProtectedRoute/Settings';
import History from './components/ProtectedRoute/History';
import WorkoutTrackingPage from './components/ProtectedRoute/WorkoutTrackingPage';
import ExercisesPage from './components/ProtectedRoute/ExercisesPage';

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
              { path: 'start-workout', element: <StartWorkout /> },
              { path: 'track-workout/:workoutId', element: <WorkoutTrackingPage /> },
              { path: 'upcoming', element: <Upcoming /> },
              { path: 'profile', element: <Profile /> },
              { path: 'settings', element: <Settings /> },
              { path: 'history', element: <History /> },
              { path: 'exercises', element: <ExercisesPage /> },
              { path: '', element: <Navigate to="/start-workout" replace /> },
            ],
          },
        ],
      },
    ],
  },
]);