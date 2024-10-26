const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Importing cors
const app = express();
const port = 3000;

// Enable cors
app.use(cors())

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',  // or your MySQL server IP
  user: 'root',
  password: 'THippo3120!',
  database: 'ttSimulator'
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Create a GET route to fetch data
app.get('/events', (req, res) => {
  const query = 'SELECT * FROM HistoricalEvents';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
