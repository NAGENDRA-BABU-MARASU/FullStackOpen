import React from 'react';

const NewPersonForm = ({addNewPerson, newName, handleNewName, newNumber, handleNewNumber}) => {
  return (
		<form onSubmit={addNewPerson}>
			<div>
				name:{'  '}
				<input value={newName} onChange={handleNewName} />
				<br />
				number:{' '}
				<input
					value={newNumber}
					onChange={handleNewNumber}
				/>
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	);
}

export default NewPersonForm;