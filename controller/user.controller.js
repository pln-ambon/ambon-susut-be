const {
  getUserByEmail,
  insertUser
} = require("../model/user.model")

const { generateToken } = require("../utils/jwt")
const { compare } = require("../utils/bcrypt")


async function login(req, res) {
    try {
      const { email, password } = req.body
      const user = await getUserByEmail({ email })

      if (!user) {
        throw {
          code: 401,
          message: "Email not found!"
        }
      }

      // compare password
      const isMatch = await compare(password, user.password)

      if (!isMatch) {
        throw {
          code: 401,
          message: "Password invalid"
        }
      }

      if (isMatch) {
        // Create a JWT token
        const token = generateToken({ 
          id: user.ID,
          email: user.email,
        })
  
        // Set token as a cookie
        res.cookie('token', token, { httpOnly: true });
        res.cookie('full_name', user.full_name, { httpOnly: true });
      }

      res.status(200).json({ 
        message: 'Login successful',
        full_name: user.full_name
       });
      
    } catch (error) {
      res.status(500).json(error)
    }
  }

async function register(req, res) {
  try {
    
    const {
      email,
      full_name,
      password
    } = req.body

    const user = await getUserByEmail({ email })

    if (user) {
      throw {
        code: 409,
        message: "Email already exists"
      }
    }

    const result = await insertUser({
      email,
      full_name,
      password
    })

    res.status(201).json({
      id: result?.ID,
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