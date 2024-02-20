import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
	query {
		allAuthors {
			name
			id
			born
			bookCount
		}
	}
`;

export const ALL_BOOKS = gql`
	query AllBooks {
		allBooks {
			author
			id
			published
			title
		}
	}
`;

export const ADD_BOOK = gql`
	mutation createBook(
		$title: String!
		$author: String!
		$published: Int!
		$genres: [String]!
	) {
		addBook(
			title: $title
			author: $author
			published: $published
			genres: $genres
		) {
			author
			genres
			id
			published
			title
		}
	}
`;

export const UPDATE_AUTHOR = gql`
	mutation updateBornYear(
		$name: String!
		$setBornTo: Int!
	) {
		editAuthor(name: $name, setBornTo: $setBornTo) {
			born
			id
			name
		}
	}
`;