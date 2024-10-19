import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

// Set default Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Map component to capture clicks and fetch lat/lon
const MapComponent = ({ setLat, setLon }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLat(lat);
      setLon(lng);
    },
  });

  return null;
};

const WeatherData = () => {
  const [weatherData, setWeatherData] = useState({});
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [error, setError] = useState('');

  // OpenWeather API key
  const openWeatherApiKey = '6682c79d2eb8d37830421eb6a565352c';

  const fetchWeatherData = async () => {
    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`
      );

      const aqiRes = await axios.get(
        `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}`
      );

      // Rainfall in mm (if any)
      const rainfall = weatherRes.data.rain ? weatherRes.data.rain['1h'] || 0 : 0;

      setWeatherData({
        temperature: weatherRes.data.main.temp,
        humidity: weatherRes.data.main.humidity,
        rainfall: rainfall, // in mm, 0 means no rain
        aqi: aqiRes.data.list[0].main.aqi,
        location: `${weatherRes.data.name}, ${weatherRes.data.sys.country}`,
      });
    } catch (err) {
      setError('Failed to fetch weather data. Please check the coordinates.');
      console.error(err);
    }
  };

  useEffect(() => {
    if (lat !== null && lon !== null) {
      fetchWeatherData();
    }
  }, [lat, lon]); // Fetch weather data whenever lat or lon changes

  // Bar chart data for weather parameters
  const chartData = {
    labels: ['Temperature', 'Humidity', 'Rainfall (mm)', 'AQI'],
    datasets: [
      {
        label: 'Weather Data',
        data: [
          weatherData.temperature,
          weatherData.humidity,
          weatherData.rainfall,
          weatherData.aqi,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Weather Data</h1>

      <div className="mt-4 p-4">
        <p>Click on the map to get coordinates!</p>
        <MapContainer
          center={[51.505, -0.09]} // Default center [lat, lon]
          zoom={13}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapComponent setLat={setLat} setLon={setLon} />
          {lat && lon && <Marker position={[lat, lon]}></Marker>}
        </MapContainer>
      </div>

      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {weatherData.temperature && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold">Weather in {weatherData.location}</h2>
          <p>Temperature: {weatherData.temperature} °C</p>
          <p>Humidity: {weatherData.humidity} %</p>
          <p>Rainfall: {weatherData.rainfall === 0 ? 'No Rain' : `${weatherData.rainfall} mm`}</p>
          <p>AQI: {getAQILevel(weatherData.aqi)}</p>
        </div>
      )}

      {weatherData.temperature && (
        <div className="mt-6">
          <Bar data={chartData} />
        </div>
      )}
    </div>
  );
};

const getAQILevel = (aqi) => {
  switch (aqi) {
    case 1:
      return 'Good';
    case 2:
      return 'Fair';
    case 3:
      return 'Moderate';
    case 4:
      return 'Poor';
    case 5:
      return 'Very Poor';
    default:
      return 'Unknown';
  }
};

export default WeatherData;