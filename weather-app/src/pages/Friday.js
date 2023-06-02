import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import backArrow from '../images/back-arrow.png';
import './styles/backArrow.css';
import './styles/week.css';
import { API_KEY } from '../config';

function Friday() {
  const [forecastData, setForecastData] = useState(null);
  const navigate = useNavigate();
  const { city } = useParams();

  // Handle back button click
  const handleBack = () => {
    navigate(-2);
  };

  useEffect(() => {
    console.log(city); // check if the city parameter is being updated correctly
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;

    // Fetch forecast data
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setForecastData(data);
      })
      .catch(error => {
        console.log('Error fetching forecast data:', error);
      });
  }, [city]);

  // Convert temperature from Kelvin to Celsius and Fahrenheit
  const convertTemperature = (temp) => {
    const fahrenheit = Math.round((temp - 273.15) * 9 / 5 + 32);
    const celsius = Math.round(temp - 273.15);
    return {
      fahrenheit,
      celsius
    };
  };

  return (
    <div style={{ paddingTop: '50px', paddingBottom: '50px' }} className="page-container">
      <h1>Friday Hourly Forecast</h1>
      <img
        src={backArrow}
        alt="back arrow"
        className="back-arrow"
        onClick={handleBack} // Removed unnecessary arrow function wrapper
      />
      {/* Display forecast data for Friday */}
      {forecastData && forecastData.list && forecastData.list.map(item => {
        const date = new Date(item.dt * 1000);
        if (date.getDay() === 2) { // filter for Friday forecast only
          const { celsius, fahrenheit } = convertTemperature(item.main.feels_like);
          const { celsius: tempCelsius, fahrenheit: tempFahrenheit } = convertTemperature(item.main.temp);
          const { celsius: maxTempCelsius, fahrenheit: maxTempFahrenheit } = convertTemperature(item.main.temp_max);
          const { celsius: minTempCelsius, fahrenheit: minTempFahrenheit } = convertTemperature(item.main.temp_min);

          return (
            <div key={item.dt} className="week-container">
              <div>{date.toLocaleTimeString()}</div>
              <div>{item.weather[0].description}</div>
              <div>Feels like: {celsius}°C / {fahrenheit}°F</div>
              <div>Humidity: {item.main.humidity}</div>
              <div>Pressure: {item.main.pressure}</div>
              <div>Temperature: {tempCelsius}°C / {tempFahrenheit}°F</div>
              <div>Temperature Max: {maxTempCelsius}°C / {maxTempFahrenheit}°F</div>
              <div>Temperature Min: {minTempCelsius}°C / {minTempFahrenheit}°F</div>
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}

export default Friday;
