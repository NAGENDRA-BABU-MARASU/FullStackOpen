/* eslint-disable react/prop-types */
import { useState } from 'react';

const StatisticLine = ({ text, value }) => {
  if(text === "positive"){
    return (
			<tr>
				<td>{text}</td>
				<td>{value}%</td>
			</tr>
		);
  }
	return (
		<tr>
			<td>{text}</td>
			<td>{value}</td>
		</tr>
	);
};

const Statistics = ({ good, neutral, bad }) => {
	let total = good + neutral + bad;

	if (total > 0) {
		return (
			<div>
				<table>
					<thead>
						<tr>
							<th>statistics</th>
						</tr>
					</thead>
					<tbody>
						<StatisticLine text="good" value={good} />
						<StatisticLine text="neutral" value={neutral} />
						<StatisticLine text="bad" value={bad} />
						<StatisticLine
							text="all"
							value={good + neutral + bad}
						/>
						<StatisticLine
							text="average"
							value={((good - bad) / (good + neutral + bad)).toFixed(2)}
						/>
						<StatisticLine
							text="positive"
							value={((good / (good + neutral + bad)) * 100).toFixed(1)} 
						/>
					</tbody>
				</table>
			</div>
		);
	} else {
		return (
			<>
				<h2>statistics</h2>
				<div>No feedback given</div>
			</>
		);
	}
};

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);

	return (
		<div>
			<h1>give feedback</h1>
			<button onClick={() => setGood(good + 1)}>
				good
			</button>

			<button onClick={() => setNeutral(neutral + 1)}>
				neutral
			</button>

			<button onClick={() => setBad(bad + 1)}>bad</button>

			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	);
};

export default App;
