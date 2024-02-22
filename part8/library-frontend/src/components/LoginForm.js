import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setToken }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [login, result] = useMutation(LOGIN);
	const navigate = useNavigate();

	useEffect(() => {
		if (result.data) {
			const token = result.data.login.value;
			setToken(token);
			localStorage.setItem('LIBRARY-USER-TOKEN', token);
			navigate('/');
		}
	}, [result.data]);

	const handleSubmit = (event) => {
		event.preventDefault();
		login({ variables: { username, password } });
	};

	return (
		<>
			<h2>login </h2>
			<form onSubmit={handleSubmit}>
				username :{' '}
				<input
					type="text"
					name="username"
					value={username}
					onChange={(event) =>
						setUsername(event.target.value)
					}
				/>
				<br />
				password:
				<input
					type="password"
					name="password"
					value={password}
					onChange={(event) =>
						setPassword(event.target.value)
					}
				/>
				<br />
				<button>login </button>
			</form>
		</>
	);
};

export default LoginForm;
