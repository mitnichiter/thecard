const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors());


// Serve static files (css, js, images) from the root directory.
// This will automatically handle requests for /style.css, /client.js, etc.
app.use(express.static(__dirname));

// --- API Route ---
// This route is checked before the catch-all.

// This is the standard way to serve all static files (css, js, images) 
// from the root directory. It's more efficient and robust.


// --- API Route ---
// This route will be matched before the catch-all below.
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

// This uses a regular expression to match all other GET requests.
// It serves the main app, and must be the LAST GET route.
// For any other GET request, serve the index.html file.
// This is the correct way to implement a catch-all for a single-page app.
app.get('/*', (req, res) => {

  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Server Activation ---
app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});
