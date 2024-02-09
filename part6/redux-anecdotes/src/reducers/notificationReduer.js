import { createSlice } from '@reduxjs/toolkit';

const initialState = '';
const notificationSlice = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		setNotification(state, action) {
			state = action.payload;
			return state;
		},
	},
});

export const { setNotification } =
	notificationSlice.actions;

export const setNotificationFor = (
	message,
	durationInSeconds
) => {
	return (dispatch) => {
		dispatch(setNotification(message));
		setTimeout(
			() => dispatch(setNotification('')),
			durationInSeconds * 1000
		);
	};
};

export default notificationSlice.reducer;
