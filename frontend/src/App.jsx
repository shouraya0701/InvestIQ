import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SplashScreen } from './components/SplashScreen';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { StockSearch } from './pages/StockSearch';
import { StockDetails } from './pages/StockDetails';
import { Watchlist } from './pages/Watchlist';
import { Portfolio } from './pages/Portfolio';
import { Transactions } from './pages/Transactions';
import { SIPCalculator } from './pages/SIPCalculator';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <BrowserRouter>
        <AuthProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected App Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <ProtectedRoute>
                      <StockSearch />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/stocks/:symbol"
                  element={
                    <ProtectedRoute>
                      <StockDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/watchlist"
                  element={
                    <ProtectedRoute>
                      <Watchlist />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/portfolio"
                  element={
                    <ProtectedRoute>
                      <Portfolio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute>
                      <Transactions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sip"
                  element={
                    <ProtectedRoute>
                      <SIPCalculator />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
