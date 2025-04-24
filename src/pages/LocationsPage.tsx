import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { getLocations, deleteLocation } from '../api';
import { Location } from '../types';

const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
      setDeletingId(id);
      await deleteLocation(id);
      setLocations(locations.filter(loc => loc.id_local !== id));
    } catch (err) {
      setError('Erro ao excluir local');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary h-12 w-12 mb-4" />
        <p className="text-lg text-gray-600">Carregando locais...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Locais Cadastrados</h1>
          <p className="text-gray-500 mt-1">Gerencie todos os locais de monitoramento</p>
        </div>
        <Link 
          to="/locations/add" 
          className="btn btn-primary flex items-center gap-2 hover:shadow-md transition-all"
        >
          <Plus size={20} />
          Adicionar Local
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {locations.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {locations.map(location => (
            <div 
              key={location.id_local} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-50 p-3 rounded-full">
                      <MapPin className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{location.nome}</h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {location.estado && `${location.estado}, `}{location.pais}
                      </p>
                      {location.coordenadas && (
                        <p className="text-gray-400 text-xs mt-2">
                          <span className="font-medium">Coordenadas:</span> {location.coordenadas}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Link 
                      to={`/locations/edit/${location.id_local}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar local"
                    >
                      <Edit size={18} />
                    </Link>
                    <button 
                      onClick={() => location.id_local && handleDelete(location.id_local)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir local"
                      disabled={deletingId === location.id_local}
                    >
                      {deletingId === location.id_local ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                <Link 
                  to={`/locations/${location.id_local}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Ver detalhes →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center max-w-md mx-auto">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={36} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">Nenhum local cadastrado</h3>
          <p className="text-gray-500 mb-6">Comece adicionando seu primeiro local de monitoramento</p>
          <Link 
            to="/locations/add" 
            className="btn btn-primary inline-flex items-center gap-2 hover:shadow-md transition-all"
          >
            <Plus size={18} />
            Adicionar Local
          </Link>
        </div>
      )}
    </div>
  );
};

export default LocationsPage;