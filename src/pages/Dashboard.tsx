import React, { useEffect, useState } from "react";
import {
  Cloud,
  MapPin,
  Thermometer,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { getLocations, getTemperatures } from "../api";
import { Location, Temperature } from "../types";
import TemperatureChart from "../components/charts/TemperatureChart";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [temperatures, setTemperatures] = useState<Temperature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [locationsData, temperaturesData] = await Promise.all([
        getLocations(),
        getTemperatures(),
      ]);
      setLocations(locationsData);
      setTemperatures(temperaturesData);
      setError(null);
      setLastUpdated(new Date().toLocaleTimeString("pt-BR"));
    } catch (err) {
      setError("Erro ao carregar dados do painel");
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

  const getAverageInRange = (): number | string => {
    const validTemps = temperatures
      .map((temp) => ({
        ...temp,
        temperatura: Number(temp.temperatura),
      }))
      .filter((temp) => !isNaN(temp.temperatura));

    if (validTemps.length === 0) return "N/D";

    const sortedTemps = validTemps.sort((a, b) => {
      const dateA = new Date(`${a.data}T${a.horario}`);
      const dateB = new Date(`${b.data}T${b.horario}`);
      return dateB.getTime() - dateA.getTime();
    });

    const last30Temps = sortedTemps.slice(0, 30);

    const sum = last30Temps.reduce((total, temp) => total + temp.temperatura, 0);
    const average = sum / last30Temps.length;

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
            <button
              className="btn-refresh"
              onClick={fetchData}
              aria-label="Atualizar dados"
            >
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
            <TrendingUp size={30} />
          </div>
          <div className="stat-content">
            <h3 className="stat-title">Média (Últimas 30 medições)</h3>
            <p className="stat-value">
              {typeof getAverageInRange() === "number"
                ? `${getAverageInRange()}°C`
                : getAverageInRange()}
            </p>
            <p className="stat-subtitle">Baseado nas últimas 30 medições</p>
          </div>
        </div>
      </div>

      {latestTemperature && (
        <div className="latest-record">
          <h2>Última Medição de Temperatura</h2>
          <div className="latest-record-content">
            <div className="latest-temperature">
              <Thermometer size={40} />
              <span className="temperature-value">
                {latestTemperature.temperatura}°C
              </span>
            </div>
            <div className="latest-details">
              <p>
                <strong>Local:</strong>{" "}
                {locations.find(
                  (loc) => loc.id_local === latestTemperature.id_local
                )?.nome || "Desconhecido"}
              </p>
              <p>
                <strong>Data:</strong>{" "}
                {new Date(latestTemperature.data).toLocaleDateString("pt-BR")}
              </p>
              <p>
                <strong>Horário:</strong> {latestTemperature.horario}
              </p>
            </div>
          </div>
        </div>
      )}

      {temperatures.length > 0 && (
        <div className="temperature-chart-container">
          <div className="chart-header">
            <h2>Tendências de Temperatura</h2>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-color primary"></span> Temperatura
              </span>
              <span className="legend-item">
                <span className="legend-color accent"></span> Média
              </span>
            </div>
          </div>
          <TemperatureChart
            temperatures={temperatures.slice(0, 30)}
            locations={locations}
          />
        </div>

        
      )}

      {/* Seção Sobre a Empresa */}
      <div className="about-section">
        <div className="about-content">
          <h2>Sobre a TempInfo</h2>
          <p>
            A TempInfo é líder em monitoramento climático, fornecendo dados precisos e análises avançadas para ajudar organizações a tomar decisões informadas sobre questões ambientais.
          </p>
          <p>
            Combinamos tecnologia de ponta com expertise científica para oferecer soluções personalizadas de monitoramento climático para diversos setores, incluindo agricultura, energia e gestão urbana.
          </p>
          <p>
            Nossa rede de sensores cobre mais de 50 localidades em todo o país, coletando dados em tempo real que são processados por nossos algoritmos proprietários.
          </p>
          <div className="about-features">
            <div className="feature">
              <Cloud size={20} />
              <span>Monitoramento 24/7</span>
            </div>
            <div className="feature">
              <TrendingUp size={20} />
              <span>Análise de tendências</span>
            </div>
            <div className="feature">
              <MapPin size={20} />
              <span>Cobertura nacional</span>
            </div>
          </div>
        </div>
        <div className="about-image">
          <img 
            src="https://cdn.jd1noticias.com/upload/dn_noticia/2019/03/natura-carta-da-parati-1920x1080-1931-f67f7822_2.jpg" 
            alt="Estação meteorológica" 
          />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;