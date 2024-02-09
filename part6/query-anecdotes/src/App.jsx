import React, { useContext } from 'react';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import NotificationContext, {
	NotificationContextProvider,
} from './NotificationContext';
import {
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import {
	getAllAnecdotes,
	updateAnecdote,
} from './requests';

const App = () => {
	const queryClient = useQueryClient();

	const [notification, notificationDispatch] = useContext(
		NotificationContext
	);
	const result = useQuery({
		queryKey: ['anecdotes'],
		queryFn: getAllAnecdotes,
		retry: 1,
	});

	const updateAnecdoteMutation = useMutation({
		mutationFn: updateAnecdote,
		onSuccess: (updatedAnecdote) => {
			const anecdotes = queryClient.getQueryData([
				'anecdotes',
			]);
			const updatedAnecdotes = anecdotes.map((anec) =>
				anec.id === updatedAnecdote.id
					? updatedAnecdote
					: anec
			);
			queryClient.setQueryData(
				['anecdotes'],
				updatedAnecdotes
			);
		},
	});

	const handleVote = (anecdote) => {
		updateAnecdoteMutation.mutate({
			...anecdote,
			votes: anecdote.votes + 1,
		});

		notificationDispatch({
			type: 'SET_NOTIFICATION',
			payload: `anecdote '${anecdote.content}' voted`,
		});

		setTimeout(
			() =>
				notificationDispatch({
					type: 'CLEAR_NOTIFICATION',
				}),
			5000
		);
	};

	if (result.isLoading) {
		return <div>Loading data.... </div>;
	}

	if (result.isError) {
		return (
			<div>
				Anecdote service not available due to problems in
				server 😓
			</div>
		);
	}

	const anecdotes = result.data;

	return (
		// <NotificationContextProvider>
		<>
			<h3>Anecdote app</h3>

			<Notification />
			<AnecdoteForm />

			{anecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => handleVote(anecdote)}>
							vote
						</button>
					</div>
				</div>
			))}
		</>
		// </NotificationContextProvider>
	);
};

export default App;
