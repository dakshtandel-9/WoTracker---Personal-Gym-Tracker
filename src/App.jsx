import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import PlanManager from './pages/PlanManager';
import PlanEditor from './pages/PlanEditor';
import DayView from './pages/DayView';
import ActiveWorkout from './pages/ActiveWorkout';
import History from './pages/History';
import ExerciseProgress from './pages/ExerciseProgress';
import Auth from './pages/Auth';
import './index.css';

// Simple private route component
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // or a spinner
  return user ? children : <Navigate to="/auth/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkoutProvider>
          <div className="app">
            <Header />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/plans" element={<PrivateRoute><PlanManager /></PrivateRoute>} />
                <Route path="/plans/:planId" element={<PrivateRoute><PlanEditor /></PrivateRoute>} />
                <Route path="/plans/:planId/days/:dayId" element={<PrivateRoute><DayView /></PrivateRoute>} />
                <Route path="/workout" element={<PrivateRoute><ActiveWorkout /></PrivateRoute>} />
                <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
                <Route path="/progress" element={<PrivateRoute><ExerciseProgress /></PrivateRoute>} />
                <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
                <Route path="/auth/:mode" element={<Auth />} />
              </Routes>
            </main>
          </div>
        </WorkoutProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
