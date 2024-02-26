import express from 'express';
import { calculator, Operation } from './calculator';

const app = express();

app.use(express.json());

app.post('/calculate', (req, res) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { value1, value2, op } = req.body;

	if (!value1 || isNaN(Number(value1))) {
		return res.status(400).send({ error: '...' });
	}

	const operation = op as Operation;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const result = calculator(Number(value1), Number(value2), operation);
	return res.send({ result });
});

app.get('/ping', (_req, res) => {
	res.send('p000ong');
});

const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
