import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backArrow from '../images/back-arrow.png';
import './styles/backArrow.css';
import { API_KEY } from '../config';

function Earthquake() {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [period, setPeriod] = useState('');
  const [result, setResult] = useState({});
  const [suggestedCities, setSuggestedCities] = useState([]);
  const [error, setError] = useState(null);

// Handle city input change
const handleCityChange = async (event) => {
  const value = event.target.value;
  setCity(value);
  if (value.length > 2) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`
      );
      const cities = response.data.filter(
        (city, index, self) => self.findIndex((c) => c.name === city.name) === index
      );
      setSuggestedCities(cities);
      if (cities.length > 0) {
        const selectedCity = cities[0];
        setLatitude(selectedCity.lat);
        setLongitude(selectedCity.lon);
        setError(null); // Clear any previous errors
      } else {
        setError('City not found.'); // Set error message for non-existing city
      }
    } catch (error) {
      setError('Error fetching suggested cities.');
    }
  } else {
    setSuggestedCities([]);
    setError(null); // Clear any previous errors
  }
};

  // Cancel search and clear city input
  const handleCancelSearch = () => {
    setCity('');
    setSuggestedCities([]);
  };

  // Get current location coordinates
  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`
        );
        const { name, coord } = response.data.city;
        setCity(name);
        setLatitude(coord.lat);
        setLongitude(coord.lon);
      } catch (error) {
        setError('Error fetching current location data.');
      }
    });
  };

// Handle form submission
const handleSubmit = async (event) => {
  event.preventDefault();
  if (latitude && longitude) {
    const url = `/quakes?time=${period}&lat=${Math.floor(latitude)}&lon=${Math.floor(longitude)}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error with city submission. Try again.');
      }
      const data = await response.json();
      setResult({
        location: data.location,
        magnitude: data.magnitude,
        count: data.count
      });
      setError(null); // Clear any previous errors
    } catch (error) {
      setError('Error with city submission. Try again.');
      setResult({}); // Clear the result
    }
  }
};

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };

  // Clear error message on click anywhere
  useEffect(() => {
    const handleClick = () => {
      setError(null);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  console.log('State after submitting form:', { latitude, longitude, period, result });

  return (
    <div style={{ paddingTop: '50px', paddingBottom: '50px' }} className="page-container">
      <img src={backArrow} alt="back arrow" className="back-arrow" onClick={handleBack} />
      <div className="weather">
        <h1>Earthquake Data</h1>
        <div className="location-input">
          {/* Display suggested cities */}
          {suggestedCities.length > 0 && (
            <ul className="suggestions">
              {suggestedCities.map((city) => (
                <div
                  key={city.name}
                  onClick={() => {
                    setCity(city.name);
                    setSuggestedCities([]);
                  }}
                >
                  {city.name}
                </div>
              ))}
            </ul>
          )}
          {/* City input */}
          <input
            type="text"
            placeholder="Enter city name to get earthquakes nearby (e.g., Miami)"
            value={city}
            onChange={handleCityChange}
          />
          {city.length > 0 && <button onClick={handleCancelSearch}>Cancel</button>}
          <button onClick={handleGetCurrentLocation}>Get Current Location</button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Hidden fields for latitude, longitude, and city */}
          <input type="hidden" value={latitude} onChange={(event) => setLatitude(event.target.value)} />
          <input type="hidden" value={longitude} onChange={(event) => setLongitude(event.target.value)} />
          <input type="hidden" value={city} onChange={(event) => setCity(event.target.value)} />
          <label>
            Period:
            {/* Select period */}
            <select value={period} onChange={(event) => setPeriod(event.target.value)}>
              <option value="h">Hour</option>
              <option value="d">Day</option>
              <option value="w">Week</option>
            </select>
          </label>
          <button type="submit">Submit</button>
          {/* Display result or error */}
          {error && <p>Error: {error}</p>}
          {Object.keys(result).length > 0 && result.count ? (
            <h2>
              Location: {result.location}, Magnitude: {result.magnitude}
            </h2>
          ) : null}
        </form>
      </div>
    </div>
  );
}

export default Earthquake;
