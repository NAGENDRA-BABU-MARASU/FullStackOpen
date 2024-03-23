const router = require('express').Router()
const { Blog, User, ReadingList } = require('../models/index');
const { tokenExtractor } = require('../util/middleware');


router.post('/', async (req, res) => {
  const { blogId, userId } = req.body;
  const blog = await Blog.findByPk(blogId)
  const user = await User.findByPk(userId)
  if (!blog) {
    return res.status(400).json({ error: `blog not found with id ${blogId}` })
  }
  if (!user) {
    return res.status(400).json({ error: `user not found with id ${userId}` })
  }
  const reading_list = await ReadingList.create({ blogId, userId })
  res.json(reading_list)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const id = req.params.id
  const readingList = await ReadingList.findByPk(id)
  const user = await User.findByPk(req.decodedToken.id)
  if (!readingList) {
    return res.status(400).json({ error: `reading list not found with id : ${id}` })
  }

  if (readingList.userId !== user.id) {
    return res.status(400).json({ error: "Error: This is not your reading list!" })
  }

  if (!req.body.read) {
    return res.status(400).json({ error: "Missing read value" })
  }
  const updatedReadingList = await readingList.update({
    read: req.body.read
  })
  res.json(updatedReadingList)
})

module.exports = router;