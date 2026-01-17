import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Landing from './pages/Landing';
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

// Conditional header wrapper
const AppLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Don't show header on landing page or auth pages
  const showHeader = user && location.pathname !== '/' && !location.pathname.startsWith('/auth');

  return (
    <div className="app">
      {showHeader && <Header />}
      <main className="app-main">
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkoutProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/plans" element={<PrivateRoute><PlanManager /></PrivateRoute>} />
              <Route path="/plans/:planId" element={<PrivateRoute><PlanEditor /></PrivateRoute>} />
              <Route path="/plans/:planId/days/:dayId" element={<PrivateRoute><DayView /></PrivateRoute>} />
              <Route path="/workout" element={<PrivateRoute><ActiveWorkout /></PrivateRoute>} />
              <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
              <Route path="/progress" element={<PrivateRoute><ExerciseProgress /></PrivateRoute>} />
              <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
              <Route path="/auth/:mode" element={<Auth />} />
            </Routes>
          </AppLayout>
        </WorkoutProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
