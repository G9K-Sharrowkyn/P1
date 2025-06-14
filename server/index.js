const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 2002;

app.use(cors());
app.use(express.json());

app.post('/train', (req, res) => {
  const games = parseInt(req.body.games, 10) || 1;
  console.log('POST /train received', games);
  const script = path.join(__dirname, '../train_ai.py');
  console.log(`spawning python script ${script}`);
  const process = spawn('python', [script, games], { cwd: path.join(__dirname, '..') });

  process.stdout.on('data', data => {
    console.log(`train: ${data}`.trim());
  });
  process.stderr.on('data', data => {
    console.error(`train err: ${data}`.trim());
  });

  process.on('close', code => {
    console.log(`train script exited with code ${code}`);
  });

  console.log('training request acknowledged');
  res.json({ status: 'training started' });
});

app.get('/games', (req, res) => {
  const file = path.join(__dirname, '../ai_data/games.json');
  try {
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file));
      res.json(data);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error('read games error', err);
    res.status(500).json({ error: 'unable to read games' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
