import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Thermometer, Plus, Edit, Trash2, Calendar, Filter } from 'lucide-react';
import { getTemperatures, deleteTemperature } from '../api';
import { Temperature } from '../types';

const ITEMS_PER_PAGE = 50;

const TemperatureRecordsPage: React.FC = () => {
  const [temperatures, setTemperatures] = useState<Temperature[]>([]);
  const [filteredTemperatures, setFilteredTemperatures] = useState<Temperature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isFiltered, setIsFiltered] = useState(false);

  useEffect(() => {
    fetchTemperatures();
  }, []);

  useEffect(() => {
    // Aplicar filtro sempre que as temperaturas ou as datas mudarem
    applyDateFilter();
  }, [temperatures, startDate, endDate]);

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

  const applyDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredTemperatures(temperatures);
      setIsFiltered(false);
      return;
    }

    const filtered = temperatures.filter(temp => {
      const tempDate = new Date(temp.data);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return tempDate >= start && tempDate <= end;
      } else if (start) {
        return tempDate >= start;
      } else if (end) {
        return tempDate <= end;
      }
      return true;
    });

    setFilteredTemperatures(filtered);
    setIsFiltered(true);
    setCurrentPage(1); // Resetar para a primeira página ao aplicar filtro
  };

  const clearFilter = () => {
    setStartDate('');
    setEndDate('');
    setIsFiltered(false);
    setFilteredTemperatures(temperatures);
  };

  const totalPages = Math.ceil(filteredTemperatures.length / ITEMS_PER_PAGE);
  const paginatedData = filteredTemperatures.slice(
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

      {/* Filtro por data */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center mb-4">
          <Filter size={18} className="mr-2 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-700">Filtrar por Data</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              onClick={clearFilter}
              className="btn btn-secondary whitespace-nowrap"
              disabled={!isFiltered}
            >
              Limpar Filtro
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Contador de resultados */}
      <div className="mb-4 text-sm text-gray-600">
        {isFiltered ? (
          <span>Mostrando {filteredTemperatures.length} registro(s) filtrado(s)</span>
        ) : (
          <span>Total de {temperatures.length} registro(s)</span>
        )}
      </div>

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
          <p className="text-gray-600">
            {isFiltered 
              ? "Nenhum registro encontrado para o intervalo de datas selecionado"
              : "Nenhum registro de temperatura encontrado"}
          </p>
          {isFiltered ? (
            <button onClick={clearFilter} className="btn btn-primary mt-4">
              Limpar Filtro
            </button>
          ) : (
            <Link to="/temperatures/add" className="btn btn-primary mt-4">
              Adicionar Primeiro Registro
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default TemperatureRecordsPage;