import React, { useState } from 'react';

const useCounter = () => {
	const [value, setValue] = useState(0);

	const increase = () => {
		setValue(value + 1);
	};

	const decrease = () => {
		setValue(value - 1);
	};

	const zero = () => {
		setValue(0);
	};

	return {
		value,
		increase,
		decrease,
		zero,
	};
};

const useFeild = (type) => {
	const [value, setValue] = useState('');

	const onChange = (event) => {
		setValue(event.target.value);
	};

	return {
		type,
		value,
		onChange,
	};
};

const App = () => {
	const counter = useCounter();

	const left = useCounter();
	const right = useCounter();

	const name = useFeild('text');
	const born = useFeild('date');
	const height = useFeild('number');

	return (
		<div>
			<form>
				name: <input {...name} /> <br />
				birthday: <input {...born} /> <br />
				height: <input {...height} /> <br />
			</form>
			<div>
				{name.value} {born.value} {height.value}
			</div>
		</div>
	);
};
export default App;
