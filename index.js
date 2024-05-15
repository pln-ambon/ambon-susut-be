const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { PORT } = require("./config")
const router = require("./router")

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", router)

const { generateToken } = require("./utils/jwt")
const { authentication } = require("./middleware/authentication")

// Healthy check
app.get('/', (req, res) => {
  res.json({ message: 'Healthy check' });
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