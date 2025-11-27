// server.js - SpellQuest OFFLINE-AI + login/register
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const usersFile = path.join(__dirname, 'users.json');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// ------------------- LOGIN -------------------
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  let users = [];

  try {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch (err) {
    console.error('Error reading users.json:', err);
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

// ------------------- REGISTER -------------------
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch (err) {
    console.error('Error reading users.json:', err);
  }

  if (users.find(u => u.username === username)) {
    return res.status(409).json({ success: false, message: 'Username already exists' });
  }

  users.push({ username, password, score: 0 });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  return res.status(201).json({ success: true, message: 'User registered successfully' });
});
// --- Update score when user answers correctly ---
app.post('/update-score', (req, res) => {
  const { username, points } = req.body;

  if (!username || points == null) {
    return res.status(400).json({ success: false, message: 'Username and points required' });
  }

  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch (err) {
    console.error('Error reading users.json:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  user.score = (user.score || 0) + points;

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  return res.status(200).json({ success: true, newScore: user.score });
});


// ------------------- HINT API -------------------
const HINT_KB = {
  bat: 'A flying animal that is active mostly at night.',
  cat: 'A small furry pet that loves to purr.',
  dog: 'A loyal animal that loves to bark and play.',
  sun: 'A bright ball in the sky that gives us light.',
  hat: 'You wear this on your head to protect from sun.',
  bat2: 'Used in games like cricket or baseball to hit the ball.',
  bird: 'An animal with wings that lays eggs and can fly.',
  apple: 'A round fruit that can be red, green, or yellow.',
  train: 'A long vehicle that runs on tracks and carries people.',
  green: 'A color you see in grass and many plants.',
  horse: 'A big animal you can ride; it gallops fast.',
  plant: 'A living thing that grows in soil and needs water and sun.',
  cloud: 'Soft white shapes you see floating in the sky.',
  moon: 'You see it at night shining in the sky.',
  frog: 'A small green animal that jumps and lives near water.',
  cake: 'A sweet dessert often eaten at birthdays.',
  bus: 'A big vehicle that carries many people on the road.',
  pencil: 'You use this to write and you can erase its marks.',
  zebra: 'An animal like a horse with black and white stripes.'
};

function generateHint(wordRaw) {
  const word = (wordRaw || '').toLowerCase().trim();
  if (!word) return 'Listen to the word carefully and look at the picture for clues.';
  if (HINT_KB[word]) return HINT_KB[word];
  const first = word[0].toUpperCase();
  const len = word.length;
  return `Think of a ${len}-letter word that starts with "${first}" and matches the picture.`;
}

app.post('/api/hint', (req, res) => {
  const word = req.body?.word;
  const hint = generateHint(word);
  return res.json({ hint });
});

// ------------------- FALLBACK -------------------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`SpellQuest OFFLINE-AI server running on http://localhost:${port}`);
});
