import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import phoneBookService from './services/PhoneBook';
import Filter from './components/Filter';
import NewPersonForm from './components/NewPersonForm';
import AllPersons from './components/AllPersons';
import Notification from './components/Notification';

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [searchWord, setSearchWord] = useState('');
	const [notificationMessage, setNotificationMessage] =
		useState('');
	const [error, setError] = useState('')

	useEffect(() => {
		phoneBookService
			.getAllPersons()
			.then((allPersons) => setPersons(allPersons));
	}, []);

	const handleNewName = (event) => {
		setNewName(event.target.value);
	};

	const handleNewNumber = (event) => {
		setNewNumber(event.target.value);
	};

	const handleSearchWord = (event) => {
		setSearchWord(event.target.value);
	};

	const clearNotificationMessage = () => {
		setTimeout(() => {
			setNotificationMessage('');
			setError('')
		}, 5000);
	};

	const addNewPerson = (event) => {
		event.preventDefault();
		const newPerson = {
			name: newName,
			number: newNumber,
		};
		const oldPerson = persons.find(
			(person) => person.name === newName
		);
		if (oldPerson) {
			if (
				window.confirm(
					`${oldPerson.name} is already added to the phonebook, replace the old number with the new one ?`
				)
			) {
				phoneBookService
					.updatePerson(oldPerson.id, newPerson)
					.then((updatedPerson) => {
						setPersons(
							persons.map((person) =>
								person.id === updatedPerson.id
									? updatedPerson
									: person
							)
						);
						setNotificationMessage(
							`Updated ${updatedPerson.name}`
						);
						clearNotificationMessage();
					})
					.catch((error) => {
						console.log(error);
						setError('error')
						setNotificationMessage(
							// `Information of ${newPerson.name} has already been removed from server`
							`${error.response.data.error}`
						);
						clearNotificationMessage();
						setPersons(
							persons.filter((person) => person.id !== oldPerson.id)
						);
					});
			}
		} else {
			phoneBookService
				.addPerson(newPerson)
				.then((addedPerson) => {
					setPersons(persons.concat(addedPerson));
					setNewName('');
					setNewNumber('');
					setNotificationMessage(
						`Added ${addedPerson.name}`
					);
					clearNotificationMessage();
				}).catch(error => {
					setError('error')
					setNotificationMessage(
						// `Information of ${newPerson.name} has already been removed from server`
						`${error.response.data.error}`
					);
					clearNotificationMessage()
				})
		}
	};

	const deletePersonOf = (id) => {
		const person = persons.find(
			(person) => person.id === id
		);
		if (window.confirm(`Delete ${person.name}`)) {
			phoneBookService.deletePerson(id);
			setPersons(
				persons.filter((person) => person.id !== id)
			);
			setNotificationMessage(`Deleted ${person.name}`);
			clearNotificationMessage();
		}
	};

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={notificationMessage} error={error}/>
			<Filter
				searchWord={searchWord}
				handleSearchWord={handleSearchWord}
			/>
			<br />

			<NewPersonForm
				newName={newName}
				newNumber={newNumber}
				addNewPerson={addNewPerson}
				handleNewName={handleNewName}
				handleNewNumber={handleNewNumber}
			/>

			<AllPersons
				searchWord={searchWord}
				persons={persons}
				deletePerson={deletePersonOf}
			/>
		</div>
	);
};

export default App;
