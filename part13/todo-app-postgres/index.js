const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json())

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()













// require('dotenv').config()
// const { Sequelize, Model, DataTypes } = require('sequelize');
// const express = require('express')
// const app = express();

// const sequelize = new Sequelize(process.env.DATABASE_URL);

// class Note extends Model { }
// Note.init({
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   content: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   },
//   important: {
//     type: DataTypes.BOOLEAN
//   },
//   date: {
//     type: DataTypes.DATE
//   }
// }, { sequelize, underscored: true, timestamps: false, modelName: 'note' });
// Note.sync();


// app.get('/api/notes', async (req, res) => {
//   const notes = await Note.findAll();
//   res.json(notes);
// })

// app.get('/api/notes/:id', async (req, res) => {
//   const note = await Note.findByPk(req.params.id);
//   if (note) {
//     res.json(note);
//   } else {
//     res.status(404).end();
//   }
// })

// app.post('/api/notes', async (req, res) => {
//   try {
//     const note = await Note.create(req.body)
//     return res.json(note)
//   } catch (error) {
//     return res.status(400).json({ error })
//   }
// })

// app.put('/api/notes/:id', async (req, res) => {
//   const note = await Note.findByPk(req.params.id)
//   if (note) {
//     note.important = req.body.important
//     await note.save();
//     res.json(note);
//   } else {
//     res.status(404).end()
//   }
// })


// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log('Server running on port ', PORT)
// })