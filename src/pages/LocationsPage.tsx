import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { getLocations, deleteLocation } from '../api';
import { Location } from '../types';

const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await getLocations();
      setLocations(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar locais');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este local?')) return;

    try {
      await deleteLocation(id);
      setLocations(locations.filter(loc => loc.id_local !== id));
    } catch (err) {
      setError('Erro ao excluir local');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando locais...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Locais</h1>
        <Link to="/locations/add" className="btn btn-primary">
          <Plus size={20} className="mr-2" />
          Adicionar Local
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locations.map(location => (
          <div key={location.id_local} className="card p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <MapPin className="text-primary mr-2" size={24} />
                <div>
                  <h3 className="text-lg font-semibold">{location.nome}</h3>
                  <p className="text-gray-600">{location.estado || ''}, {location.pais}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link 
                  to={`/locations/edit/${location.id_local}`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit size={18} />
                </Link>
                <button 
                  onClick={() => location.id_local && handleDelete(location.id_local)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {locations.length === 0 && !loading && (
        <div className="text-center py-8">
          <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Nenhum local cadastrado</p>
          <Link to="/locations/add" className="btn btn-primary mt-4">
            Adicionar Primeiro Local
          </Link>
        </div>
      )}
    </div>
  );
};

export default LocationsPage;