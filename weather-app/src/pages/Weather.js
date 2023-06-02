import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Weather.css';
import { Link } from 'react-router-dom';
import { API_KEY } from '../config';

function Weather() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [suggestedCities, setSuggestedCities] = useState([]);
  const [selectedCity] = useState(null);
  const [units, setUnits] = useState('imperial');
  const [selectedDay, setSelectedDay] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if the user has seen the demo before
    const hasSeenDemo = localStorage.getItem('hasSeenDemo');
    if (!hasSeenDemo) {
      // Show a confirmation dialog before navigating to the demo page
      const result = window.confirm(
        'Before you begin do you want a demo on the new features of the home page?'
      );
      if (result) {
        window.location.href = '/WeatherDemo';
      }
      // Set a flag to indicate that the demo has been seen
      localStorage.setItem('hasSeenDemo', true);
    }
  }, []);

  function getWeatherData(city, units) {
    return axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${API_KEY}`);
  }

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  const handleUnitTypeChange = async (event) => {
    const units = event.target.value;
    setUnits(units);
    if (city) {
      try {
        const response = await getWeatherData(city, units);
        setWeatherData(response.data);
      } catch (error) {
        setError('Error fetching units.');
      }
    }
  };

  const handleSubmit = async () => {
    if (city) {
      try {
        const response = await getWeatherData(city, units);
        setWeatherData(response.data);
      } catch (error) {
        setError('Error with city submission. Try again.');
      }
    }
  };

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
      } catch (error) {
        setError('Error fetching suggested cities.');
      }
    } else {
      setSuggestedCities([]);
    }
  };

  const handleCancelSearch = () => {
    setCity('');
    setSuggestedCities([]);
    window.location.reload();
  };

  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      try {
        // Make an API call to obtain the city name based on coordinates
        const response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
        );

        // Extract the city name from the response
        const cityName = response.data[0]?.name;

        // Fetch weather data for the obtained city name
        if (cityName) {
          const weatherResponse = await getWeatherData(cityName, units);
          setCity(cityName);
          setWeatherData(weatherResponse.data);
        }
      } catch (error) {
        setError('Error fetching current location data.');
      }
    });
  };

  const handleDayClick = (dayOfWeek, city) => {
    window.location.href = `/${dayOfWeek}/${city}`;
  };

  const handleClearError = () => {
    setError(null);
  };

  const renderForecast = () => {
    if (!weatherData) {
      return null;
    }

    const groupedForecast = {};
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    let nextDay = new Date(today);

    // Show an 8-day forecast starting from today
    for (let i = 0; i < 8; i++) {
      const dayOfWeek = daysOfWeek[nextDay.getDay()];
      if (!groupedForecast[dayOfWeek]) {
        const forecast = weatherData.list.find((f) => {
          const date = new Date(f.dt * 1000);
          return date.getDay() === nextDay.getDay();
        });
        if (forecast) {
          groupedForecast[dayOfWeek] = {
            icon: forecast.weather[0].icon,
            description: forecast.weather[0].description,
            temperature: Math.round(forecast.main.temp),
            feelsLike: Math.round(forecast.main.feels_like),
          };
        }
      }
      nextDay.setDate(nextDay.getDate() + 1);
    }

    return Object.keys(groupedForecast).map((dayOfWeek) => {
      const { icon, description, temperature, feelsLike } = groupedForecast[dayOfWeek];

      return (
        <div className="forecast-item" key={dayOfWeek} onClick={() => handleDayClick(dayOfWeek, city)}>
          <Link
            to={`/${selectedDay}?city=${city}`}
            className="button"
            style={{ color: 'white', fontSize: '35px', fontWeight: 'bold' }}
            onClick={() => handleDaySelect(dayOfWeek)}
          >
            {dayOfWeek}
          </Link>
          <img src={`http://openweathermap.org/img/w/${icon}.png`} alt={description} />
          <ul style={{ fontWeight: 'bold', color: 'black' }}>{description}</ul>
          <ul style={{ fontWeight: 'bold', color: 'black' }}>
            Temperature: {temperature}°{units === 'imperial' ? 'F' : 'C'}
          </ul>
          <ul style={{ fontWeight: 'bold', color: 'black' }}>
            Feels like: {feelsLike}°{units === 'imperial' ? 'F' : 'C'}
          </ul>
        </div>
      );
    });
  };

  useEffect(() => {
    const handleClick = () => {
      handleClearError();
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div style={{ paddingTop: '50px', paddingBottom: '50px' }} className="page-container">
      <h1>Welcome to the Weather App</h1>
      <div className="weather">
        <div className="location-input">
          {suggestedCities.length > 0 && (
            <ul className="suggestions">
              {suggestedCities.map((city) => (
                <div
                  key={city.name}
                  className={city === selectedCity ? 'selected' : ''}
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
          <input type="text" placeholder="Enter city name i.e. Miami" value={city} onChange={handleCityChange} />
          <div>
            <input
              type="radio"
              name="units"
              value="imperial"
              checked={units === 'imperial'}
              onChange={handleUnitTypeChange}
            />{' '}
            Imperial
            <input
              type="radio"
              name="units"
              value="metric"
              checked={units === 'metric'}
              onChange={handleUnitTypeChange}
            />{' '}
            Metric
          </div>
          {city.length > 0 && <button onClick={handleCancelSearch}>Cancel</button>}
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={handleGetCurrentLocation}>Get Current Location</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="forecast">{renderForecast()}</div>
        <div className="navigation">
          <Link to="/Earthquake" className="button" style={{ color: 'white' }}>
            Click here if you also want to get earthquake data near you
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Weather;