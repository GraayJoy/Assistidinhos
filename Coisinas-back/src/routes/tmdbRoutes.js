import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();

const tmdbApiKey = process.env.TMDB_API_KEY;

router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Query é obrigatória' });

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&language=pt-BR&query=${encodeURIComponent(query)}&page=1&include_adult=false`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar no TMDb' });
  }
});

export default router;