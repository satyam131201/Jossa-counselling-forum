const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Set up static file serving
app.use(express.static('public'));

// Open the SQLite database connection
const db = new sqlite3.Database(':memory:');

// Create the "colleges" table
db.serialize(function () {
  db.run(
    'CREATE TABLE colleges (id INTEGER PRIMARY KEY AUTOINCREMENT, Institute TEXT, [Academic Program Name] TEXT, Quota TEXT, seattype TEXT, Gender TEXT, [Opening Rank] INTEGER, [Closing Rank] INTEGER, Year INTEGER, Round INTEGER)'
  );

  // Read the CSV file and insert data into the "colleges" table
  const csv = require('csv-parser');
  const fs = require('fs');

  fs.createReadStream('college.csv')
    .pipe(csv())
    .on('data', function (data) {
      const {
        Institute,
        'Academic Program Name': AcademicProgramName,
        Quota,
        seattype,
        Gender,
        'Opening Rank': OpeningRank,
        'Closing Rank': ClosingRank,
        Year,
        Round,
      } = data;

      db.run(
        'INSERT INTO colleges (Institute, [Academic Program Name], Quota, seattype, Gender, [Opening Rank], [Closing Rank], Year, Round) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          Institute,
          AcademicProgramName,
          Quota,
          seattype,
          Gender,
          OpeningRank,
          ClosingRank,
          Year,
          Round,
        ]
      );
    })
    .on('end', function () {
      console.log('Data inserted successfully.');
    });
});

// Define API endpoint for searching colleges
// server.js

// ...

// Define API endpoint for searching colleges
app.get('/search', (req, res) => {
  const { closingRank, year, round, seattype } = req.query;

  // Query the database for colleges with closing rank below the provided value, the specified year, and round
  db.all(
    'SELECT Institute, [Academic Program Name] FROM colleges WHERE [Closing Rank] >= ? AND Year = ? AND Round = ? AND seattype = ?',
    closingRank,
    year,
    round,
    seattype,
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        const colleges = rows.map((row) => ({
          institute: row.Institute,
          academicProgramName: row['Academic Program Name'],
        }));
        res.json(colleges);
      }
    }
  );
});

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the results.html file
app.get('/results', (req, res) => {
  res.sendFile(path.join(__dirname, 'results.html'));
});

// ...

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
