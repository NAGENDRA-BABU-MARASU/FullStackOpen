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

	type Subscription { 
		personAdded: Person!
	}

`;

module.exports = typeDefs;
