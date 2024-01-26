import { useState, useEffect } from 'react';
import Search from './components/Search';
import Countries from './components/Countries';
import countriesService from './services/CountriesService';

function App() {
	const [countries, setCountries] = useState([]);
	const [searchWord, setSearchWord] = useState('');

  
	const handleSearchWord = (event) => {
		setSearchWord(event.target.value);
	};

	useEffect(() => {
		countriesService
			.getAllCountries()
			.then((allCountries) => {
				setCountries(allCountries);
			});
	}, []);

	return (
		<>
			<Search
				searchWord={searchWord}
				handleSearchWord={handleSearchWord}
			/>

			<Countries
				allCountries={countries}
				searchWord={searchWord}
				setSearchWord={setSearchWord}
			/>
		</>
	);
}

export default App;
