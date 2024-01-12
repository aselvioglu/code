const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
// Parse both URL-encoded and JSON request bodies

app.use(bodyParser.urlencoded({ extended: false })); // Use false for better security
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));



// MongoDB connection URI (replace with your actual MongoDB URI)
// MongoDB connection URI (replace with your actual MongoDB URI)
const uri = process.env.MONGODB_URI || 'mongodb+srv://aydinselvioglu:hasanasim@cluster0.ysvlpb7.mongodb.net/FEPProject?retryWrites=true&w=majority';

// Connect to MongoDB
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'FEPProject', // Set the default database to FEPProject
  authSource: 'admin', // Specify the database where the user credentials are stored
  user: 'aydinselvioglu', // Replace with your MongoDB username
  pass: 'hasanasim', // Replace with your MongoDB password
};

// Connect to MongoDB
mongoose.connect(uri, options)
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
  name: { type: String, required: true },
  surname: { type: String, required: true },
  username: { type: String, required:
 
true, unique: true }, // Enforce unique usernames
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Enforce unique emails
  designs: [
    {
      designId: Number,
      designName: String,
      designForm: Object,
    },
  ],
  creations: [
    {
      creationId: Number,
      creationName: String,
      creationForm: Object,
    },
  ],
  learnings: [
    {
      contentType: String,
      contentId: String,
      contentForm: Object,
    },
  ],
  messages: [
    {
      messageid: Number,
      sender: String,
      receiver: String,
      messageText: String,
    },
  ],
  grade: Number,
});

const User = mongoose.model('User', userSchema);

// Signup route with validation and error handling
app.post('/signup', async (req, res) => {
  try {
    const { name, surname, username, password, email } = req.body;

    // Validate user input
    if (!name || !surname || !username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({ name, surname, username, password, email });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Query the database to find a user with the provided username and password
      const user = await User.findOne({ username, password }).exec();
  
      if (user) {
        // If a user is found, redirect to the member homepage upon successful login
        res.redirect('/homePageFEPMembers.html');
      } else {
        // If the credentials are invalid, render the login page again with an error message
        res.send('Invalid username or password');
      }
    } catch (error) {
      // Handle any errors that occur during the database query
      res.status(500).send('An error occurred while processing your request');
    }
  });
  
  // Parse JSON bodies for POST requests
  app.use(bodyParser.json());
  
  // Define a route to handle form submissions
  app.post('/save-form', (req, res) => {
    // Assuming you are using a MongoDB model called FormData
    const FormData = require('./models/formData'); // Replace with your actual model import
  
    // Create a new FormData document with the submitted data
    const formData = new FormData(req.body);
  
    // Save the formData document to the database
    formData.save()
      .then(savedFormData => {
        console.log('Form data saved:', savedFormData);
        res.status(200).json({ message: 'Form data saved successfully' });
      })
      .catch(error => {
        console.error('Error saving form data:', error);
        res.status(500).json({ error: 'An error occurred while saving form data' });
      });
  });

  // Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});