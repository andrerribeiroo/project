import axios from 'axios';
import { Location, Temperature } from '../types';

const API_URL = 'http://localhost:3001/api';

// Locations API
export const getLocations = async () => {
  const response = await axios.get(`${API_URL}/locations`);
  return response.data;
};

export const getLocationById = async (id: number) => {
  const response = await axios.get(`${API_URL}/locations/${id}`);
  return response.data;
};

export const createLocation = async (location: Location) => {
  const response = await axios.post(`${API_URL}/locations`, location);
  return response.data;
};

export const updateLocation = async (id: number, location: Location) => {
  const response = await axios.put(`${API_URL}/locations/${id}`, location);
  return response.data;
};

export const deleteLocation = async (id: number) => {
  const response = await axios.delete(`${API_URL}/locations/${id}`);
  return response.data;
};

// Temperatures API
export const getTemperatures = async (params?: { startDate?: string; endDate?: string; locationId?: number }) => {
  const response = await axios.get(`${API_URL}/temperatures`, { params });
  return response.data;
};

export const getTemperatureById = async (id: number) => {
  const response = await axios.get(`${API_URL}/temperatures/${id}`);
  return response.data;
};

export const createTemperature = async (temperature: Temperature) => {
  const response = await axios.post(`${API_URL}/temperatures`, temperature);
  return response.data;
};

export const updateTemperature = async (id: number, temperature: Temperature) => {
  const response = await axios.put(`${API_URL}/temperatures/${id}`, temperature);
  return response.data;
};

export const deleteTemperature = async (id: number) => {
  const response = await axios.delete(`${API_URL}/temperatures/${id}`);
  return response.data;
};

// Dashboard data
export const getDashboardData = async () => {
  const response = await axios.get(`${API_URL}/dashboard`);
  return response.data;
};