import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { ExerciseResult, calculateExercises } from './exerciseCalculator';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
	res.send('Hello Full Stack!');
});

interface bmiResponse {
	weight: number;
	height: number;
	bmi: string;
}

app.get('/bmi', (req, res) => {
	try {
		if (
			Object.keys(req.query).length != 2 ||
			isNaN(Number(req.query.height)) ||
			isNaN(Number(req.query.weight))
		) {
			throw new Error('malformatted parameters');
		}

		const height: number = Number(req.query.height);
		const weight: number = Number(req.query.weight);
		const response: bmiResponse = {
			height,
			weight,
			bmi: calculateBmi(height, weight),
		};
		res.send(response);
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.send({
				error: error.message,
			});
		}
	}
});

app.post('/exercises', (req, res) => {
	try {
		if (!req.body.daily_exercises || !req.body.target) {
			throw new Error('parameters missing');
		}
		const response: ExerciseResult = calculateExercises(req.body.daily_exercises, req.body.target);
		res.send(response);
		
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.send({
				error: error.message,
			});
		}
	}
});

const PORT = 3003;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
