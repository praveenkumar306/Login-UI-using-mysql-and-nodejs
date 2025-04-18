const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS
app.use(cors({ origin: '*' }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/eduUpload', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB schema for user data
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  pg: String,
  files: {
    tenth: Object,
    inter: Object,
    ug: Object,
    pg: Object,
  },
});

const User = mongoose.model('User', UserSchema);

// Multer setup (store files in memory)
const storage = multer.memoryStorage(); // Use memory storage for simplicity
const upload = multer({ storage });

// Define fields for file upload (all four certificates)
const multiUpload = upload.fields([
  { name: 'tenth' },
  { name: 'inter' },
  { name: 'ug' },
  { name: 'pg' },
]);

// POST endpoint to handle form submissions and file uploads
app.post('/submit', multiUpload, async (req, res) => {
  const { name, email, pg } = req.body;

  const files = {
    tenth: req.files?.tenth?.[0] || null,
    inter: req.files?.inter?.[0] || null,
    ug: req.files?.ug?.[0] || null,
    pg: req.files?.pg?.[0] || null,
  };

  const user = new User({
    name,
    email,
    pg,
    files,
  });

  try {
    // Save user data and files to MongoDB
    await user.save();
    res.json({ message: 'Data and documents saved to MongoDB' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database save failed' });
  }
});

// Start server on specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
