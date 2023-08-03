const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');
const fs = require('fs');

// Open the SQLite database connection
const db = new sqlite3.Database(':memory:');

// Create the "colleges" table
db.serialize(function () {
  db.run(
    'CREATE TABLE colleges (id INTEGER PRIMARY KEY AUTOINCREMENT, Institute TEXT, [Academic Program Name] TEXT, Quota TEXT, seattype TEXT, Gender TEXT, [Opening Rank] INTEGER, [Closing Rank] INTEGER, Year INTEGER, Round INTEGER)'
  );

  // Read the CSV file and insert data into the "colleges" table
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
          SeatType, // Update the field name here
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

      // Close the database connection
      db.close();
    });
});

module.exports = db;
