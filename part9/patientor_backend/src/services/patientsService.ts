import patientsEntries from '../../data/patients';
import { NewPatientEntry, NoSSNPatients, Patient } from '../types';
import { v1 as uuid } from 'uuid';

const getAllPatients = (): Patient[] => {
	return patientsEntries;
};

const getNoSSNPatients = (): NoSSNPatients[] => {
	return patientsEntries.map(({ name, id, gender, dateOfBirth, occupation }) => ({
		name,
		id,
		gender,
		dateOfBirth,
		occupation,
	}));
};

const addPatient = (entry: NewPatientEntry): Patient => {
	
	const newPatientEntry = {
		id: uuid(),
		...entry,
	};
	patientsEntries.push(newPatientEntry);
	return newPatientEntry;
};

export default {
	getAllPatients,
	getNoSSNPatients,
	addPatient,
};
