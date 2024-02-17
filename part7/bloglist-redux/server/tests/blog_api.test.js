const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('./tests_helper');
const User = require('../models/user');
const bcrypt = require('bcrypt');

beforeEach(async () => {
	await Blog.deleteMany({});
	for (let blog of helper.initialBlogs) {
		let blogObject = new Blog(blog);
		await blogObject.save();
	}
}, 100000);

test('blogs are returned in json format', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/);
}, 100000);

test('correct number of blogs are returned', async () => {
	const response = await api.get('/api/blogs');
	expect(response.body).toHaveLength(
		helper.initialBlogs.length
	);
}, 100000);

test('the unique identifier property of the blog posts is named id', async () => {
	const blogs = await helper.blogsInDb();
	expect(blogs[0].id).toBeDefined();
}, 100000);

test('a blog can be added correctly', async () => {
	const newBlog = {
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 12,
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const blogsAtEnd = await helper.blogsInDb();
	expect(blogsAtEnd).toHaveLength(
		helper.initialBlogs.length + 1
	);
	const titles = blogsAtEnd.map((blog) => blog.title);
	expect(titles).toContain('Canonical string reduction');
}, 100000);

test('if likes property is not in request, default the property to 0', async () => {
	const newBlog = {
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const blogsAtEnd = await helper.blogsInDb();
	expect(blogsAtEnd).toHaveLength(
		helper.initialBlogs.length + 1
	);
	expect(blogsAtEnd[blogsAtEnd.length - 1]['likes']).toBe(
		0
	);
}, 100000);

test('if title or url properties missing, the blog cannot be added', async () => {
	const newBlog = {
		author: 'Edsger W. Dijkstra',
	};

	await api.post('/api/blogs').send(newBlog).expect(400);
});

test('a blog can be deleted with response of 204 if id is valid', async () => {
	const blogsAtStart = await helper.blogsInDb();
	const blogToDelete = blogsAtStart[0];

	await api
		.delete(`/api/blogs/${blogToDelete.id}`)
		.expect(204);

	const blogsAtEnd = await helper.blogsInDb();
	expect(blogsAtEnd).toHaveLength(
		helper.initialBlogs.length - 1
	);
});

test('a blog can be updated correctly', async () => {
	const blogsAtStart = await helper.blogsInDb();
	const updateBlog = { ...blogsAtStart[0] };
	updateBlog.likes += 1;
	await api
		.put(`/api/blogs/${updateBlog.id}`)
		.send(updateBlog)
		.expect(200);
	const blogsAtEnd = await helper.blogsInDb();
	const updatedBlog = blogsAtEnd[0];
	expect(updatedBlog.likes).toBe(blogsAtStart[0].likes + 1);
});

describe('when there is initially one user in db', () => {
	beforeEach(async () => {
		await User.deleteMany({});
		const passwordHash = await bcrypt.hash('sekret', 10);
		const user = new User({
			username: 'root',
			passwordHash,
		});
		await user.save();
	}, 10000);

	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb();
		const newUser = {
			username: 'nagendra',
			name: 'Nagendra Babu Marasu',
			password: '12345678',
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(
			usersAtStart.length + 1
		);
		const usernames = usersAtEnd.map(
			(user) => user.username
		);
		expect(usernames).toContain(newUser.username);
	});

	test('creation fails with invalid username or invalid password', async() => {
		const usersAtStart = await helper.usersInDb();
		const newUser = {
			username: 'lol',
			name: 'Nagendra Babu Marasu',
			password: 'lol',
		};

		const response = await api
			.post('/api/users')
			.send(newUser)
			.expect(401)
			.expect('Content-Type', /application\/json/);
		
		expect(response.body.error).toBe('invalid username or password')
	})
});

afterAll(async () => {
	await mongoose.connection.close();
});
