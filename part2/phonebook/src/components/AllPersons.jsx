import React from 'react';
import Person from './Person';

const AllPersons = ({
	searchWord,
	persons,
	deletePerson,
}) => {
	return (
		<div>
			<h2>Numbers</h2>
			{searchWord === ''
				? persons.map((person) => (
						<Person
							key={person.name}
							person={person}
							deletePerson={deletePerson}
						/>
				  ))
				: persons
						.filter((person) =>
							person.name
								.toLowerCase()
								.includes(searchWord.toLowerCase())
						)
						.map((person) => (
							<Person
								key={person.name}
								person={person}
								deletePerson={deletePerson}
							/>
						))}
		</div>
	);
};

export default AllPersons;
