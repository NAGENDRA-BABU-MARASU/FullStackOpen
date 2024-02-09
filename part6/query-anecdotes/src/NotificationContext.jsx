import { createContext, useReducer } from 'react';

const notificationReducer = (state, action) => {
	switch (action.type) {
		case 'SET_NOTIFICATION':
			return action.payload;
		case 'CLEAR_NOTIFICATION':
			return '';
		default:
			return state;
	}
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
	const [notification, notificationDispatch] = useReducer(
		notificationReducer,
		''
	);

	return (
		<NotificationContext.Provider
			value={[notification, notificationDispatch]}
		>
			{props.children}
		</NotificationContext.Provider>
	);
};

export const clearNotification = () => {
	const [notification, notificationDispatch] = useContext();
	setTimeout(
		() =>
			notificationDispatch({
				type: 'CLEAR_NOTIFICATION',
			}),
		2000
	);
};

export default NotificationContext;
