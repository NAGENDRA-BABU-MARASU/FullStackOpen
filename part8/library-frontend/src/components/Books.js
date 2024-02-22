import React, { useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { ALL_BOOKS, BOOKS_WITH_GENRE, BOOK_ADDED } from '../queries';

const Books = (props) => {
	const result = useQuery(ALL_BOOKS);
	const [genre, setGenre] = useState('all genres');
	const selectedGenreBooks = useQuery(BOOKS_WITH_GENRE, {
		variables: { genre },
	});

	if (result.loading) {
		return <div>loading 🐌🐌</div>;
	}

	if (selectedGenreBooks.loading) {
		return <div>loading 🐌🐌 books of genre : {genre} </div>;
	}

	const books = result.data.allBooks;
	const genres = [];
	for (let book of books) {
		for (let genre of book.genres) {
			if (!genres.includes(genre)) {
				genres.push(genre);
			}
		}
	}
	genres.push('all genres');
	return (
		<div>
			<h2>books</h2>
			<p>
				in genre: <b>{genre}</b>
			</p>

			<table>
				<tbody>
					<tr>
						<th>Book</th>
						<th>author</th>
						<th>published</th>
					</tr>
					{genre === 'all genres'
						? books.map((b) => (
								<tr key={b.id}>
									<td>{b.title}</td>
									<td>{b.author.name}</td>
									<td>{b.published}</td>
								</tr>
						  ))
						: selectedGenreBooks.data.allBooks.map((b) => (
								<tr key={b.id}>
									<td>{b.title}</td>
									<td>{b.author.name}</td>
									<td>{b.published}</td>
								</tr>
						  ))}
				</tbody>
			</table>
			{genres.map((genre) => (
				<button key={genre} onClick={() => setGenre(genre)} style={{ margin: '10px 10px 0 0' }}>
					{genre.toLowerCase()}
				</button>
			))}
		</div>
	);
};

export default Books;
