const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { Blog, User } = require('../models');
const { SECRET } = require('../util/config');

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [{ title: { [Op.iLike]: `%${req.query.search}%` } }, { author: { [Op.iLike]: `%${req.query.search}%` } }]
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  });
  res.json(blogs);
})

router.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end()
  }
})

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'invalid token' })
    }
  } else {
    return res.status(401).json({ error: 'token missing!!' })
  }
  next()
}

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id });
    return res.json(blog);
  } catch (error) {
    next(error);
  }
})

router.delete('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: `blog not found` })
    }
    if (blog.userId !== user.id) {
      return res.status(401).json({ error: "You can't delete this blog as you are not the owner of this blog!" })
    }
    await blog.destroy()
    res.status(204).end();
  } catch (error) {
    next(error)
  }
})


router.put('/:id', async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)
  try {
    blog.likes = req.body.likes;
    await blog.save();
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

module.exports = router;