require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
// const PORT = process.env.PORT;
// const MONGO_URI = process.env.MONGO_URI; // Ensure this matches your .env or fallback



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Set a timeout for server selection
})
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.error('MongoDB connection failed...', err));

// Define Schema and Model
const contactSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  number: { type: String, required: true },
  country: { type: String, required: true },
  message: { type: String, required: true },
});

const Contact = mongoose.model('Contact', contactSchema);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.post('/contact', async (req, res) => {
  const { firstname, lastname, number, country, message } = req.body;

  if (!firstname || !lastname || !number || !country || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newContact = new Contact({ firstname, lastname, number, country, message });
    await newContact.save();
    res.status(201).json({ message: 'Contact form submitted successfully!' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// // Serve the contact form at the root URL
 app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
 });

// Start the server
app.listen(5000, () => {
  console.log(`Server running.......`);
});
