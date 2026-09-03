const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize Database
const db = new Database('notes.db');

// Create Table
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL
  )
`);

// GET all notes
app.get('/api/notes', (req, res) => {
  const notes = db.prepare('SELECT * FROM notes').all();
  res.json(notes);
});

// POST a new note
app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  const stmt = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)');
  const result = stmt.run(title, content);
  res.json({ id: result.lastInsertRowid, title, content });
});

// PUT (Update) a note
app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const stmt = db.prepare('UPDATE notes SET title = ?, content = ? WHERE id = ?');
  stmt.run(title, content, id);
  res.json({ id, title, content });
});

// DELETE a note
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
  stmt.run(id);
  res.json({ message: 'Deleted successfully' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
