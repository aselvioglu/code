const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));



// MongoDB connection URI (replace with your actual MongoDB URI)
const uri = 'mongodb+srv://aydinselvioglu:Zn19780323>@cluster0.ysvlpb7.mongodb.net/FEPProject';

// Connect to MongoDB
mongoose.connect(uri, {
  
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for the user model
const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  username: String,
  password: String,
  email: String,
  designs: {
    designId: Number,
    designName: String,
    designForm:Array


  },
  creations: {

    creationId: Number,
    creationName: String,
    creationForm: Array

  },
  learnings: {
    contentType: String,
    contentId: String,
    contentForm: Array,

  },
  messages: {
    messageid: Number,
    sender: String,
    receiver: String,
    messageText: String
  },
  grade: Number,
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Route for handling form submissions
app.post('/signup', async (req, res) => {
  try {
    // Extract form data from the request body
    const { name, surname, username, password, email } = req.body;

    // Create a new user instance
    const newUser = new User({ name, surname, username, password, email });

    // Save the new user to the database
    await newUser.save();

    res.send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user: ' + error.message);
  }
});


// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
