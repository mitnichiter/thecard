const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing
app.use(cors());
// Serve static files (HTML, CSS, JS, images) from the current directory
app.use(express.static(__dirname));

// --- API Routes ---
// Endpoint to serve the playlist data
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

// --- Server Activation ---
app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
  console.log(`Access the player at http://localhost:${PORT}`);
});
