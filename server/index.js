const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 2002;

app.use(express.json());

app.post('/train', (req, res) => {
  const script = path.join(__dirname, '../train_ai.py');
  const process = spawn('python3', [script]);

  process.stdout.on('data', data => {
    console.log(`train: ${data}`.trim());
  });
  process.stderr.on('data', data => {
    console.error(`train err: ${data}`.trim());
  });

  process.on('close', code => {
    console.log(`train script exited with code ${code}`);
  });

  res.json({ status: 'training started' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
