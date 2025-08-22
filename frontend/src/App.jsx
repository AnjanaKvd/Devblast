import { Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import MealBuilderPage from './pages/MealBuilderPage';
import DrinksAndSnacksPage from './pages/DrinksAndSnacksPage';
import QueuePage from './pages/QueuePage';
import QueueDashboard from './pages/QueueDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/meal-builder"
        element={
          <ProtectedRoute>
            <MealBuilderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/drinks-snacks"
        element={
          <ProtectedRoute>
            <DrinksAndSnacksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/queue"
        element={
          <ProtectedRoute>
            <QueuePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/queue-dashboard"
        element={
          <ProtectedRoute>
            <QueueDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
