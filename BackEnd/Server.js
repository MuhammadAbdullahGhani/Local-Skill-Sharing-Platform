const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken'); // To issue JWT tokens
const userRoutes = require('./routes/userRoutes');
const skillRoutes=require('./routes/SkillRoutes');
const bookingRoutes = require('./routes/BookingRoutes');
const analyticsRoutes = require('./routes/AnalyticalRoutes');
const currentRoute = require('./routes/currentRoute');
dotenv.config();

// Import User model
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json

// DB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Admin Panel API");
});

app.post('/signup', async (req, res) => {
  const { name, email, mobile, role, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    // Create new user (store password as plain text)
    const newUser = new User({ name, email, mobile, role, password });
    await newUser.save();

    // Return a success message
    return res.status(200).json({ message: 'Account created successfully!' });
  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ message: 'Error inserting user into database.', error: err.message });
  }
});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No User found' });
    }

    // Directly compare the provided password with the stored password (plain text comparison)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // If password is correct, generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respond with the token
    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

app.use('/api/users', userRoutes);
app.use('/api/skills',skillRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api', currentRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
