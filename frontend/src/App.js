import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostGenerator from './pages/PostGenerator';
import PostScheduler from './pages/PostScheduler';
import SubredditAnalyzer from './pages/SubredditAnalyzer';
import Analytics from './pages/Analytics';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="generate" element={<PostGenerator />} />
            <Route path="scheduler" element={<PostScheduler />} />
            <Route path="analyzer" element={<SubredditAnalyzer />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
