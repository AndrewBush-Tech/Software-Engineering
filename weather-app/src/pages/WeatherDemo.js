import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backArrow from '../images/back-arrow.png';
import './styles/Weather.css';
import './styles/backArrow.css';
import { API_KEY } from '../config';

function WeatherDemo() {
  const [city, setCity] = useState('corvallis');
  const [weatherData, setWeatherData] = useState(null);
  const [suggestedCities, setSuggestedCities] = useState([]);
  const [units, setUnits] = useState('imperial');
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch weather data when the city or units change
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${API_KEY}`);
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [city, units]);

  useEffect(() => {
    alert('Welcome to the Demonstration page! Here you can scroll over features to find out what each does. After you are finished you can hit the back button or use the navigation bar at the bottom.');
  }, []);

  const handleCityChange = async (event) => {
    const value = event.target.value;
    setCity(value);

    if (value.length > 2) {
      try {
        const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`);
        const cities = response.data.filter((city, index, self) => self.findIndex(c => c.name === city.name) === index);
        setSuggestedCities(cities);
      } catch (error) {
        console.error('Error fetching suggested cities:', error);
      }
    } else {
      setSuggestedCities([]);
    }

    // Handle Enter key press
    if (event.keyCode === 13 && suggestedCities.length > 0) {
      setCity(suggestedCities[0].name);
      setSuggestedCities([]);
    }
  };

  const handleCancel = () => {
    alert('This button will cancel the search and reload the page with an empty search bar');
  };

  const handleSubmit = () => {
    alert('This button will submit and refresh the forecast based on the input in the search bar');
  };

  const handleGetCurrentLocation = () => {
    alert('You can simply click "Get Current Location" to find the weather nearby');
  };

  const handleBack = () => {
    navigate(-1);
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
        <div className="forecast-item" key={dayOfWeek}>
          <span onMouseEnter={() => alert('You can click on the days of the week to navigate to the Hourly Forecast for that day!')}>
            <h2>{dayOfWeek}</h2>
          </span>
          <img src={`http://openweathermap.org/img/w/${icon}.png`} alt={description} />
          <ul style={{ fontWeight: 'bold', color: 'black' }}>{description}</ul>
          <ul style={{ fontWeight: 'bold', color: 'black' }}>Temperature: {temperature}°{units === 'imperial' ? 'F' : 'C'}</ul>
          <ul style={{ fontWeight: 'bold', color: 'black' }}>Feels like: {feelsLike}°{units === 'imperial' ? 'F' : 'C'}</ul>
        </div>
      );
    });
  };

  return (
    <div style={{ paddingTop: '50px', paddingBottom: '50px' }} className="page-container">
      <h1>Demo Page</h1>
      <img
        src={backArrow}
        alt="back arrow"
        className="back-arrow"
        onClick={handleBack}
      />
      <div className="weather">
        <div className="location-input">
          {suggestedCities.length > 0 && (
            <ul className="suggestions">
              {suggestedCities.map((city) => (
                <div key={city.name} className={city === selectedCity ? 'selected' : ''} onClick={() => {
                  setCity(city.name);
                  setSuggestedCities([]);
                  setSelectedCity(city); // Set selected city
                }}>
                  {city.name}
                </div>
              ))}
            </ul>
          )}
          <input
            type="text"
            placeholder="Enter city name to get the local weather (e.g., Miami)"
            value={city}
            onChange={handleCityChange}
            onMouseEnter={() => {
              alert('Here you can search for a city nearby or far away by typing it out. The search will auto-fill suggestions.');
            }}
          />
          <div>
            <label style={{ color: 'white' }}>
              <input
                type="radio"
                name="units"
                value="imperial"
                checked={units === 'imperial'}
                onChange={() => setUnits('imperial')}
                onMouseEnter={() => {
                  alert('You can select imperial units for the forecast degrees.');
                }}
              />
              Imperial
              <input
                type="radio"
                name="units"
                value="metric"
                checked={units === 'metric'}
                onChange={() => setUnits('metric')}
                onMouseEnter={() => {
                  alert('You can select metric units for the forecast degrees.');
                }}
                style={{ color: 'white' }}
              />
              Metric
            </label>
          </div>
          <div>
            <button onMouseEnter={handleCancel}>Cancel</button>
            <button onMouseEnter={handleSubmit}>Submit</button>
            <button onMouseEnter={handleGetCurrentLocation}>Get Current Location</button>
          </div>
        </div>
        <div className="forecast">{renderForecast()}</div>
        <span onMouseEnter={() => alert('This will navigate to a page dedicated to showing the closest earthquakes and data associated with it')}>
          Click here if you also want to get earthquake data near you
        </span>
      </div>
    </div>
  );
}

export default WeatherDemo;
