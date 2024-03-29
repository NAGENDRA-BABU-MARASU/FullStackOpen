import React, { useState } from 'react';
import { gql, useApolloClient, useQuery, useSubscription } from '@apollo/client';
import { ALL_PERSONS, FIND_PERSON, PERSON_ADDED, updateCache } from './queries';

import './App.css';
import PersonForm from './PersonForm';
import PhoneForm from './PhoneForm';
import LoginForm from './LoginForm';

const Person = ({ person, onClose }) => {
	return (
		<div>
			<h2>{person.name}</h2>
			<div>
				{person.address.street} {person.address.city}{' '}
			</div>
			<div>{person.phone}</div>
			<button onClick={onClose}>close</button>
		</div>
	);
};

const Persons = ({ persons }) => {
	const [nameToSearch, setNameToSearch] = useState(null);
	const result = useQuery(FIND_PERSON, {
		variables: { nameToSearch },
		skip: !nameToSearch,
	});

	if (nameToSearch && result.data) {
		return <Person person={result.data.findPerson} onClose={() => setNameToSearch(null)} />;
	}
	return (
		<div>
			<h2>Persons</h2>
			{persons.map((p) => (
				<div key={p.name}>
					{p.name} {p.phone}
					<button onClick={() => setNameToSearch(p.name)}>show address </button>
				</div>
			))}
		</div>
	);
};

const Notify = ({ errorMessage }) => {
	if (!errorMessage) {
		return null;
	}
	return <div style={{ color: 'red' }}>{errorMessage}</div>;
};

function App() {
	const [errorMessage, setErrorMessage] = useState(null);
	const [token, setToken] = useState(null);
	const result = useQuery(ALL_PERSONS);
	const client = useApolloClient();

	useSubscription(PERSON_ADDED, {
		onData: ({ data, client }) => {
			const addedPerson = data.data.personAdded;
			notify(`${addedPerson.name} added`);
			updateCache(client.cache, { query: ALL_PERSONS }, addedPerson);
		},
	});

	if (result.loading) {
		return <div>Loading...</div>;
	}

	const notify = (message) => {
		setErrorMessage(message);
		setTimeout(() => {
			setErrorMessage(null);
		}, 10000);
	};

	const logout = () => {
		setToken(null);
		localStorage.clear();
		client.resetStore();
	};

	if (!token) {
		return (
			<div>
				<Notify errorMessage={errorMessage} />
				<LoginForm setToken={setToken} setError={notify} />
			</div>
		);
	}
	return (
		<div>
			<Notify errorMessage={errorMessage} />
			<button onClick={logout}>logout</button>
			<Persons persons={result.data.allPersons} />
			<PersonForm setError={notify} />
			<PhoneForm setError={notify} />
		</div>
	);
}

export default App;
