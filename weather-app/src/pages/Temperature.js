import { useNavigate } from 'react-router-dom';
import backArrow from '../images/back-arrow.png';
import './styles/backArrow.css';
import WeatherMap from './WeatherMap';

// Handle back button click
const handleBack = (navigate) => {
  navigate(-1);
};

function Temperature() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: '120px' }}>
      <h1>Temperature Weather Map</h1>
      <WeatherMap />
      <img
        src={backArrow}
        alt="back arrow"
        className="back-arrow"
        onClick={() => handleBack(navigate)} // Call handleBack with navigate as an argument
      />
    </div>
  );
}

export default Temperature;
