import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

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
			<Form onSubmit={onSubmit}>
				<Form.Group>
					<Form.Label>username:</Form.Label>
					<Form.Control type="text" name="username" />
				</Form.Group>
				<Form.Group>
					<Form.Label>password:</Form.Label>
					<Form.Control type="password" name="password" />
				</Form.Group>
				<Button variant="primary" type="submit">
					login
				</Button>
			</Form>
		</div>
	);
};

export default Login;
