const jwt = require("jsonwebtoken")
const { SECRET_KEY } = require("../config")

// generate token
function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY)
}

// verify token
function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY)
}

module.exports = {
  generateToken,
  verifyToken,
}