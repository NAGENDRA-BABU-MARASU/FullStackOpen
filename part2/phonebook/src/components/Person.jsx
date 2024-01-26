import React from 'react'

export default function Person({person, deletePerson}) {
  return (
		<div >
			{person.name} {person.number} {' '}
			<button onClick={() => deletePerson(person.id)}>delete</button>
		</div>
	);
}
