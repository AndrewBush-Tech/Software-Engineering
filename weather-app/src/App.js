import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Weather from './pages/Weather';
import Earthquake from './pages/Earthquake';
import Agenda from './pages/Agenda';
import Temperature from './pages/Temperature';
import WeatherDemo from './pages/WeatherDemo';
import Monday from './pages/Monday';
import Tuesday from './pages/Tuesday';
import Wednesday from './pages/Wednesday';
import Thursday from './pages/Thursday';
import Friday from './pages/Friday';
import Saturday from './pages/Saturday';
import Sunday from './pages/Sunday';
import WeatherMap from './pages/WeatherMap';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/"> Home </Link></li>
            <li><Link to="/Agenda"> Agenda </Link></li>
            <li><Link to="/Temperature"> Map </Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Weather />} />
          <Route path="/Earthquake" element={<Earthquake />} />
          <Route path="/Agenda" element={<Agenda />} />
          <Route path="/Temperature" element={<Temperature />} />
          <Route path="/WeatherDemo" element={<WeatherDemo />} />
          <Route path="/Monday/:city" element={<Monday />} />
          <Route path="/Tuesday/:city" element={<Tuesday />} />
          <Route path="/Wednesday/:city" element={<Wednesday />} />
          <Route path="/Thursday/:city" element={<Thursday />} />
          <Route path="/Friday/:city" element={<Friday />} />
          <Route path="/Saturday/:city" element={<Saturday />} />
          <Route path="/Sunday/:city" element={<Sunday />} />
          <Route path="/WeatherMap" element={<WeatherMap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
