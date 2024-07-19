import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';


const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryCode, setCountryCode] = useState('');
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [currency, setCurrency] = useState('');
  const [exchangeRates, setExchangeRates] = useState({ inr: null, usd: null });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countryOptions = response.data.map(country => ({
          value: country.name.common,
          label: country.name.common,
          code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
          
          currency: country.currencies ? Object.keys(country.currencies)[0] : ''
        }));
        setCountries(countryOptions);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryChange = async (selectedOption) => {
    setSelectedCountry(selectedOption);
    setCountryCode(selectedOption.code);
    setCurrency(selectedOption.currency);
    setSelectedState(null);
    setCities([]);
    await fetchStates(selectedOption.label);
    await fetchExchangeRates(selectedOption.currency);
  };

  const fetchStates = async (countryName) => {
    try {
      const response = await axios.post('https://countriesnow.space/api/v0.1/countries/states', {
        country: countryName
      });
      const stateOptions = response.data.data.states.map(state => ({
        value: state.name,
        label: state.name
      }));
      setStates(stateOptions);
    } catch (error) {
      console.error('Error fetching state data:', error);
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };

  const handleStateChange = async (selectedOption) => {
    setSelectedState(selectedOption);
    await fetchCities(selectedCountry.label, selectedOption.label);
  };

  const fetchCities = async (countryName, stateName) => {
    try {
      const response = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
        country: countryName,
        state: stateName
      });
      const cityOptions = response.data.data.map(city => ({
        value: city,
        label: city
      }));
      setCities(cityOptions);
    } catch (error) {
      console.error('Error fetching city data:', error);
      console.error('Error details:', error.response ? error.response.data : error.message);
    }
  };

  const fetchExchangeRates = async (currency) => {
    if (!currency) return;
    try {
      const response = await axios.get(`https://v6.exchangerate-api.com/v6/5b06f3c05b9c1aaa40a056df/latest/${currency}`);
      setExchangeRates({
        inr: response.data.conversion_rates.INR,
        usd: response.data.conversion_rates.USD
      });
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
  };

  return (
    <div className='inner'>
      <h1>Country, State, and City Selector with Code and Currency Converter</h1>
      <form>
        <div className='count'>
          <label>Country</label>
          <Select
            options={countries}
            value={selectedCountry}
            onChange={handleCountryChange}
          />
        </div>
        
        <div className='count'>
          <label>State</label>
          <Select
            options={states}
            value={selectedState}
            onChange={handleStateChange}
            isDisabled={!selectedCountry}
          />
        </div>
        
        <div className='count'>
          <label>City</label>
          <Select
            options={cities}
            value={selectedCity}
            onChange={handleCityChange}
            isDisabled={!selectedState}
          />
        </div>

        <div className='count'>
          <label>Country Code</label>
          <input className='inpu' type="text" value={countryCode} readOnly />
        </div>

        <div className='count'>
          <label>Currency</label>
          <input className='inpu' type="text" value={currency} readOnly />
        </div>
        
        {exchangeRates.inr && exchangeRates.usd && (
             <div className='count count22'>
            <p className='curren'>1 {currency} = {exchangeRates.inr} INR</p>
            <p className='curren'>1 {currency} = {exchangeRates.usd} USD</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default App;




















