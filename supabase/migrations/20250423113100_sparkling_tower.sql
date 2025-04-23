-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS clima_db;
USE clima_db;

-- Tabela de locais
CREATE TABLE IF NOT EXISTS locais (
  id_local INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  estado VARCHAR(50),
  pais VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de temperaturas
CREATE TABLE IF NOT EXISTS temperaturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  temperatura DECIMAL(5,2) NOT NULL,
  id_local INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_local) REFERENCES locais(id_local)
);

-- Índices para melhor performance
CREATE INDEX idx_data ON temperaturas(data);
CREATE INDEX idx_id_local ON temperaturas(id_local);