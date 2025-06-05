const express = require('express');
const cors = require('cors');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));

const USERS_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE));
    } catch (e) {
        return [];
    }
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Missing fields' });
    }
    const users = loadUsers();
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'User exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashed, collection: [], points: 0 };
    users.push(newUser);
    saveUsers(users);
    req.session.user = { username };
    res.json({ username, collection: [], points: 0 });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    req.session.user = { username };
    res.json({ username, collection: user.collection, points: user.points });
});

app.get('/api/profile', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
    const users = loadUsers();
    const user = users.find(u => u.username === req.session.user.username);
    res.json({ username: user.username, collection: user.collection, points: user.points });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(() => res.json({ message: 'Logged out' }));
});

app.post('/api/collection', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
    const { cards } = req.body;
    if (!Array.isArray(cards)) return res.status(400).json({ message: 'Invalid cards' });
    const users = loadUsers();
    const user = users.find(u => u.username === req.session.user.username);
    if (!user) return res.status(400).json({ message: 'User not found' });
    user.collection.push(...cards);
    saveUsers(users);
    res.json({ collection: user.collection });
});

app.post('/api/points', (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
    const { points } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.username === req.session.user.username);
    if (!user) return res.status(400).json({ message: 'User not found' });
    user.points += Number(points) || 0;
    saveUsers(users);
    res.json({ points: user.points });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
