import { CoursePart } from './App';

const assertNever = (value: never) => {
	throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const Part = ({ part }: { part: CoursePart }) => {
	switch (part.kind) {
		case 'basic':
			return (
				<div>
					<h3>
						{part.name} {part.exerciseCount}
					</h3>
					<i>{part.description}</i>
				</div>
			);
		case 'group':
			return (
				<div>
					<h3>
						{part.name} {part.exerciseCount}
					</h3>
					project exercises {part.groupProjectCount}
				</div>
			);
		case 'background':
			return (
				<div>
					<h3>
						{part.name} {part.exerciseCount}
					</h3>
					submit to <a href={part.backgroundMaterial}>{part.backgroundMaterial}</a>
				</div>
			);
		case 'special':
			return (
				<div>
					<h3>
						{part.name} {part.exerciseCount}
					</h3>
					<i>{part.description}</i> <br />
					required skills:
					{part.requirements.map(r => r + ',')}
				</div>
			);
		default:
			return assertNever(part);
			break;
	}
};

export default Part;
