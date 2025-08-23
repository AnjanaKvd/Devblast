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
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Regular user routes */}
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
      
      {/* Admin routes */}
      <Route
        path="/admin-dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
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
