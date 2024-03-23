const { verifyToken } = require("../utils/jwt")


async function authentication(req, res, next) {
  try {
    const token = req.cookies.token;
  
    if (token == null) {
        throw {
          code: 401,
          message: "Unauthorized"
        }
    }
  
    const user = verifyToken(token)
    
    if (!user) {
      throw {
        code: 401,
        message: "Unauthorized"
      }
    }

    req.user = user;

    next()
  } catch (error) {
    res.status(error?.code || 500).json(error.message)
  }
  
}

module.exports = {
  authentication
}