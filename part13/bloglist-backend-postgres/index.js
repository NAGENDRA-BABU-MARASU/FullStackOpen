require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize');
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL)

class Blog extends Model { }
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, { sequelize, underscored: true, timestamps: false, modelName: 'blog' })
Blog.sync();

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
})

app.get('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end()
  }
})

app.post('/api/blogs', async(req, res) => { 
  try { 
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch (error) { 
    return res.status(400).json({ error })
  }
})

app.put('/api/blogs/:id', async(req, res) => { 
  const blog = await Blog.findByPk(req.params.id)
  if(blog) { 
    blog.likes = req.body.likes;
    await blog.save();
    res.json(blog)
  } else { 
    res.status(404).end()
  }
})

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => { 
  console.log(`Server is running on port: ${PORT}`)
} )