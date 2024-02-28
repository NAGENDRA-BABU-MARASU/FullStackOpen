import express from 'express';
import diagnosesService from '../services/diagnosesService';

const router = express.Router();

router.get('/', (_req, res) => {
	res.send(diagnosesService.getAllDiagnoses());
});

router.get('/:id', (req, res) => {
	res.send(diagnosesService.getDiagnosis(req.params.id));
});

export default router;
