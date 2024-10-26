const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
app.use(express.json()); // Parse JSON-formatted request bodies

// Serve static files from the "public" directory
app.use(express.static('public'));

// MySQL database connection
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

// Endpoint to search for existing event
app.post('/search-event', (req, res) => {
  const { event_name, year, month, day, location, historical_figures } = req.body;

  const query = `
    SELECT * FROM HistoricalEvents
    WHERE event_name = ? AND year = ? AND month = ? AND day = ?
  `;

  db.query(query, [event_name, year, month, day], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      // Return the found event data
      res.json({ event: results[0] });
    } else {
      // If no event found, return a message indicating so
      res.status(404).json({ message: 'Event not found.' });
    }
  });
});


// Endpoint to fetch event details by ID
app.get('/event-page/:id', (req, res) => {
  const eventId = req.params.id;
  const query = 'SELECT * FROM HistoricalEvents WHERE id = ?';

  db.query(query, [eventId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      // Serve an HTML page with the event details
      const event = results[0];
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Event Details</title>
            <link rel="stylesheet" href="app.css">
        </head>
        <body>
            <!-- Back to Form link -->
            <a href="http://127.0.0.1:5500/">Back to Form</a>

            <h1>${event.event_name}</h1>
            <p><strong>Date:</strong> ${event.year}-${event.month}-${event.day}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Historical Figures:</strong> ${event.historical_figures}</p>
        </body>
        </html>
      `);
    } else {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Event Not Found</title>
        </head>
        <body>
            <h1>Event Not Found</h1>
            <p>The event you are looking for does not exist in the database.</p>
            <a href="/">Back to Form</a>
        </body>
        </html>
      `);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
