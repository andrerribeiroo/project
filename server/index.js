import express from 'express';
import cors from 'cors';
import locaisRoutes from './routes/locais.js';
import temperaturasRoutes from './routes/temperaturas.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/locations', locaisRoutes);
app.use('/api/temperatures', temperaturasRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});