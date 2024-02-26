import express from 'express';
import cors from 'cors';

import diagnosesRouter from './routes/diagnosis';
import patientRouter from './routes/patients';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/diagnoses', diagnosesRouter);
app.use('/api/patients', patientRouter);

app.get('/api/ping', (_req, res) => {
	console.log('someone pinged here');
	res.send('pong');
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
