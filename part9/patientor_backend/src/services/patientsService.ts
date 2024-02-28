import patientsEntries from '../../data/patients';
import { NewPatientEntry, NonSensitivePatient, Patient } from '../types';
import { v1 as uuid } from 'uuid';

const getAllPatients = (): Patient[] => {
	return patientsEntries;
};

const getNoSSNPatients = (): NonSensitivePatient[] => {
	return patientsEntries.map(({ name, id, gender, dateOfBirth, occupation, entries }) => ({
		name,
		id,
		gender,
		dateOfBirth,
		occupation,
		entries,
	}));
};

const getAPatient = (id: string) => {
	return patientsEntries.find((p) => p.id === id);
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
	getAPatient,
};
