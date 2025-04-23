import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import LocationsPage from './pages/LocationsPage';
import TemperatureRecordsPage from './pages/TemperatureRecordsPage';
import AddLocationPage from './pages/AddLocationPage';
import EditLocationPage from './pages/EditLocationPage';
import AddTemperaturePage from './pages/AddTemperaturePage';
import EditTemperaturePage from './pages/EditTemperaturePage';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/locations/add" element={<AddLocationPage />} />
          <Route path="/locations/edit/:id" element={<EditLocationPage />} />
          <Route path="/temperatures" element={<TemperatureRecordsPage />} />
          <Route path="/temperatures/add" element={<AddTemperaturePage />} />
          <Route path="/temperatures/edit/:id" element={<EditTemperaturePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;