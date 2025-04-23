import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [totalLocais] = await pool.query('SELECT COUNT(*) as total FROM locais');
    const [totalTemperaturas] = await pool.query('SELECT COUNT(*) as total FROM temperaturas');
    const [mediaTemperatura] = await pool.query('SELECT AVG(temperatura) as media FROM temperaturas');
    const [ultimasMedicoes] = await pool.query(`
      SELECT t.*, l.nome as local_nome
      FROM temperaturas t
      JOIN locais l ON t.id_local = l.id_local
      ORDER BY t.data DESC, t.horario DESC
      LIMIT 5
    `);

    res.json({
      totalLocais: totalLocais[0].total,
      totalTemperaturas: totalTemperaturas[0].total,
      mediaTemperatura: mediaTemperatura[0].media,
      ultimasMedicoes
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
  }
});

export default router;