const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('forum.db');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');



const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));


db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      email TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      body TEXT NOT NULL,
      question_id INTEGER,
      user_id INTEGER,
      FOREIGN KEY(question_id) REFERENCES questions(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

app.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    
    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.run(query, [username, hash, email], (err) => {
      if (err) throw err;
      res.send({ success: true, message: 'User registered successfully' });
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';

  db.get(query, [username], (err, row) => {
    if (err) {
      throw err;
    }

    if (row) {
      bcrypt.compare(password, row.password, (err, result) => {
        if (result) {
          res.send({ success: true, message: 'Login successful', user: { id: row.id, username: row.username } });
        } else {
          res.status(401).send({ success: false, message: 'Invalid password' });
        }
      });
    } else {
      res.status(404).send({ success: false, message: 'User not found' });
    }
  });
});

app.get('/questions', (req, res) => {
    const query = 'SELECT * FROM questions';
    
    db.all(query, [], (err, rows) => {
      if (err) throw err;
      res.send(rows);
    });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

