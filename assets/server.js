// Import required libraries and configure server
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS and parse JSON request bodies
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'THippo3120!',
  database: 'ttSimulator'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Endpoint to add a new event
app.post('/add-event', (req, res) => {
  const { event_name, year, month, day, hour, minute, location, historical_figures } = req.body;

  const query = 
    `INSERT INTO HistoricalEvents (event_name, year, month, day, hour, minute, location, historical_figures)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [event_name, year, month, day, hour, minute, location, historical_figures], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Event successfully added!', eventId: results.insertId });
  });
});


// Endpoint to get event details by ID
app.get('/event', (req, res) => {
  const { year, month, day, hour, minute } = req.query;

  const query = 
      `SELECT id, event_name, location, historical_figures 
      FROM HistoricalEvents 
      WHERE year = ? AND month = ? AND day = ? AND hour = ? AND minute = ?
  `;

  db.query(query, [year, month, day, hour, minute], (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
          return res.status(404).json({ error: 'Event not found' });
      }
      res.json(results[0]); // returns the event object, including id
  });
});



// Existing search-event and event-page endpoints

// Start the server
app.listen(port, () => {
  console.log('Server running on http://localhost:${port}');
});