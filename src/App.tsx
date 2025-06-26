import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Monitoring } from './pages/Monitoring';
import { Controls } from './pages/Controls';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Alerts } from './pages/Alerts';
import { Maintenance } from './pages/Maintenance';
import { FarmProvider } from './context/FarmContext';

function App() {
  return (
    <FarmProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/controls" element={<Controls />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </FarmProvider>
  );
}

export default App;