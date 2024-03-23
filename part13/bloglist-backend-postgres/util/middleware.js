const { SECRET } = require("./config")
const jwt = require('jsonwebtoken')
const { Session, User } = require('../models')

const validateSession = async ({ id, token }) => {
  const session = await Session.findOne({
    where: {
      userId: id
    }
  })

  if (!session || !(session.token == token)) {
    return false;
  }

  return true;
}

const tokenExtractor = async(req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.replace('bearer', '')
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      const user = await User.findByPk(req.decodedToken.id)
      const id = user.id
      const validSession = await validateSession({ id, token })
      if (!req.decodedToken.id || !validSession) {
        return res.status(400).json({ error: 'Invalid Session!' })
      }
      if (user.disabled) {
        return res.status(400).json({ error: 'User disabled!' })
      }
    } catch {
      return res.status(401).json({ error: 'invalid token' })
    }
  } else {
    return res.status(401).json({ error: 'token missing!!' })
  }
  next()
}

module.exports = { tokenExtractor }