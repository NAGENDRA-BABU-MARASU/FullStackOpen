const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
	const { username, password, name } = request.body;
	if (username.length <= 3 || username.password <= 3) {
		return response.status(401).json({
			error: 'invalid username or password',
		});
	}

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(
		password,
		saltRounds
	);
	const user = new User({
		username,
		name,
		passwordHash,
	});

	const savedUser = await user.save();
	response.status(201).json(savedUser);
});

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('blogs', {url:1, title:1, author:1, id: 1});
	response.json(users);
});

module.exports = usersRouter;
