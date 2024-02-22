const { GraphQLError } = require('graphql');
const Person = require('./models/Person');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const resolvers = {
	Query: {
		me: async (root, args, context) => {
			return context.currentUser;
		},
		personCount: async () => Person.Collection.countDocuments(),
		allPersons: async (root, args) => {
			if (!args.phone) {
				return Person.find({});
			}
			return Person.find({
				phone: { $exists: args.phone === 'YES' },
			});
		},
		findPerson: (root, args) => Person.findOne({ name: args.name }),
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

			const userForToken = {
				username: user.username,
				id: user._id,
			};
			return {
				value: jwt.sign(userForToken, process.env.JWT_SECRET),
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
				currentUser.friends = currentUser.friends.concat(person);
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
			pubsub.publish('PERSON_ADDED', { personAdded: person });
			return person;
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
				context.currentUser.friends.map((f) => f._id.toString()).includes(person._id.toString());
			if (!context.currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			}

			const person = await Person.findOne({
				name: args.name,
			});
			if (!isFriend(person)) {
				context.currentUser.friends = context.currentUser.friends.concat(person);
			}
			await context.currentUser.save();

			return context.currentUser;
		},
	},
	Subscription: {
		personAdded: {
			subscribe: () => pubsub.asyncIterator('PERSON_ADDED'),
		},
	},
	Person: {
		address: (root) => {
			return { street: root.street, city: root.city };
		},
	},
};

module.exports = resolvers;
