import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Thermometer, Plus, Edit, Trash2 } from 'lucide-react';
import { getTemperatures, deleteTemperature } from '../api';
import { Temperature } from '../types';

const ITEMS_PER_PAGE = 50;

const TemperatureRecordsPage: React.FC = () => {
  const [temperatures, setTemperatures] = useState<Temperature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTemperatures();
  }, []);

  const fetchTemperatures = async () => {
    try {
      setLoading(true);
      const data = await getTemperatures();
      setTemperatures(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar registros de temperatura');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) return;

    try {
      await deleteTemperature(id);
      setTemperatures(prev => prev.filter(temp => temp.id !== id));
    } catch (err) {
      setError('Erro ao excluir registro');
      console.error(err);
    }
  };

  const totalPages = Math.ceil(temperatures.length / ITEMS_PER_PAGE);
  const paginatedData = temperatures.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando registros de temperatura...</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Registros de Temperatura</h1>
        <Link to="/temperatures/add" className="btn btn-primary">
          <Plus size={20} className="mr-2" />
          Adicionar Registro
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table min-w-full">
          <thead>
            <tr>
              <th>Local</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Temperatura</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(temp => (
              <tr key={temp.id}>
                <td>{temp.local?.nome || 'Local não encontrado'}</td>
                <td>{new Date(temp.data).toLocaleDateString('pt-BR')}</td>
                <td>{temp.horario}</td>
                <td>{temp.temperatura}°C</td>
                <td>
                  <div className="flex space-x-2">
                    <Link 
                      to={`/temperatures/edit/${temp.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit size={18} />
                    </Link>
                    <button 
                      onClick={() => temp.id && handleDelete(temp.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Abas de paginação na parte inferior */}
      {totalPages > 1 && (
        <div className="mt-6 overflow-x-auto">
          <div className="flex space-x-2 w-max min-w-full px-1 pb-2">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Página {page}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {paginatedData.length === 0 && !loading && (
        <div className="text-center py-8">
          <Thermometer size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Nenhum registro de temperatura encontrado</p>
          <Link to="/temperatures/add" className="btn btn-primary mt-4">
            Adicionar Primeiro Registro
          </Link>
        </div>
      )}
    </div>
  );
};

export default TemperatureRecordsPage;
