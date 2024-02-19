const { ApolloServer } = require('@apollo/server');
const { v1: uuid } = require('uuid');

const {
	startStandaloneServer,
} = require('@apollo/server/standalone');

let authors = [
	{
		name: 'Robert Martin',
		id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
		born: 1952,
	},
	{
		name: 'Martin Fowler',
		id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
		born: 1963,
	},
	{
		name: 'Fyodor Dostoevsky',
		id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
		born: 1821,
	},
	{
		name: 'Joshua Kerievsky', // birthyear not known
		id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
	},
	{
		name: 'Sandi Metz', // birthyear not known
		id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
	},
];

let books = [
	{
		title: 'Clean Code',
		published: 2008,
		author: 'Robert Martin',
		id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring'],
	},
	{
		title: 'Agile software development',
		published: 2002,
		author: 'Robert Martin',
		id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
		genres: ['agile', 'patterns', 'design'],
	},
	{
		title: 'Refactoring, edition 2',
		published: 2018,
		author: 'Martin Fowler',
		id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring'],
	},
	{
		title: 'Refactoring to patterns',
		published: 2008,
		author: 'Joshua Kerievsky',
		id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring', 'patterns'],
	},
	{
		title:
			'Practical Object-Oriented Design, An Agile Primer Using Ruby',
		published: 2012,
		author: 'Sandi Metz',
		id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
		genres: ['refactoring', 'design'],
	},
	{
		title: 'Crime and punishment',
		published: 1866,
		author: 'Fyodor Dostoevsky',
		id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
		genres: ['classic', 'crime'],
	},
	{
		title: 'The Demon ',
		published: 1872,
		author: 'Fyodor Dostoevsky',
		id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
		genres: ['classic', 'revolution'],
	},
];

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `

  type Author { 
    name: String!
    bookCount: Int!
    id: ID!
    born: Int
  }

  type Book { 
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(
      author: String
      genre: String
    ): [Book]!
    allAuthors: [Author]!
  }

  type Mutation { 
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]!
    ): Book!
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`;

const resolvers = {
	Query: {
		bookCount: () => books.length,
		authorCount: () => authors.length,
		allBooks: (root, args) => {
			if (args.author && args.genre) {
				const booksOfAuthor = books.filter(
					(book) => book.author === args.author
				);
				return booksOfAuthor.filter((book) =>
					book.genres.includes(args.genre)
				);
			} else if (args.author) {
				const booksOfAuthor = books.filter(
					(book) => book.author === args.author
				);
				return booksOfAuthor;
			} else if (args.genre) {
				const booksWithGenre = books.filter((book) =>
					book.genres.includes(args.genre)
				);
				return booksWithGenre;
			}
			return books;
		},
		allAuthors: () => {
			let authorsDetails = {};
			for (let book of books) {
				if (!authorsDetails[book.author]) {
					const author = authors.find(
						(author) => book.author === author.name
					);
					authorsDetails[book.author] = {
						...author,
						bookCount: 1,
					};
				} else {
					authorsDetails[book.author].bookCount += 1;
				}
			}
			return Object.values(authorsDetails);
		},
	},
	Mutation: {
		addBook: (root, args) => {
			const newBook = { ...args, id: uuid() };
			books = books.concat(newBook);
			if (
				!authors.find(
					(author) => author.name === newBook.author
				)
			) {
				const newAuthor = {
					name: newBook.author,
					id: uuid(),
					born: null,
				};
				authors = authors.concat(newAuthor);
			}
			return newBook;
		},
		editAuthor: (root, args) => {
			const author = authors.find(
				(author) => author.name === args.name
			);
			if (author) {
				const updatedAuthor = {
					...author,
					born: args.setBornTo,
				};
				authors = authors.map((author) =>
					author.id === updatedAuthor.id
						? updatedAuthor
						: author
				);
				return updatedAuthor;
			} else {
				return null;
			}
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

startStandaloneServer(server, {
	listen: { port: 4000 },
}).then(({ url }) => {
	console.log(`Server ready at ${url}`);
});
