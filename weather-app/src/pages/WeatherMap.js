import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-openweathermap';
import { API_KEY } from '../config';
import { useNavigate } from 'react-router-dom';
import backArrow from '../images/back-arrow.png';
import './styles/backArrow.css';

const WEATHER_MAP_OPTIONS = {
  appId: API_KEY,
  opacity: 0.5,
  legendImagePath: 'https://openweathermap.org/img/legends/temp_legend.png',
};

function WeatherMap() {
  const mapContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // initialize map
    const map = L.map(mapContainerRef.current).setView([25.3242, -26.3672], 3);

    // add OpenStreetMap tile layer
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }
    ).addTo(map);

    // add OpenWeatherMap temperature layer to the map
    L.OWM.temperature(WEATHER_MAP_OPTIONS).addTo(map);

    return () => {
      // clean up on unmount, remove the map
      map.remove();
    };
  }, []);

  const handleBack = () => {
    // navigate back to the previous page
    navigate(-1);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div ref={mapContainerRef} style={{ height: '500px' }} />
      <img
        src={backArrow}
        alt="back arrow"
        className="back-arrow"
        onClick={() => handleBack()}
      />
    </div>
  );
}

export default WeatherMap;
