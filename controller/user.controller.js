const {
  getUserByEmail,
  insertUser
} = require("../model/user.model")

class User {
  // static async login(req, res) => {
  //   try {
  //     const { email, password } = req.body
  //     const user = await getUserByEmail({ email })

      
  //   } catch (error) {
  //     res.send(500).json(error)
  //   }
  // }

}

async function register(req, res) {
  try {
    
    const {
      email,
      full_name,
      password
    } = req.body

    const result = await insertUser({
      email,
      full_name,
      password
    })

    res.status(201).json({
      id: result.id,
      email: result.email,
      full_name: result.full_name
    })

  } catch (error) {
    res.status(error?.code).json(error?.message)
  }
}
module.exports = {
  register
}