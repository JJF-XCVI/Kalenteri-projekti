import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 3000;
const DATA_FILE = path.resolve('events.json');

// Sallitaan CORS (jotta React-frontti voi tehdä pyyntöjä tähän porttiin)
app.use(cors());
// Otetaan vastaan JSON-muotoista dataa pyynnöissä
app.use(express.json());

// Apufunktiot JSON-tiedoston lukemiseen ja kirjoittamiseen
async function readEvents() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeEvents(events) {
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), 'utf-8');
}

// --- API REITIT (CRUD) ---

// 1. GET /api/events - Haetaan kaikki kalenterimerkinnät
app.get('/api/events', async (req, res) => {
  const events = await readEvents();
  res.json(events);
});

// 2. POST /api/events - Tallennetaan uusi tapahtuma
app.post('/api/events', async (req, res) => {
  const { title, description, date, category } = req.body;

  // Suunnitelman mukainen validointi: Title ei saa olla tyhjä
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title (tapahtuman nimi) on pakollinen tieto.' });
  }

  const events = await readEvents();
  
  const newEvent = {
    id: Date.now().toString(), // Luo uniikin ID:n aikaleimasta
    title,
    description: description || '',
    date,
    category: category || 'työ'
  };

  events.push(newEvent);
  await writeEvents(events);

  res.status(201).json(newEvent);
});

// 3. PUT /api/events/:id - Päivitetään olemassa olevan tapahtuman tiedot
app.put('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, date, category } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title ei voi olla tyhjä.' });
  }

  const events = await readEvents();
  const eventIndex = events.findIndex(e => e.id === id);

  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Tapahtumaa ei löytynyt.' });
  }

  // Päivitetään tiedot säilyttäen vanha ID
  events[eventIndex] = { id, title, description, date, category };
  await writeEvents(events);

  res.json(events[eventIndex]);
});

// 4. DELETE /api/events/:id - Poistetaan tietty tapahtuma
app.delete('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  const events = await readEvents();
  
  const eventExists = events.some(e => e.id === id);
  if (!eventExists) {
    return res.status(404).json({ error: 'Tapahtumaa ei löytynyt antamallasi ID:llä.' });
  }

  const filteredEvents = events.filter(e => e.id !== id);
  await writeEvents(filteredEvents);

  res.json({ message: 'Tapahtuma poistettu onnistuneesti.' });
});

// Käynnistetään palvelin
app.listen(PORT, () => {
  console.log(`Backend-palvelin käynnissä portissa: http://localhost:${PORT}`);
});
