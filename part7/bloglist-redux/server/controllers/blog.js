const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken');
const middleware = require('../utils/middleware');

blogRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('comments', { content: 1});
	response.json(blogs);
});

blogRouter.post(
	'/',
	middleware.userExtractor,
	async (request, response) => {
		const body = request.body;
		const decodedToken = jwt.verify(
			request.token,
			process.env.SECRET
		);
		if (!decodedToken.id) {
			return response
				.status(401)
				.json({ error: 'token invalid' });
		}
		const user = request.user;

		if (!body.title || !body.url) {
			return response.status(400).json({
				error: 'missing blog title or blog url',
			});
		}

		const newBlog = {
			title: request.body.title,
			author: request.body.author,
			url: request.body.url,
			likes: request.body.likes || 0,
			user: user.id,
		};
		const blog = new Blog(newBlog);
		const savedBlog = await blog.save();
		user.blogs = user.blogs.concat(savedBlog._id);
		await user.save();
		response.status(201).json(savedBlog);
	}
);

// comment
blogRouter.post('/:id/comments', async (request, response) => {
	console.log('id', request.params.id);
	const blogId = request.params.id 
	const { comment } = request.body 
	console.log('comment:', comment)
	const newComment = new Comment({
		content: comment, 
		blog: blogId 
	})
	const savedComment = await newComment.save();
	const blog = await Blog.findById(blogId)
	blog.comments = blog.comments.concat(savedComment._id);
	await blog.save();
	const commentedBlog = await Blog.findById(
		blogId
	).populate('comments', { content: 1 });
	response.status(201).json(commentedBlog);
});

blogRouter.put('/:id', async (request, response) => {
	const updatedBlog = await Blog.findByIdAndUpdate(
		request.params.id,
		request.body,
		{ new: true }
	).populate('comments', { content: 1 });
	response.json(updatedBlog);
});

blogRouter.delete(
	'/:id',
	middleware.userExtractor,
	async (request, response) => {
		const decodedToken = jwt.verify(
			request.token,
			process.env.SECRET
		);
		if (!decodedToken.id) {
			return response
				.status(401)
				.json({ error: 'invalid token' });
		}
		const blog = await Blog.findById(request.params.id);
		if (blog.user.toString() != decodedToken.id) {
			return response.status(401).json({
				error:
					'you can`t delete this blog as you are not owner of the blog',
			});
		}
		const user = request.user;
		user.blogs = user.blogs.filter(
			(blog) => blog.id !== request.params.id
		);
		await user.save();
		await Blog.findByIdAndDelete(request.params.id);
		response.status(204).end();
	}
);

module.exports = blogRouter;
