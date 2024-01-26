import React from 'react'

const Header = (props) => {
	return <h2>{props.course}</h2>;
};

const Part = (props) => {
	return (
		<p>
			{props.part} {props.exercises}
		</p>
	);
};

const Content = (props) => {
	return (
		<div>
			{props.parts.map((part) => (
				<Part
					key={part.id}
					part={part.name}
					exercises={part.exercises}
				/>
			))}
		</div>
	);
};

const Total = ({ parts }) => {
	return (
		<b>
			total of{' '}
			{parts.reduce((acc, curPart) => {
				return acc + curPart.exercises;
			}, 0)}{' '}
			exercises
		</b>
	);
};


const Course = ({ course }) => {
	return (
		<div>
			<Header course={course.name} />
			<Content parts={course.parts} />
			<Total parts={course.parts} />
		</div>
	);
};

export default Course