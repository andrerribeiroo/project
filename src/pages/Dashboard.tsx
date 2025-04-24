import React, { useEffect, useState } from 'react';
import { Cloud, MapPin, Thermometer, RefreshCw } from 'lucide-react';
import { getLocations, getTemperatures } from '../api';
import { Location, Temperature } from '../types';
import TemperatureChart from '../components/charts/TemperatureChart';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [temperatures, setTemperatures] = useState<Temperature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [locationsData, temperaturesData] = await Promise.all([
        getLocations(),
        getTemperatures()
      ]);
      setLocations(locationsData);
      setTemperatures(temperaturesData);
      setError(null);
      setLastUpdated(new Date().toLocaleTimeString('pt-BR'));
    } catch (err) {
      setError('Erro ao carregar dados do painel');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getLatestTemperature = (): Temperature | null => {
    if (temperatures.length === 0) return null;
    return temperatures.reduce((latest, current) => {
      const latestDate = new Date(`${latest.data}T${latest.horario}`);
      const currentDate = new Date(`${current.data}T${current.horario}`);
      return currentDate > latestDate ? current : latest;
    }, temperatures[0]);
  };

  const getAverageTemperature = (): number => {
    if (temperatures.length === 0) return 0;
    const sum = temperatures.reduce((total, temp) => total + temp.temperatura, 0);
    const average = sum / temperatures.length;
    return parseFloat(average.toFixed(1));
  };

  const latestTemperature = getLatestTemperature();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando dados do painel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={fetchData}>
          <RefreshCw size={18} />
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Painel de Dados Climáticos</h1>
        {lastUpdated && (
          <div className="last-updated">
            <span>Última atualização: {lastUpdated}</span>
            <button className="btn-refresh" onClick={fetchData} aria-label="Atualizar dados">
              <RefreshCw size={18} />
            </button>
          </div>
        )}
      </header>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <MapPin size={30} />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Locais Monitorados</h3>
            <p className="stat-value">{locations.length}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Thermometer size={30} />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Registros de Temperatura</h3>
            <p className="stat-value">{temperatures.length}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Cloud size={30} />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Temperatura Média</h3>
            <p className="stat-value">{getAverageTemperature()}°C</p>
          </div>
        </div>
      </div>
      
      {latestTemperature && (
        <div className="latest-record">
          <h2>Última Medição de Temperatura</h2>
          <div className="latest-record-content">
            <div className="latest-temperature">
              <Thermometer size={40} />
              <span className="temperature-value">{latestTemperature.temperatura}°C</span>
            </div>
            <div className="latest-details">
              <p><strong>Local:</strong> {locations.find(loc => loc.id_local === latestTemperature.id_local)?.nome || 'Desconhecido'}</p>
              <p><strong>Data:</strong> {new Date(latestTemperature.data).toLocaleDateString('pt-BR')}</p>
              <p><strong>Horário:</strong> {latestTemperature.horario}</p>
            </div>
          </div>
        </div>
      )}
      
      {temperatures.length > 0 && (
        <div className="temperature-chart-container">
          <div className="chart-header">
            <h2>Tendências de Temperatura</h2>
            <div className="chart-legend">
              <span className="legend-item"><span className="legend-color primary"></span> Temperatura</span>
              <span className="legend-item"><span className="legend-color accent"></span> Média</span>
            </div>
          </div>
          <TemperatureChart temperatures={temperatures.slice(0, 30)} locations={locations} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
