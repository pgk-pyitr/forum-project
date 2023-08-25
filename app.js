const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('forum.db');

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

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'forum'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
});

app.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    
    db.query(query, [username, password, email], (err, result) => {
        if (err) throw err;
        res.send({ success: true, message: 'User registered successfully' });
    });
});

app.post('/login', (req, res) => {
    // Your login logic here
});

app.get('/questions', (req, res) => {
    const query = 'SELECT * FROM questions';
    
    db.query(query, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

