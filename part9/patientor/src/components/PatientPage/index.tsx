import { useEffect, useState } from 'react';
import { Diagnosis, Gender, Patient } from '../../types';
import { CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import patientService from '../../services/patients';
import diagnosesService from '../../services/diagnoses';
import { FemaleOutlined, MaleOutlined, Transgender } from '@mui/icons-material';
import axios from 'axios';

const PatientPage = () => {
	type PatientParams = {
		id: string;
	};

	const [patientData, setPatientData] = useState<Patient>();
	const [diagnosesData, setDiagnosesData] = useState<Diagnosis[]>([]);
	const { id } = useParams<PatientParams>();
	useEffect(() => {
		const fetchAPatient = async () => {
			const patient = await patientService.getOne(id);
			setPatientData(patient);
			patient.entries.forEach((entry) => {
				const allEntries = entry.diagnosisCodes?.map((code) => code);
				axios
					.all(allEntries?.map((entry) => diagnosesService.getDiagnosys(entry)))
					.then((data) => setDiagnosesData(data));
			});
		};
		fetchAPatient();
	}, [id]);

	if (!patientData) {
		return <CircularProgress />;
	}

	return (
		<div>
			<Typography style={{ margin: '20px 0px' }} variant="h5">
				<b>{patientData.name}</b>
				{patientData.gender === Gender.Female ? (
					<FemaleOutlined />
				) : patientData.gender === Gender.Male ? (
					<MaleOutlined />
				) : (
					<Transgender />
				)}
				<br />
			</Typography>
			<Typography>
				ssh: {patientData.ssn} <br />
				occupation: {patientData.occupation}
			</Typography>
			<Typography variant="h6">
				<b>entries</b>
			</Typography>
			<Typography variant="subtitle2">
				{patientData.entries.map((entry) => {
					return (
						<div key={entry.id}>
							{entry.date} <i>{entry.description}</i>
							<ul>
								{entry.diagnosisCodes?.map((code) => (
									<li key={code}>
										{code} {diagnosesData.find((d) => d.code === code)?.name}
									</li>
								))}
							</ul>
						</div>
					);
				})}
			</Typography>
		</div>
	);
};

export default PatientPage;
