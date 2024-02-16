import React from 'react';
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom';

const Notes = ({ notes }) => (
	<div>
		<h2>Notes</h2>
		<Table striped>
			<tbody>
				{notes.map((note) => (
					<tr key={note.id}>
						<td>
							<Link to={`/notes/${note.id}`}>
								{note.content}
							</Link>
						</td>
						<td>{note.user}</td>
					</tr>
				))}
			</tbody>
		</Table>
		<ul></ul>
	</div>
);

export default Notes;
