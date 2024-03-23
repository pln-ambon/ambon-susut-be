const {
  getUserByEmail,
  insertUser
} = require("../model/user.model")

const { generateToken } = require("../utils/jwt")


async function login(req, res) {
    try {
      const { email, password } = req.body
      const user = await getUserByEmail({ email })

      // Create a JWT token
      const token = generateToken({ userId: user.id })
      // Set token as a cookie
      res.cookie('token', token, { httpOnly: true });
      res.status(200).json({ message: 'Login successful' });
      
    } catch (error) {
      res.send(401).json(error)
    }
  }

async function register(req, res) {
  try {
    
    const {
      email,
      full_name,
      password
    } = req.body

    console.log(email, "<< controller register");

    const result = await insertUser({
      email,
      full_name,
      password
    })

    console.log(result, "<< result controller");

    res.status(201).json({
      id: result?.id,
      email: result?.email,
      full_name: result?.full_name
    })

  } catch (error) {
    res.status(500).json(error?.message)
  }
}
module.exports = {
  login,
  register
}