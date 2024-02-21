const { ApolloServer } = require('@apollo/server');
const { v1: uuid } = require('uuid');
const { GraphQLError } = require('graphql');
const { mongoose } = require('mongoose');
mongoose.set('strictQuery', false);
const Person = require('./models/Person');
const User = require('./models/User');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to ', MONGODB_URI);

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log(
			'error connecting to mongodb',
			error.message
		);
	});

const {
	startStandaloneServer,
} = require('@apollo/server/standalone');

// let persons = [
// 	{
// 		name: 'Arto Hellas',
// 		phone: '040-123543',
// 		street: 'Tapiolankatu 5 A',
// 		city: 'Espoo',
// 		id: '3d594650-3436-11e9-bc57-8b80ba54c431',
// 	},
// 	{
// 		name: 'Matti Luukkainen',
// 		phone: '040-432342',
// 		street: 'Malminkaari 10 A',
// 		city: 'Helsinki',
// 		id: '3d599470-3436-11e9-bc57-8b80ba54c431',
// 	},
// 	{
// 		name: 'Venla Ruuska',
// 		street: 'Nallemäentie 22 C',
// 		city: 'Helsinki',
// 		id: '3d599471-3436-11e9-bc57-8b80ba54c431',
// 	},
// ];

const typeDefs = `
	type Address {
		street: String!
		city: String! 
	}

	enum YesNo { 
		YES
		NO
	}

	type Person {
		name: String!
		phone: String
		address: Address!
		id: ID!
	}

	type User { 
		username: String!
		friends: [Person!]!
		id: ID!
	}

	type Token { 
		value: String!
	}

	type Mutation { 
		addPerson(
			name: String!
			phone: String
			street: String!
			city: String!
		): Person
		editNumber(
			name: String!
			phone: String!
		): Person 
		createUser(
			username: String!
		): User
		login(
			username: String!
			password: String!
		): Token
		addAsFriend(
			name: String!
		): User
	}
  
  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
		me: User
  }

`;

const resolvers = {
	Query: {
		me: async (root, args, context) => {
			return context.currentUser;
		},
		personCount: async () =>
			Person.Collection.countDocuments(),
		allPersons: async (root, args) => {
			if (!args.phone) {
				return Person.find({});
			}
			return Person.find({
				phone: { $exists: args.phone === 'YES' },
			});
		},
		findPerson: (root, args) =>
			Person.findOne({ name: args.name }),
	},
	Mutation: {
		createUser: async (root, args) => {
			const user = new User({ username: args.username });
			return user.save().catch((error) => {
				throw new GraphQLError('Creating the user failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.username,
						error,
					},
				});
			});
		},
		login: async (root, args) => {
			const user = await User.findOne({
				username: args.username,
			});

			if (!user || args.password !== 'secret') {
				throw new GraphQLError('wrong credentials', {
					extensions: {
						code: 'BAD_USER_INPUT',
					},
				});
			}

			console.log('process:', process);

			const userForToken = {
				username: user.username,
				id: user._id,
			};
			return {
				value: jwt.sign(
					userForToken,
					process.env.JWT_SECRET
				),
			};
		},

		addPerson: async (root, args, context) => {
			const person = new Person({ ...args });
			const currentUser = context.currentUser;

			if (!currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: {
						code: 'BAD_USER_INPUT',
					},
				});
			}
			try {
				await person.save();
				currentUser.friends =
					currentUser.friends.concat(person);
				await currentUser.save();
			} catch (error) {
				throw new GraphQLError('Saving person failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.name,
						error,
					},
				});
			}
			return person.save();
		},
		editNumber: async (root, args) => {
			const person = await Person.findOne({
				name: args.name,
			});
			person.phone = args.phone;
			try {
				await person.save();
			} catch (error) {
				throw new GraphQLError('Saving number failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.name,
						error,
					},
				});
			}
		},
		addAsFriend: async (root, args, context) => {
			const isFriend = (person) =>
				context.currentUser.friends
					.map((f) => f._id.toString())
					.includes(person._id.toString());
			if (!context.currentUser) {
				throw new GraphQLError('wrong credentials', {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			}

			const person = await Person.findOne({
				name: args.name,
			});
			if (!isFriend(person)) {
				context.currentUser.friends =
					context.currentUser.friends.concat(person);
			}
			await context.currentUser.save()

			return context.currentUser 

		},
	},
	Person: {
		address: (root) => {
			return { street: root.street, city: root.city };
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

startStandaloneServer(server, {
	listen: { port: 4000 },
	context: async ({ req, res }) => {
		const auth = req ? req.headers.authorization : null;
		if (auth && auth.startsWith('Bearer ')) {
			const decodedToken = jwt.verify(
				auth.substring(7),
				process.env.JWT_SECRET
			);
			const currentUser = await User.findById(
				decodedToken.id
			).populate('friends');
			return { currentUser };
		}
	},
}).then(({ url }) => {
	console.log(`server ready at ${url}`);
});
