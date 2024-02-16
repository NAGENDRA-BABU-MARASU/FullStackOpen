import React, { useState } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Navigate,
	useMatch,
} from 'react-router-dom';

import { Alert, Navbar, Nav } from 'react-bootstrap';

import Users from './components/Users';
import Notes from './components/Notes';
import Home from './components/Home';
import Note from './components/Note';
import Login from './components/Login';

const App = () => {
	const [notes, setNotes] = useState([
		{
			id: 1,
			content: 'HTML is easy',
			important: true,
			user: 'Matti Luukkainen',
		},
		{
			id: 2,
			content: 'Browser can execute only JavaScript',
			important: false,
			user: 'Matti Luukkainen',
		},
		{
			id: 3,
			content:
				'Most important methods of HTTP-protocol are GET and POST',
			important: true,
			user: 'Arto Hellas',
		},
	]);

	const [user, setUser] = useState(null);
	const [message, setMessage] = useState(null);

	const login = (user) => {
		setUser(user);
		setMessage(`welcome ${user}`);
		setTimeout(() => {
			setMessage(null);
		}, 10000);
	};

	const padding = {
		padding: 5,
	};

	const match = useMatch('/notes/:id');
	const note = match
		? notes.find(
				(note) => note.id === Number(match.params.id)
		  )
		: null;

	return (
		<div className="container">
			{message && (
				<Alert variant="success">{message}</Alert>
			)}
			<div>
				<Navbar
					collapseOnSelect
					expand="lg"
					bg="dark"
					variant="dark"
				>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav className="me-auto">
							<Nav.Link href="#" as="span">
								<Link style={padding} to="/">
									home
								</Link>
							</Nav.Link>
							<Nav.Link href="#" as="span">
								<Link style={padding} to="/notes">
									notes
								</Link>
							</Nav.Link>
							<Nav.Link href="#" as="span">
								<Link style={padding} to="/users">
									users
								</Link>
							</Nav.Link>
							<Nav.Link href="#" as="span">
								{user ? (
									<em style={padding}>{user} logged in</em>
								) : (
									<Link style={padding} to="/login">
										login
									</Link>
								)}
							</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			</div>

			<Routes>
				<Route
					path="/notes/:id"
					element={<Note note={note} />}
				/>
				<Route
					path="/notes"
					element={<Notes notes={notes} />}
				/>
				<Route
					path="/users"
					element={
						user ? (
							<Users />
						) : (
							<Navigate replace to="/login" />
						)
					}
				/>
				<Route
					path="/login"
					element={<Login onLogin={login} />}
				/>
				<Route path="/" element={<Home />} />
			</Routes>
			<footer>
				<br />
				<em>
					Note app, Department of Computer Science 2023
				</em>
			</footer>
		</div>
	);
};
export default App;
