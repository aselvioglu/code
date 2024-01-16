const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection URI (replace with your actual MongoDB URI)
const uri = process.env.MONGODB_URI || "mongodb+srv://aydinselvioglu:hasanasim@cluster0.ysvlpb7.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'FEPProject',
  authSource: 'admin',
  user: 'aydinselvioglu',
  pass: 'hasanasim',
  
});

// Set up event listeners for the MongoDB connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for the user model
const userSchema = new mongoose.Schema({
  "userId": Number,
  "name": String,
  "surname": String,
  "username": { "type": String, "unique": true },
  "password": String,
  "email": { "type": "String", "unique": true },
  "subscribeDate": {
    "type": Date,
    "required": true,
    "default": Date.now
  },
  "designs": [
    {
      "designId": Number,
      "designName": String,
      "designForm": Object,
    },
  ],
  "creations": [
    {
      "creationId": Number,
      "creationName": String,
      "creationForm": Object,
    },
  ],
  "learnings": [
    {
      "contentType": String,
      "contentId": String,
      "contentForm": Object,
    },
  ],
  "messages": [
    {
      "messageId": Number,
      "senderUserName": String,
      "messageText": String,
    },
  ],
  "grade": Number,
  "photo": Object,
}, { collection: 'kullanici' }); // Specify the collection name

// Create a model based on the schema
const User = mongoose.model('User', userSchema);


const Message = mongoose.model('Message', { message: String });


// Handle POST requests to /send-message
app.post('/send-message', async (req, res) => {
  try {
    const { name, surname, email, message } = req.body;

    // Validate the input (e.g., check for required fields)

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

app.post('/send-message', async (req, res) => {
  try {
    // Assuming the user is authenticated and their username is available in req.user.username
    const senderUsername = req.user.username;
    const receiverUsername = req.body.receiverUsername;
    const message = req.body.message;

    // Find the sender's user document in the database
    const senderUser = await User.findOne({ username: senderUsername });

    // Save the message to the sender's messages array
    senderUser.messages.push({ sender: senderUsername, receiver: receiverUsername, message: message });

    // Save the updated user document back to the database
    await senderUser.save();

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route for handling form submissions
app.post('/signup', async (req, res) => {
  try {
    // Extract form data from the request body
    const { name, surname, username, password, email } = req.body;
    console.log('Received form data:', req.body);

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ username }).exec();
    if (existingUser) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }
// Route to view all users (accessible to admin only)
app.get('/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().exec();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});

// Route to update a user (accessible to admin only)
app.put('/admin/users/:userId', isAdmin, async (req, res) => {
  // Implement logic to update user
});

// Route to delete a user (accessible to admin only)
app.delete('/admin/users/:userId', isAdmin, async (req, res) => {
  // Implement logic to delete user
});

// Define a route to handle dashboard data requests
app.get('/dashboard-data', async (req, res) => {
  try {
    // Assume you have a collection named 'dashboard' in your MongoDB database
    const database = client.db('FEPProject');
    const dashboardCollection = database.collection('kullanici');
    // Query the dashboard collection to retrieve the data
    const dashboardData = await dashboardCollection.findOne({}); // You may need to specify a query here
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  // Implement logic to check if the user is an admin
  // For example, you can check if the user has an 'isAdmin' flag in their user document
  if (req.user && req.user.isAdmin) {
    // User is an admin, proceed to the next middleware/route handler
    next();
  } else {
    // User is not an admin, send a 403 Forbidden response
    res.status(403).json({ error: 'Access denied. You are not authorized to perform this action.' });
  }
}
// Example usage of isAdmin middleware in admin routes
app.get('/admin/users', isAdmin, async (req, res) => {
  // Logic to handle admin-only operation
});
    // Create a new user instance
    const newUser = new User({ name, surname, username, password, email });

    // Save the new user to the database
    const savedUser = await newUser.save();
    console.log('User registered successfully:', savedUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering the user' });
  }
});


// Route to fetch the first 10 messages with sender names and dates from the database
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 }) // Sort messages by createdAt timestamp in descending order
      .limit(10) // Limit to the first 10 messages
      .populate('sender', 'name'); // Populate the 'sender' field with 'name' from the User model
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
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
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});