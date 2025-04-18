const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

// Initialize the Express app
const app = express();
const port = 3000;

// Enable CORS
app.use(cors()); // Allows cross-origin requests from the React Native app

// Middleware for parsing JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root',      
  password: '123456',  // Make sure to replace this with your actual MySQL password
  database: 'my_db',   // Replace with your actual database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Set up Multer for file uploads (storing files in the 'uploads' directory)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Create the 'uploads' directory if it doesn't exist
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename with timestamp to avoid collisions
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filter to allow only certain file types (PDF, JPG, PNG)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit files to 10MB
});

// POST endpoint to handle form submissions
app.post('/submit', upload.fields([
  { name: 'tenth' },
  { name: 'inter' },
  { name: 'ug' },
  { name: 'pg' },
]), (req, res) => {
  console.log('Received Body:', req.body);  // Log the form data (name, email, pg)
  console.log('Received Files:', req.files);  // Log the uploaded files

  const { name, email, pg } = req.body;
  const { tenth, inter, ug, pgCertificate } = req.files || {};  // Ensure that req.files exists

  // Check if all required fields are present
  if (!name || !email || !tenth || !inter || !ug) {
    console.log('Missing required fields: ', { name, email, tenth, inter, ug });
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  // Prepare data for database insertion
  const sql = 'INSERT INTO form_submissions (name, email, pg, tenth, inter, ug, pg_certificate) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [
    name,
    email,
    pg === 'yes' ? 1 : 0,  // Convert 'yes'/'no' to boolean (1/0)
    tenth[0]?.path || '',  // Path of the tenth file
    inter[0]?.path || '',  // Path of the inter file
    ug[0]?.path || '',     // Path of the ug file
    pgCertificate ? pgCertificate[0]?.path : null, // Path of the pg certificate file (optional)
  ];

  // Insert data into the MySQL database
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error inserting into MySQL:', err);
      return res.status(500).json({ message: 'Submission failed.' });
    }

    res.json({ message: 'Form submitted successfully!' });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
