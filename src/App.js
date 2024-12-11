import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './App.css'

const API_KEY = 'fc5d75006d774abd97352837241112'

function App() {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [unit, setUnit] = useState('C')
  const [error, setError] = useState(null)

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  const fetchWeather = async cityName => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}`,
      )
      setWeatherData(response.data)
      setError(null)
    } catch (err) {
      setError('Unable to fetch weather data. Please check the city name.')
      setWeatherData(null)
    }
  }

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeather(city)
    }
  }

  const toggleUnit = () => {
    setUnit(prevUnit => (prevUnit === 'C' ? 'F' : 'C'))
  }

  const addToFavorites = () => {
    if (city && !favorites.includes(city)) {
      const updatedFavorites = [...favorites, city]
      setFavorites(updatedFavorites)
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    }
  }

  const handleFavoriteClick = favoriteCity => {
    fetchWeather(favoriteCity)
  }

  return (
    <div className="app">
      <h1>Weather Dashboard</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={e => setCity(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <button className="unit-toggle" onClick={toggleUnit}>
        {unit === 'C' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
      </button>
      <div className="favorites">
        <h3>Favorite Cities</h3>
        {favorites.length > 0 ? (
          <ul>
            {favorites.map(favCity => (
              <li key={favCity} onClick={() => handleFavoriteClick(favCity)}>
                {favCity}
              </li>
            ))}
          </ul>
        ) : (
          <p>No favorite cities yet.</p>
        )}
      </div>
      {error && <p className="error">{error}</p>}
      {weatherData && (
        <div className="weather-card">
          <h2>{`Weather in ${weatherData.location.name}`}</h2>
          <p>
            {`Temperature: ${
              unit === 'C'
                ? weatherData.current.temp_c
                : weatherData.current.temp_f
            }°${unit}`}
          </p>
          <p>{`Humidity: ${weatherData.current.humidity}%`}</p>
          <p>
            {`Wind Speed: ${
              unit === 'C'
                ? weatherData.current.wind_kph + ' kph'
                : (weatherData.current.wind_kph * 0.621371).toFixed(2) + ' mph'
            }`}
          </p>
          <p>{`Condition: ${weatherData.current.condition.text}`}</p>
          <img
            src={weatherData.current.condition.icon}
            alt={weatherData.current.condition.text}
          />
          <button onClick={addToFavorites}>Save to Favorites</button>
        </div>
      )}
    </div>
  )
}

export default App
