const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors());

// --- API Route ---
app.get('/api/playlist', (req, res) => {
  const playlistPath = path.join(__dirname, 'playlist.json');
  fs.readFile(playlistPath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading playlist.json:", err);
      return res.status(500).json({ error: 'Failed to read playlist data.' });
    }
    try {
      const playlist = JSON.parse(data);
      res.json(playlist);
    } catch (parseError) {
      console.error("Error parsing playlist.json:", parseError);
      return res.status(500).json({ error: 'Playlist data is not valid JSON.' });
    }
  });
});

// --- Static Asset Routes ---
// Explicitly serve each static file your application needs.
app.get('/style.css', (req, res) => res.sendFile(path.join(__dirname, 'style.css')));
app.get('/effects.css', (req, res) => res.sendFile(path.join(__dirname, 'effects.css')));
app.get('/client.js', (req, res) => res.sendFile(path.join(__dirname, 'client.js')));
app.get('/p.jpg', (req, res) => res.sendFile(path.join(__dirname, 'p.jpg')));

// --- Root and Catch-All Route ---
// Any request that isn't for the API or a known static file will serve the main app.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Server Activation ---
app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});