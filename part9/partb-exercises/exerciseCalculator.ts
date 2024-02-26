interface exerciseValues {
	target: number;
	numbers: number[];
}

const parseArgumentsOfExcercise = (args: string[]): exerciseValues => {
	if (args.length < 3) throw new Error('Not enough arguments');

	const target: number = Number(args[2]);
	const values: number[] = args.slice(3).map((n) => Number(n));

	if (!isNaN(Number(args[2])) && values.length !== 0) {
		return {
			target,
			numbers: values,
		};
	} else {
		throw new Error('not enough information');
	}
};

export interface ExerciseResult {
	periodLength: number;
	trainingDays: number;
	success: boolean;
	rating: number;
	ratingDescription: string;
	target: number;
	average: number;
}

export function calculateExercises(dailyHours: number[], target: number): ExerciseResult {
	const periodLength: number = dailyHours.length;
	const trainingDays: number = dailyHours.filter((hours) => hours > 0).length;
	const totalHours: number = dailyHours.reduce((sum, hours) => sum + hours, 0);
	const average: number = totalHours / periodLength;

	const success: boolean = average >= target;

	let rating: number;
	let ratingDescription: string;

	if (average < target) {
		rating = 1;
		ratingDescription = 'could be better';
	} else if (average === target) {
		rating = 2;
		ratingDescription = 'not too bad but could be better';
	} else {
		rating = 3;
		ratingDescription = 'great job';
	}

	const result: ExerciseResult = {
		periodLength,
		trainingDays,
		success,
		rating,
		ratingDescription,
		target,
		average,
	};

	return result;
}

try {
	const { target, numbers } = parseArgumentsOfExcercise(process.argv);
	console.log(calculateExercises(numbers, target));
} catch (error: unknown) {
	let errorMesage = 'Something bad happened';
	if (error instanceof Error) {
		errorMesage += ' ; Error: ' + error.message;
	}
	console.log(errorMesage);
}
