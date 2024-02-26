import diaries from '../../data/entries';
import { DiaryEntry, NewDiaryEntry, NonSensitiveDiaryEntry } from '../types';

const getEntries = (): DiaryEntry[] => {
	return diaries;
};

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
	return diaries.map((diary) => {
		return {
			id: diary.id,
			date: diary.date,
			weather: diary.weather,
			visibility: diary.visibility,
		};
	});
};

const findById = (id: number): DiaryEntry | undefined => {
	const entry = diaries.find((d) => d.id === id);
	return entry;
};

const addDiary = (entry: NewDiaryEntry): DiaryEntry => {
	const newDiaryEntry = {
		id: Math.max(...diaries.map((d) => d.id)) + 1,
		...entry,
	};
	diaries.push(newDiaryEntry);
	return newDiaryEntry;
};

export default {
	getEntries,
	addDiary,
	getNonSensitiveEntries,
	findById,
};
