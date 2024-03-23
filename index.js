const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { PORT } = require("./config")

const { generateToken } = require("./utils/jwt")
const { authentication } = require("./middleware/authentication")

// Mock user data for simplicity
const users = [
  { id: 1, email: 'user1@mail.com', password: 'password1' },
  { id: 2, email: 'user2@mail.com', password: 'password2' }
];

const app = express();

app.use(express.json());
app.use(cookieParser());

// Login route
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
      // Create a JWT token
      const token = generateToken({ userId: user.id })
      // Set token as a cookie
      res.cookie('token', token, { httpOnly: true });
      res.json({ message: 'Login successful' });
  } else {
      res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Logout route
app.post('/auth/logout', (req, res) => {
  // Clear the token cookie
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

// Protected route
app.get('/protected', authentication, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});