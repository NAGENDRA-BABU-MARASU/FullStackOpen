import React from "react";

const Notification = ({ message, error = '' }) => {
	if (message === '') {
		return null;
	}
	return (
		<div className={`notification ${error}`}>{message}</div>
	);
};

export default Notification;