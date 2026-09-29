import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleHindsightRequest } from './server/hindsightHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Mount Hindsight API routes
app.use('/api/hindsight', (req, res) => {
  handleHindsightRequest(req, res);
});

// Serve static files from Vite build output
app.use(express.static(path.join(__dirname, 'dist')));

// SPA client routing fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`MemoryCode AI server listening on port ${PORT}`);
});
