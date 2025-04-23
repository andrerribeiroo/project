import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Listar todos os locais
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM locais ORDER BY nome');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar locais:', error);
    res.status(500).json({ error: 'Erro ao buscar locais' });
  }
});

// Buscar local por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM locais WHERE id_local = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar local:', error);
    res.status(500).json({ error: 'Erro ao buscar local' });
  }
});

// Criar novo local
router.post('/', async (req, res) => {
  const { nome, estado, pais } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO locais (nome, estado, pais) VALUES (?, ?, ?)',
      [nome, estado, pais]
    );
    res.status(201).json({ id_local: result.insertId, nome, estado, pais });
  } catch (error) {
    console.error('Erro ao criar local:', error);
    res.status(500).json({ error: 'Erro ao criar local' });
  }
});

// Atualizar local
router.put('/:id', async (req, res) => {
  const { nome, estado, pais } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE locais SET nome = ?, estado = ?, pais = ? WHERE id_local = ?',
      [nome, estado, pais, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }
    res.json({ id_local: req.params.id, nome, estado, pais });
  } catch (error) {
    console.error('Erro ao atualizar local:', error);
    res.status(500).json({ error: 'Erro ao atualizar local' });
  }
});

// Deletar local
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM locais WHERE id_local = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }
    res.json({ message: 'Local removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar local:', error);
    res.status(500).json({ error: 'Erro ao deletar local' });
  }
});

export default router;