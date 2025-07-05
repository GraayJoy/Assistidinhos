import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabaseRoutes from './routes/supabaseRoutes.js';
import tmdbRoutes from './routes/tmdbRoutes.js';

dotenv.config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Requisição recebida: ${req.method} ${req.url}`);
  next();
});

app.use('/api', supabaseRoutes);

app.use('/api/tmdb', tmdbRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
