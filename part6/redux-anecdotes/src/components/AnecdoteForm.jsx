import React from 'react';
import { useDispatch } from 'react-redux';
import { createAnecdote } from '../reducers/anecdoteReducer';
import { setNotificationFor } from '../reducers/notificationReduer';

function AnecdoteForm() {
	const dispatch = useDispatch();

	const addAnecdote = async (event) => {
		event.preventDefault();
		const anecdoteContent = event.target.anecdote.value;
		dispatch(createAnecdote(anecdoteContent));
		dispatch(
			setNotificationFor(
				`you added a new anecdote : ${anecdoteContent}`,
				5
			)
		);
		event.target.anecdote.value = '';
	};

	return (
		<div>
			<h2>create new</h2>
			<form onSubmit={addAnecdote}>
				<div>
					<input name="anecdote" />
				</div>
				<button type="submit">create</button>
			</form>
		</div>
	);
}

export default AnecdoteForm;
