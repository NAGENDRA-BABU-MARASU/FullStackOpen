import diagnoses from '../../data/diagnoses';
import { Diagnosis } from '../types';

const getAllDiagnoses = (): Diagnosis[] => {
	return diagnoses;
};

const getDiagnosis = (code: string): Diagnosis | undefined => {
	return diagnoses.find((d) => d.code === code);
};

export default {
	getAllDiagnoses,
	getDiagnosis,
};
