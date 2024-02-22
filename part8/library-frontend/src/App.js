import React, { useState, useEffect } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import { useApolloClient, useSubscription } from '@apollo/client';
import RecommendedBooks from './components/RecommendedBooks';
import { ALL_BOOKS, BOOK_ADDED } from './queries';

const App = () => {
	const linkStyle = { padding: '0 20px 0 0 ' };

	const [token, setToken] = useState(null);

	useSubscription(BOOK_ADDED, {
		onData: ({ data, client }) => {
			const addedBook = data.data.bookAdded; 
			client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
				return {
					allBooks: allBooks.concat(addedBook),
				};
			});
			window.alert(`New book : ${addedBook.title} has been added by someone. 📖`);
		},
	});

	useEffect(() => {
		const token = localStorage.getItem('LIBRARY-USER-TOKEN');
		setToken(token);
	}, []);

	const client = useApolloClient();

	const logout = () => {
		setToken(null);
		localStorage.clear();
		client.resetStore();
	};

	return (
		<div>
			<div>
				<Link style={linkStyle} to="/authors">
					authors
				</Link>
				<Link style={linkStyle} to="/books">
					books
				</Link>
				{token ? (
					<>
						<Link style={linkStyle} to="/add">
							add book
						</Link>
						<Link style={linkStyle} to="/recommended">
							recommended
						</Link>
						<button onClick={logout}>logout</button>
					</>
				) : (
					<Link style={linkStyle} to="/login">
						login
					</Link>
				)}
			</div>

			<Routes>
				<Route path="/authors" element={<Authors isAuthenticated={token ? true : false} />} />
				<Route path="/books" element={<Books />} />
				<Route path="/add" element={<NewBook />} />
				<Route path="/recommended" element={<RecommendedBooks />} />
				<Route path="/login" element={<LoginForm setToken={setToken} />} />
				<Route path="/" element={<Navigate replace to="/authors" />} />
			</Routes>
		</div>
	);
};

export default App;
