import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdoteSlice = createSlice({
	name: 'anecdotes',
	initialState: [],
	reducers: {
		updateAnecdote(state, action) {
			const votedAnecdote = action.payload;
			return state.map((anec) =>
				anec.id === votedAnecdote.id ? votedAnecdote : anec
			);
		},
		appendAnecdote(state, action) {
			state.push(action.payload);
		},
		setAnecdotes(state, action) {
			state = action.payload;
			return state;
		},
	},
});

export const {
	appendAnecdote,
	updateAnecdote,
	setAnecdotes,
} = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
	return async (dispatch) => {
		const anecdotes = await anecdoteService.getAll();
		dispatch(setAnecdotes(anecdotes));
	};
};

export const createAnecdote = (content) => {
	return async (dispatch) => {
		const newAnecdote = await anecdoteService.createNew(
			content
		);
		dispatch(appendAnecdote(newAnecdote));
	};
};

export const updateVote = (id) => {
	return async (dispatch, getState) => {
		const anecdoteToVote = getState().anecdotes.find(
			(anec) => anec.id === id
		);
		const updatedAnecdote = {
			...anecdoteToVote,
			votes: anecdoteToVote.votes + 1,
		};
		const latestAnecdote = await anecdoteService.update(
			updatedAnecdote
		);
		dispatch(updateAnecdote(latestAnecdote));
	};
};

export default anecdoteSlice.reducer;

// const anecdoteReducer = (state = initialState, action) => {
// 	switch (action.type) {
// 		case 'ADD_VOTE':
// 			const id = action.payload.id;
// 			const anecdoteToVote = state.find(
// 				(anec) => anec.id === id
// 			);
// 			const votedAnecdote = {
// 				...anecdoteToVote,
// 				votes: anecdoteToVote.votes + 1,
// 			};
// 			return state.map((anec) =>
// 				anec.id === id ? votedAnecdote : anec
// 			);
// 		case 'NEW_ANECDOTE':
// 			return [...state, action.payload];
// 		default:
// 			return state;
// 	}
// };

// export const updateVoteOf = (id) => {
// 	return {
// 		type: 'ADD_VOTE',
// 		payload: { id },
// 	};
// };

// export const createAnecdote = (anecdote) => {
// 	return {
// 		type: 'NEW_ANECDOTE',
// 		payload: {
// 			id: getId(),
//       content: anecdote,
//       votes: 0
// 		},
// 	};
// };

// export default anecdoteReducer;
