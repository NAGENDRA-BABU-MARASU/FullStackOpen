import axios from 'axios';
import { useEffect, useState } from 'react';

enum Weather {
	Sunny = 'sunny',
	Rainy = 'rainy',
	Cloudy = 'cloudy',
	Stormy = 'stormy',
	Windy = 'windy',
}

enum Visibility {
	Great = 'great',
	Good = 'good',
	Ok = 'ok',
	Poor = 'poor',
}

interface Diary {
	id: number;
	date: string;
	weather: Weather;
	visibility: Visibility;
	comment?: string;
}

type newDiaryEntry = Omit<Diary, 'id'>;

const App = () => {
	const [diaries, setDiaries] = useState<Diary[]>([]);
	useEffect(() => {
		axios.get<Diary[]>('http://localhost:3000/api/diaries').then((response) => {
			setDiaries(response.data);
		});
	}, []);

	const [date, setDate] = useState('');
	const [visibility, setVisibility] = useState<Visibility>(Visibility.Good);
	const [weather, setWeather] = useState<Weather>(Weather.Cloudy);
	const [comment, setComment] = useState('');

	const [message, setMessage] = useState('');

	const submitDiary = (event: React.SyntheticEvent) => {
		event.preventDefault();
		const newDiary: newDiaryEntry = {
			date: date,
			visibility: visibility,
			weather: weather,
			comment: comment,
		};
		axios
			.post<Diary>('http://localhost:3000/api/diaries', newDiary)
			.then((response) => {
				setDiaries(diaries.concat(response.data));
				setMessage('a new diary added');
				setTimeout(() => setMessage(''), 3000);
			})
			.catch((error) => {
				if (axios.isAxiosError(error)) {
					console.log('hehe', error);
					setMessage(error.response?.data);
					setTimeout(() => setMessage(''), 3000);
				} else {
					console.error(error);
				}
			});
	};

	if (!diaries) {
		return <div>loading...</div>;
	}

	return (
		<div>
			{message && <div style={{ color: 'red' }}>{message}</div>}
			<form onSubmit={submitDiary}>
				date: <input type="date" onChange={(event) => setDate(event.target.value)} />
				<br />
				visibility:
				<input type="radio" name="visibility" onChange={() => setVisibility(Visibility.Great)} />
				great
				<input type="radio" name="visibility" onChange={() => setVisibility(Visibility.Good)} />
				good
				<input type="radio" name="visibility" onChange={() => setVisibility(Visibility.Ok)} />
				ok
				<input type="radio" name="visibility" onChange={() => setVisibility(Visibility.Poor)} />
				poor
				<br />
				weather: <input type="radio" name="weather" onChange={() => setWeather(Weather.Sunny)} />
				sunny:
				<input type="radio" name="weather" onChange={() => setWeather(Weather.Rainy)} />
				rainy:
				<input type="radio" name="weather" onChange={() => setWeather(Weather.Cloudy)} />
				cloudy:
				<input type="radio" name="weather" onChange={() => setWeather(Weather.Stormy)} />
				stormy:
				<input type="radio" name="weather" onChange={() => setWeather(Weather.Windy)} />
				windy:
				<br />
				comment: <input type="text" onChange={(event) => setComment(event.target.value)} />
				<br />
				<button>add</button>
			</form>

			<h1>Diary Entries</h1>
			{diaries.map((diary) => {
				return (
					<div key={diary.id}>
						<h4>{diary.date}</h4>
						visibility: {diary.visibility} <br />
						weather: {diary.weather}
					</div>
				);
			})}
		</div>
	);
};

export default App;
