import { Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import RiceAndCurry from './pages/admin/riceandcurry';
import ViewRiceAndCurry from './pages/admin/ViewRiceAndCurry';

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
        path="/riceandcurry"
        element={
          // <ProtectedRoute>
            <RiceAndCurry />
          // </ProtectedRoute>
        }
      />
      <Route
        path="/viewriceandcurry"
        element={
          // <ProtectedRoute>
            <ViewRiceAndCurry />
          // </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
