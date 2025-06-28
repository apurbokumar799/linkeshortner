const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const PORT = 3000;
const URLS_PATH = 'urls.json';
const HOST_URL = "https://linkeshortner.onrender.com"; // <-- Render URL

app.use(express.static('public'));
app.use(express.json());

let urls = JSON.parse(fs.readFileSync(URLS_PATH, 'utf-8'));

// Serve ad page
app.get('/:short', (req, res) => {
  const short = req.params.short;
  const original = urls[short];
  if (!original) return res.status(404).send('Not Found');
  res.sendFile(path.join(__dirname, 'public', 'ad.html'));
});

// Final redirect
app.get('/go/:short', (req, res) => {
  const short = req.params.short;
  const original = urls[short];
  if (!original) return res.status(404).send('Not Found');
  res.redirect(original);
});

// Add new short link
app.post('/add', (req, res) => {
  const { code, url } = req.body;
  if (!code || !url) return res.status(400).send('Missing code or url');
  urls[code] = url;
  fs.writeFileSync(URLS_PATH, JSON.stringify(urls, null, 2));
  res.send(`✅ Short link created: ${HOST_URL}/${code}`);
});

app.listen(PORT, () => console.log(`✅ Server running at ${HOST_URL}`));
