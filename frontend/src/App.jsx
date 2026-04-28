import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Layout from './components/Layout';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AddTransaction from './pages/AddTransaction';
import TransactionHistory from './pages/TransactionHistory';
import BudgetPlanner from './pages/BudgetPlanner';
import AIPredictions from './pages/AIPredictions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-textMain font-sans">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="add-transaction" element={<AddTransaction />} />
              <Route path="history" element={<TransactionHistory />} />
              <Route path="budget" element={<BudgetPlanner />} />
              <Route path="predictions" element={<AIPredictions />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
