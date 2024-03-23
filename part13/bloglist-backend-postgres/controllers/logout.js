const router = require('express').Router()
const { Session, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if (!user) {
      return res.status(401).json({ error: "No user found!" })
    }
    const id = user.id
    await Session.destroy({ where: { userId: id } })
    return res.status(200).json({ message: "Logged out successfully." })
  } catch (error) {
    return res.status(400).json({ error: error })
  }
})

module.exports = router; 