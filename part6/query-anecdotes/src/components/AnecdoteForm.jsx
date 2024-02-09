import React, { useContext } from 'react';
import {
	useQuery,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query';

import { createNewAnecdote } from '../requests';
import NotificationContext from '../NotificationContext';

const AnecdoteForm = () => {
	const queryClient = useQueryClient();
	const [notification, notificationDispatch] = useContext(
		NotificationContext
	);

	const newAnecdoteMutation = useMutation({
		mutationFn: createNewAnecdote,
		onSuccess: (newAnecdote) => {
			const anecdotes = queryClient.getQueryData([
				'anecdotes',
			]);
			queryClient.setQueryData(
				['anecdotes'],
				anecdotes.concat(newAnecdote)
			);
		},
		onError: () => {
			console.log('onError');

			notificationDispatch({
				type: 'SET_NOTIFICATION',
				payload: `too short anecdote, must have length 5 or more`,
			});

			setTimeout(() => {
				notificationDispatch({
					type: 'CLEAR_NOTIFICATION',
					payload: '',
				});
			}, 5000);
		},
	});

	const onCreate = (event) => {
		event.preventDefault();
		const content = event.target.anecdote.value;
		event.target.anecdote.value = '';
		newAnecdoteMutation.mutate({ content, votes: 0 });
	};

	return (
		<div>
			<h3>create new</h3>
			<form onSubmit={onCreate}>
				<input name="anecdote" />
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default AnecdoteForm;
