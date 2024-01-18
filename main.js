const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
// Use the cors middleware
app.use(cors());
// Enable CORS with specific options
app.use(cors({
  origin: 'http://localhost:5500', // Allow requests from this origin
  methods: 'GET,POST', // Allow only GET and POST requests
  allowedHeaders: 'Content-Type,Authorization', // Allow only specified headers
}));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection URI (replace with your actual MongoDB URI)
const uri = process.env.MONGODB_URI || "mongodb+srv://aydinselvioglu:hasanasim@cluster0.rqmvbsv.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'FEPProject',
  authSource: 'admin',
  user: 'aydinselvioglu',
  pass: 'hasanasim'
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Define a schema for the user model
const userSchema = new mongoose.Schema({
  userId: Number,
  name: String,
  surname: String,
  username: { type: String, unique: true },
  password: String,
  email: { type: String, unique: true },
  subscribeDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  designs: [
    {
      designId: Number,
      designName: String,
      designForm: Object
    }
  ],
  creations: [
    {
      creationId: Number,
      creationName: String,
      creationForm: Object
    }
  ],
  learnings: [
    {
      contentType: String,
      contentId: String,
      contentForm: Object
    }
  ],
  messages: [
    {
      messageId: Number,
      senderUserName: String,
      messageText: String
    }
  ],
  grade: Number,
  photo: Object
}, { collection: 'kullanici' }); // Specify the collection name

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Handle POST requests to /send-message
app.post('/send-message', async (req, res) => {
  try {
    const { name, surname, email, message } = req.body;

    // Create a new message document using the Message model
    const newMessage = new Message({ name, surname, email, message });

    // Save the message to the database
    await newMessage.save();

    // Send a success response
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    // Send an error response if something goes wrong
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { name, surname, username, password, email } = req.body;
    const existingUser = await User.findOne({ $or: [{ username: username }, { email: email }] }).exec();
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const newUser = new User({ name, surname, username, password, email });
    const savedUser = await newUser.save();
    console.log('User registered successfully:', savedUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering the user' });
  }
});

// Route for handling login
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
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    // Handle any errors that occur during the database query
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
