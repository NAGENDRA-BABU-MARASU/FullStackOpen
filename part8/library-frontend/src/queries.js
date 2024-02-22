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

const BOOK_DETAILS = gql`
	fragment bookDetails on Book {
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
`;

export const ALL_BOOKS = gql`
	query AllBooks {
		allBooks {
			...bookDetails
		}
	}
	${BOOK_DETAILS}
`;

export const ADD_BOOK = gql`
	mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String]!) {
		addBook(title: $title, author: $author, published: $published, genres: $genres) {
			...bookDetails
		}
	}
	${BOOK_DETAILS}
`;

export const UPDATE_AUTHOR = gql`
	mutation updateBornYear($name: String!, $setBornTo: Int!) {
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
	query ($genre: String) {
		allBooks(genre: $genre) {
			...bookDetails
		}
	}
	${BOOK_DETAILS}
`;

export const BOOK_ADDED = gql`
	subscription {
		bookAdded {
			...bookDetails
		}
	}
	${BOOK_DETAILS}
`;

export const ME = gql`
	query {
		me {
			favoriteGenre
		}
	}
`;
