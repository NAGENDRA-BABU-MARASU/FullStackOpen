const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

const Book = require('./models/Book');
const Author = require('./models/Author');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const resolvers = {
	Query: {
		me: (root, args, context) => {
			return context.currentUser;
		},
		bookCount: () => Book.collection.countDocuments(),
		authorCount: () => Author.collection.countDocuments(),
		allBooks: async (root, args) => {
			if (args.author && args.genre) {
				const author = await Author.findOne({
					name: args.author,
				});
				if (!author) {
					return [];
				}
				const authorBooks = await Book.find({
					author: author.id,
				}).populate('author');
				return authorBooks.filter((book) => book.genres.includes(args.genre));
			} else if (args.author) {
				const author = await Author.findOne({
					name: args.author,
				});
				if (!author) {
					return [];
				}
				return Book.find({
					author: author.id,
				}).populate('author');
			} else if (args.genre) {
				const booksWithGenre = await Book.find({
					genres: args.genre,
				}).populate('author');
				return booksWithGenre;
			}
			return Book.find({}).populate('author');
		},
		allAuthors: async () => {
			let authorsDetails = {};
			const books = await Book.find({});
			for (let book of books) {
				const author = await Author.findById(book.author);
				if (!authorsDetails[author.name]) {
					authorsDetails[author.name] = {
						name: author.name,
						born: author.born,
						id: author._id,
						bookCount: 1,
					};
				} else {
					authorsDetails[author.name].bookCount += 1;
				}
			}
			return Object.values(authorsDetails);
		},
	},
	Mutation: {
		addBook: async (root, args, context) => {
			const currentUser = context.currentUser;

			if (!currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: {
						code: 'BAD_USER_INPUT',
					},
				});
			}
			const newBook = new Book({ ...args });
			const author = await Author.findOne({
				name: args.author,
			});
			if (!author) {
				const newAuthor = new Author({
					name: args.author,
					born: null,
				});
				try {
					await newAuthor.save();
				} catch (error) {
					throw new GraphQLError('adding book failed', {
						extensions: {
							code: 'BAD_USER_INPUT',
							invalidArgs: args.name,
							error,
						},
					});
				}
				newBook.author = newAuthor._id;
			} else {
				newBook.author = author._id;
			}
			try {
				await newBook.save();
			} catch (error) {
				throw new GraphQLError('adding book failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.title,
						error,
					},
				});
			}
			const addedBook = await Book.findById(newBook._id).populate('author');
			pubsub.publish('BOOK_ADDED', { bookAdded: addedBook });
			return addedBook;
		},
		editAuthor: async (root, args, context) => {
			const currentUser = context.currentUser;

			if (!currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: {
						code: 'BAD_USER_INPUT',
					},
				});
			}
			const author = await Author.findOne({
				name: args.name,
			});
			if (author) {
				author.born = args.setBornTo;
				return author.save();
			} else {
				return null;
			}
		},
		createUser: async (root, args) => {
			const { username, password, favoriteGenre } = args;
			const saltRounds = 10;
			const passwordHash = await bcrypt.hash(password, saltRounds);
			const user = new User({
				username,
				passwordHash,
				favoriteGenre: favoriteGenre.trim().toLowerCase(),
			});

			return user.save().catch((error) => {
				throw new GraphQLError('creating user failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.username,
						error,
					},
				});
			});
		},
		login: async (root, args) => {
			const { username, password } = args;
			const user = await User.findOne({ username });
			const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);
			if (!user || !passwordCorrect) {
				throw new GraphQLError('login failed due to wrong credentials', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: [args.username, args.password],
					},
				});
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			};

			return {
				value: jwt.sign(userForToken, process.env.JWT_SECRET),
			};
		},
	},
	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
		},
	},
};

module.exports = resolvers;
