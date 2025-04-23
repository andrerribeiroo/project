import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Listar todas as temperaturas com filtros opcionais
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, locationId } = req.query;
    let query = `
      SELECT t.*, l.nome as local_nome
      FROM temperaturas t
      JOIN locais l ON t.id_local = l.id_local
      WHERE 1=1
    `;
    const params = [];

    if (startDate) {
      query += ' AND t.data >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND t.data <= ?';
      params.push(endDate);
    }
    if (locationId) {
      query += ' AND t.id_local = ?';
      params.push(locationId);
    }

    query += ' ORDER BY t.data DESC, t.horario DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar temperaturas:', error);
    res.status(500).json({ error: 'Erro ao buscar temperaturas' });
  }
});

// Buscar temperatura por ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, l.nome as local_nome
       FROM temperaturas t
       JOIN locais l ON t.id_local = l.id_local
       WHERE t.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar temperatura:', error);
    res.status(500).json({ error: 'Erro ao buscar temperatura' });
  }
});

// Criar novo registro de temperatura
router.post('/', async (req, res) => {
  const { data, horario, temperatura, id_local } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO temperaturas (data, horario, temperatura, id_local) VALUES (?, ?, ?, ?)',
      [data, horario, temperatura, id_local]
    );
    res.status(201).json({
      id: result.insertId,
      data,
      horario,
      temperatura,
      id_local
    });
  } catch (error) {
    console.error('Erro ao criar registro:', error);
    res.status(500).json({ error: 'Erro ao criar registro' });
  }
});

// Atualizar registro de temperatura
router.put('/:id', async (req, res) => {
  const { data, horario, temperatura, id_local } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE temperaturas SET data = ?, horario = ?, temperatura = ?, id_local = ? WHERE id = ?',
      [data, horario, temperatura, id_local, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }
    res.json({
      id: req.params.id,
      data,
      horario,
      temperatura,
      id_local
    });
  } catch (error) {
    console.error('Erro ao atualizar registro:', error);
    res.status(500).json({ error: 'Erro ao atualizar registro' });
  }
});

// Deletar registro de temperatura
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM temperaturas WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }
    res.json({ message: 'Registro removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar registro:', error);
    res.status(500).json({ error: 'Erro ao deletar registro' });
  }
});

export default router;