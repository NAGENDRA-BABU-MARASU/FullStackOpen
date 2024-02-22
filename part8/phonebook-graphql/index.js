const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const { useServer } = require('graphql-ws/lib/use/ws');
const express = require('express');
const cors = require('cors');
const http = require('http');

const { mongoose } = require('mongoose');
mongoose.set('strictQuery', false);

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to ', MONGODB_URI);

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connecting to mongodb', error.message);
	});

const start = async () => {
	const app = express();
	const httpServer = http.createServer(app);

	const wsServer = new WebSocketServer({ server: httpServer, path: '/' });

	const schema = makeExecutableSchema({ typeDefs, resolvers });
	const serverCleanup = useServer({ schema }, wsServer);

	const server = new ApolloServer({
		schema,
		plugin: [
			ApolloServerPluginDrainHttpServer({ httpServer }),
			{
				async serverWillStart() {
					return {
						async drainServer() {
							await serverCleanup.dispose();
						},
					};
				},
			},
		],
	});

	await server.start();

	app.use(
		'/',
		cors(),
		express.json(),
		expressMiddleware(server, {
			context: async ({ req }) => {
				const auth = req ? req.headers.authorization : null;
				if (auth && auth.startsWith('Bearer ')) {
					const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET);
					const currentUser = await User.findById(decodedToken.id).populate('friends');
					return { currentUser };
				}
			},
		})
	);

	const PORT = 4000;

	httpServer.listen(PORT, () => {
		console.log(`Server is now running on http://localhost:${PORT}`);
	});
};

start();

// const {
// 	startStandaloneServer,
// } = require('@apollo/server/standalone');

// const server = new ApolloServer({
// 	typeDefs,
// 	resolvers,
// });

// startStandaloneServer(server, {
// 	listen: { port: 4000 },
// 	context: async ({ req, res }) => {
// 		const auth = req ? req.headers.authorization : null;
// 		if (auth && auth.startsWith('Bearer ')) {
// 			const decodedToken = jwt.verify(
// 				auth.substring(7),
// 				process.env.JWT_SECRET
// 			);
// 			const currentUser = await User.findById(
// 				decodedToken.id
// 			).populate('friends');
// 			return { currentUser };
// 		}
// 	},
// }).then(({ url }) => {
// 	console.log(`server ready at ${url}`);
// });
