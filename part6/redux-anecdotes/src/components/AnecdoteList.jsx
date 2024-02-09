import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateVote } from '../reducers/anecdoteReducer';
import { setNotificationFor } from '../reducers/notificationReduer';

const AnecdoteList = () => {
	const filter = useSelector((state) => state.filter);
	const anecdotes = useSelector(({ anecdotes }) => {
		return anecdotes.filter((anecdote) =>
			anecdote.content
				.toLowerCase()
				.includes(filter.toLowerCase())
		);
	});
	const dispatch = useDispatch();

	const vote = (id) => {
		const anecdoteToVote = anecdotes.filter(
			(ance) => ance.id === id
		)[0];
		const votedAnecdote = {
			...anecdoteToVote,
			votes: anecdoteToVote.votes + 1,
		};
		dispatch(updateVote(id));

		dispatch(
			setNotificationFor(
				`you voted: ${votedAnecdote.content}`,
				2
			)
		);
	};
	return (
		<div>
			{anecdotes
				.sort((a, b) => b.votes - a.votes)
				.map((anecdote) => (
					<div key={anecdote.id}>
						<div>{anecdote.content}</div>
						<div>
							has {anecdote.votes}
							<button onClick={() => vote(anecdote.id)}>
								vote
							</button>
						</div>
					</div>
				))}
		</div>
	);
};

export default AnecdoteList;
