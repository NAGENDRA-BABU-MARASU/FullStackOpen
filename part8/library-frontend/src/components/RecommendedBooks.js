import React, { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { BOOKS_WITH_GENRE, ME } from '../queries';

const RecommendedBooks = () => {
	const result = useQuery(ME);
	const recommendedBooks = useQuery(BOOKS_WITH_GENRE, {
		skip: !result.data,
		variables: { genre: result?.data?.me.favoriteGenre },
	});

	if (result.loading) {
		return <div>loading 🐌🐌</div>;
	}

	if (recommendedBooks.loading) {
		return (
			<div> loading your favorite genre books 🐌🐌</div>
		);
	}

	return (
		<table>
			<tbody>
				<tr>
					<th></th>
					<th>author</th>
					<th>published</th>
				</tr>
				{recommendedBooks.data.allBooks.map((b) => (
					<tr key={b.id}>
						<td>{b.title}</td>
						<td>{b.author.name}</td>
						<td>{b.published}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default RecommendedBooks;
