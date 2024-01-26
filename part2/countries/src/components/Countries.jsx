import React, { useState, useEffect } from 'react';
import Country from './Country';

export default function Countries({
	allCountries,
	searchWord,
	setSearchWord,
}) {
	let countriesMatched =
		searchWord === ''
			? []
			: allCountries.filter((country) =>
					country.name.common
						.toLowerCase()
						.includes(searchWord.toLowerCase())
			  );

	useEffect(() => {
		countriesMatched =
			searchWord === ''
				? []
				: allCountries.filter((country) =>
						country.name.common
							.toLowerCase()
							.includes(searchWord.toLowerCase())
				  );
	}, [searchWord]);

	const showCountry = (id) => {
		countriesMatched = [countriesMatched[id]];
		setSearchWord(countriesMatched[0].name.common);
	};

	if (countriesMatched.length === 1) {
		return <Country country={countriesMatched[0]} />;
	}
	if (countriesMatched.length > 10) {
		return (
			<div>
				⚠️⚠️Too many matches, specify another filter{' '}
			</div>
		);
	} else {
		return countriesMatched.map((country, i) => (
			<div key={country.name.common}>
				{country.name.common}{' '}
				<button onClick={() => showCountry(i)}>show</button>
			</div>
		));
	}
}
