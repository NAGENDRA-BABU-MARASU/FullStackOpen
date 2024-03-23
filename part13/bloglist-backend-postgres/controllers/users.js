const router = require('express').Router()

const { User, Blog, ReadingList } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const where = {
    id,
    '$readings.readingLists.user_id$': id,
  }

  if (req.query.read === 'true') {
    where['$readings.readingLists.read$'] = true;
  } else if (req.query.read === 'false') {
    where['$readings.readingLists.read$'] = false;
  }

  const user = await User.findOne({
    attributes: ['name', 'username'],
    where,
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: {
          attributes: []
        },
        include: [
          {
            model: ReadingList,
            attributes: ['read', 'id']
          }
        ]
      }
    ]
  });

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
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