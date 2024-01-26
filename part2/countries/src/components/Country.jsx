import React, { useEffect, useState } from 'react';
import countriesService from '../services/CountriesService';

function fahrenheitToCelsius(fahrenheit) {
	return (((fahrenheit - 32) * 5) / 9).toFixed(2);
}

export default function Country({ country }) {
	const [weatherInfo, setWeatherInfo] = useState(null);
	const countryStyles = {
		width: 150,
		height: 150,
		margin: '30px 0 0 0',
	};
	useEffect(() => {
		countriesService
			.getCountryWeatherInfo(
				country.latlng[0],
				country.latlng[1]
			)
			.then((response) => {
				setWeatherInfo(response);
			});
	}, []);
	return (
		<div>
			<h1>{country.name.common}</h1>
			<div>capital {country.capital}</div>
			<div>area {country.area}</div>
			<h3>languages:</h3>
			{Object.keys(country.languages).map((key) => (
				<li key={key}>{country.languages[key]}</li>
			))}
			<img
				src={country.flags.png}
				alt={country.flags.alt}
				style={countryStyles}
			/>
			{weatherInfo !== null ? (
				<div>
					<h3>Weather in {country.name.common}</h3>
					<div>
						temperature {weatherInfo.main.temp}
						Celcius
					</div>
          <div>
            <img src={`https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}@2x.png`} alt='weather icon'/>
          </div>
					<div>wind {weatherInfo.wind.speed} m/s </div>
				</div>
			) : (
				<div>Waiting for weather info .... </div>
			)}
		</div>
	);
}
