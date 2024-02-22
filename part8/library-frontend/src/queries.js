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
			title
			genres
			published
			id
			author {
				name
				born
				id
			}
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
			title
			genres
			published
			id
			author {
				name
				born
				id
			}
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

export const LOGIN = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			value
		}
	}
`;

export const BOOKS_WITH_GENRE = gql`
	query ( $genre: String) {
		allBooks(genre: $genre) {
			title
			genres
			id
			published
			author {
				name
				born
			}
		}
	}
`;

export const ME = gql`
	query { 
		me { 
			favoriteGenre
		}
	}
`;
