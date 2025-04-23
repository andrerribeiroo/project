import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Thermometer } from 'lucide-react';
import { getTemperatureById, updateTemperature, getLocations } from '../api';
import { Temperature, Location } from '../types';

const EditTemperaturePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [locations, setLocations] = useState<Location[]>([]);
  const [temperature, setTemperature] = useState<Temperature>({
    data: new Date().toISOString().split('T')[0],
    horario: new Date().toTimeString().slice(0, 5),
    temperatura: 0,
    id_local: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchLocations(),
      id ? fetchTemperature(parseInt(id)) : Promise.resolve()
    ]).finally(() => setLoading(false));
  }, [id]);

  const fetchLocations = async () => {
    try {
      const data = await getLocations();
      setLocations(data);
    } catch (err) {
      setError('Erro ao carregar locais');
      console.error(err);
    }
  };

  const fetchTemperature = async (tempId: number) => {
    try {
      const data = await getTemperatureById(tempId);
      setTemperature(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados da temperatura');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateTemperature(parseInt(id), temperature);
      navigate('/temperatures');
    } catch (err) {
      setError('Erro ao atualizar registro de temperatura');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando dados do registro...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Thermometer size={24} className="text-primary mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">Editar Registro de Temperatura</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="local" className="form-label">Local</label>
          <select
            id="local"
            className="form-select"
            value={temperature.id_local}
            onChange={e => setTemperature({ ...temperature, id_local: parseInt(e.target.value) })}
            required
          >
            <option value="">Selecione um local</option>
            {locations.map(loc => (
              <option key={loc.id_local} value={loc.id_local}>
                {loc.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="data" className="form-label">Data</label>
          <input
            type="date"
            id="data"
            className="form-input"
            value={temperature.data}
            onChange={e => setTemperature({ ...temperature, data: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="horario" className="form-label">Horário</label>
          <input
            type="time"
            id="horario"
            className="form-input"
            value={temperature.horario}
            onChange={e => setTemperature({ ...temperature, horario: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="temperatura" className="form-label">Temperatura (°C)</label>
          <input
            type="number"
            id="temperatura"
            className="form-input"
            value={temperature.temperatura}
            onChange={e => setTemperature({ ...temperature, temperatura: parseFloat(e.target.value) })}
            step="0.1"
            required
          />
        </div>

        <div className="flex space-x-4">
          <button type="submit" className="btn btn-primary">
            Salvar Alterações
          </button>
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={() => navigate('/temperatures')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTemperaturePage;