const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId']}
    }
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.put('/:username', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username
      }
    })
    user.username = req.body.username
    await user.save()
    return res.json(user)
  } catch {
    return res.status(400).json({ error: `user not found with username: ${req.body.username}` })
  }
})


module.exports = router