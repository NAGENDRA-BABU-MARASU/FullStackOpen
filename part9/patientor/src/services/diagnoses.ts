import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { Diagnosis } from '../types';

const getDiagnosys = async (code: string) => {
	const { data } = await axios.get<Diagnosis>(`${apiBaseUrl}/diagnoses/${code}`);
	return data;
};

export default {
	getDiagnosys,
};
