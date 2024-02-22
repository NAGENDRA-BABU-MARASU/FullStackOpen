import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries';

const Authors = ({ isAuthenticated }) => {
	const result = useQuery(ALL_AUTHORS);
	const [authorMutation] = useMutation(UPDATE_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
	});

	const [name, setName] = useState('');
	const [birthYear, setBirthYear] = useState('');

	if (result.loading) {
		return <div>Loading 🐌🐌</div>;
	}

	const authors = result.data.allAuthors;

	const updateAuthor = () => {
		authorMutation({
			variables: {
				name: name,
				setBornTo: parseInt(birthYear),
			},
		});
		setName('');
		setBirthYear('');
	};

	return (
		<div>
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>born</th>
						<th>books</th>
					</tr>
					{authors.map((a) => (
						<tr key={a.name}>
							<td>{a.name}</td>
							<td>{a.born}</td>
							<td>{a.bookCount}</td>
						</tr>
					))}
				</tbody>
			</table>
			{isAuthenticated && (
				<div>
					<h1>Set birthyear</h1>
					<label htmlFor="authors">Choose an author to update thier born year:</label>
					<select name="authors" id="authors" onChange={(event) => setName(event.target.value)}>
						{authors.map((a) => (
							<option key={a.id} value={a.name}>
								{a.name}
							</option>
						))}
					</select>
					born:{' '}
					<input
						type="number"
						name="birthyear"
						value={birthYear}
						onChange={(event) => {
							setBirthYear(event.target.value);
						}}
					/>
					<button type="button" onClick={updateAuthor}>
						update author
					</button>
				</div>
			)}
		</div>
	);
};

export default Authors;
