import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { getLocationById, updateLocation } from '../api';
import { Location } from '../types';

const EditLocationPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<Location>({
    nome: '',
    estado: '',
    pais: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchLocation(parseInt(id));
    }
  }, [id]);

  const fetchLocation = async (locationId: number) => {
    try {
      const data = await getLocationById(locationId);
      setLocation(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados do local');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await updateLocation(parseInt(id), location);
      navigate('/locations');
    } catch (err) {
      setError('Erro ao atualizar local');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando dados do local...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <MapPin size={24} className="text-primary mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">Editar Local</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label htmlFor="nome" className="form-label">Nome do Local</label>
          <input
            type="text"
            id="nome"
            className="form-input"
            value={location.nome}
            onChange={e => setLocation({ ...location, nome: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="estado" className="form-label">Estado (opcional)</label>
          <input
            type="text"
            id="estado"
            className="form-input"
            value={location.estado}
            onChange={e => setLocation({ ...location, estado: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="pais" className="form-label">País</label>
          <input
            type="text"
            id="pais"
            className="form-input"
            value={location.pais}
            onChange={e => setLocation({ ...location, pais: e.target.value })}
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
            onClick={() => navigate('/locations')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLocationPage;