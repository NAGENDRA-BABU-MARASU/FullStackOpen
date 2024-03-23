const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./reading_list')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' });
Blog.belongsToMany(User, { through: ReadingList, as: 'readingUsers' });

// User.hasMany(ReadingList)
// ReadingList.belongsTo(User)

// Blog.hasMany(ReadingList)
// ReadingList.belongsTo(Blog)

// User.sync({ alter: true })
// Blog.sync({ alter: true })

module.exports = { Blog, User, ReadingList, Session }