import React from "react";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
	const navigate = useNavigate();

	const onSubmit = (event) => {
		event.preventDefault();
		props.onLogin('mluukkai');
		navigate('/');
	};

	return (
		<div>
			<h2>login</h2>
			<form onSubmit={onSubmit}>
				<div>
					username: <input />
				</div>
				<div>
					password: <input type="password" />
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	);
};

export default Login;