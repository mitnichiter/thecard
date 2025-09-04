const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors());

// Serve static files (css, js, images) from the root directory
app.use(express.static(__dirname));

// --- API Route ---
app.get('/api/playlist', (req, res) => {
  const playlistPath = path.join(__dirname, 'playlist.json');
  fs.readFile(playlistPath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading playlist.json:", err);
      return res.status(500).json({ error: 'Failed to read playlist data.' });
    }
    try {
      res.json(JSON.parse(data));
    } catch (parseError) {
      console.error("Error parsing playlist.json:", parseError);
      return res.status(500).json({ error: 'Playlist data is not valid JSON.' });
    }
  });
});

// --- SPA Catch-All Route ---
// This must come last: send index.html for all other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Server Activation ---
app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});
