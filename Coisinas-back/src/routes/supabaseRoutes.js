import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.get('/assistidos', async (req, res) => {
  const { data, error } = await supabase.from('assistidos').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/assistidos', async (req, res) => {
  const { name, image, category } = req.body;

  const { data, error } = await supabase
    .from('assistidos')
    .insert([{ name, image, category }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

router.patch('/assistidos/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from('assistidos')
    .update(updates)
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete('/assistidos/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('assistidos').delete().eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

export default router;
