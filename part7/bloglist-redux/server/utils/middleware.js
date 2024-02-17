const User = require('../models/user');
const jwt = require('jsonwebtoken');

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
	console.log(error.message);

	if (error.name === 'CastError') {
		return response
			.status(400)
			.send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return response
			.status(400)
			.json({ error: error.message });
	} else if (error.name === 'JsonWebTokenError') {
		return response
			.status(401)
			.json({ error: error.message });
	} else if (error.name === 'TokenExpirationError') {
		return response.status(401).json({
			error: 'token expired',
		});
	}

	next(error);
};

const tokenExtractor = (request, response, next) => {
	const authroization = request.get('authorization');
	if (
		authroization &&
		authroization.startsWith('Bearer ')
	) {
		request.token = authroization.replace('Bearer ', '');
	} else {
		request.tokne = null;
	}
	next();
};

const userExtractor = async (request, reponse, next) => {
	const decodedToken = jwt.verify(
		request.token,
		process.env.SECRET
	);
	if (!decodedToken.id) {
		return response
			.status(401)
			.json({ error: 'invalid token' });
	}
	const user = await User.findById(decodedToken.id);
	if (user) {
		request.user = user;
	} else {
		request.user = null;
	}
	next();
};

module.exports = {
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
	userExtractor,
};
