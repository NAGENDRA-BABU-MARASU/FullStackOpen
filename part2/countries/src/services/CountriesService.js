import axios from 'axios';
const baseUrl =
	'https://studies.cs.helsinki.fi/restcountries/api';

const getAllCountries = () => {
	const request = axios.get(`${baseUrl}/all`);
	return request.then((response) => response.data);
};

const getCountriesWithName = (searchWord) => {
	const request = axios.get(
		`${baseUrl}/name/${searchWord}`
	);
	return request.then((response) => response.data);
};

const getCountryWeatherInfo = (lat, lon) => {
  const API_key = import.meta.env.VITE_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`;
  const request = axios.get(url);
  return request.then((response) => response.data)
}

export default { getAllCountries, getCountriesWithName , getCountryWeatherInfo };
