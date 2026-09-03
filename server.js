const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');


const app = express();
app.use(cors());
app.use(express.json());

const db = new Database('notes.db');

db.run(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  )
`);

// 1. READ: Fetch all notes
app.get('/api/notes', (req, res) => {
  db.all('SELECT * FROM notes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 2. CREATE: Add a note
app.post('/api/notes', (req, res) => {
  const { title } = req.body;
  db.run('INSERT INTO notes (title) VALUES (?)', [title], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, title });
  });
});

// 3. UPDATE: Edit a note by ID
app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  db.run('UPDATE notes SET title = ? WHERE id = ?', [title, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Updated successfully' });
  });
});

// 4. DELETE: Remove a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM notes WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted successfully' });
  });
});

app.listen(3000, () => {
  console.log('Node.js API + SQLite running at http://localhost:3000');
});
