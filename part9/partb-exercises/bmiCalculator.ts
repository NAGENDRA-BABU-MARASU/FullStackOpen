export interface bmiValues {
	value1: number;
	value2: number;
}

export const parseArguments = (args: string[]): bmiValues => {
	if (args.length < 4) throw new Error('Not enough arguments');
	if (args.length > 4) throw new Error('Too many arguments');

	if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
		return {
			value1: Number(args[2]),
			value2: Number(args[3]),
		};
	} else {
		throw new Error('Provided values were not numbers');
	}
};

export const calculateBmi = (height: number, weight: number): string => {
	const height_m: number = height / 100;
	const bmi: number = weight / height_m ** 2;

	if (bmi < 18.5) {
		return `Your BMI is ${bmi.toFixed(2)}. You are underweight.`;
	} else if (18.5 <= bmi && bmi < 25) {
		return `Your BMI is ${bmi.toFixed(2)}. Your weight is normal.`;
	} else if (25 <= bmi && bmi < 30) {
		return `Your BMI is ${bmi.toFixed(2)}. You are overweight.`;
	} else {
		return `Your BMI is ${bmi.toFixed(2)}. You are obese.`;
	}
};

try {
	const { value1, value2 } = parseArguments(process.argv);
  console.log(calculateBmi(value1, value2));
} catch (error: unknown) {
	let errorMesage = 'Something bad happened';
	if (error instanceof Error) {
		errorMesage += ' ; Error: ' + error.message;
	}
	console.log(errorMesage);
}

