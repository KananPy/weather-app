const timeEl = document.querySelector('#time')
const dateEl = document.querySelector('#date')
const currentWeatherItemsEl = document.querySelector('#current-weather-items')
const timeZone = document.querySelector('#time-zone')
const countryEl = document.querySelector('#country')
const weatherForecastEl = document.querySelector('#weather-forecast')
const currentTempEl = document.querySelector('#current-temp')
const addBtn =document.querySelector("#button")
const input = document.querySelector("#inputSearch")

const API_KEY = "ce8adb725959853af1d79d03da42a6aa"

const fetchCurrentWeather = async (location) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`
      );
      const data = await response.json();
      console.log('data', data);
      return data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return null;
    }
  }


  const fetchForecastWeather = async (location) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching forecast weather:', error);
      return null;
    }
  }


  const updateWeatherUI = (currentWeather, forecastWeather) => {
    if (currentWeather) {
      const { main, sys, wind } = currentWeather;
      document.getElementById('time-zone').textContent = sys.country;
      document.getElementById('humidity').textContent = `${main.humidity}%`;
      document.getElementById('pressure').textContent = main.pressure;
      document.getElementById('wind-speed').textContent = `${wind.speed}km/h`;
    }

    if (forecastWeather) {
      const { list } = forecastWeather;
      const today = list[0];
      document.getElementById('current-icon').src = getWeatherIconUrl(today.weather[0].icon);
      document.getElementById('current-night-temp').innerHTML = `Night - ${convertKelvinToCelsius(today.main.temp_min)}&#176; C`;
      document.getElementById('current-day-temp').innerHTML = `Day - ${convertKelvinToCelsius(today.main.temp_max)}&#176; C`;

      for (let i = 1; i <= 3; i++) {
        const forecast = list[i * 8];
        document.getElementById(`forecast-icon-${i}`).src = getWeatherIconUrl(forecast.weather[0].icon);
        document.getElementById(`forecast-night-temp-${i}`).innerHTML = `Night - ${convertKelvinToCelsius(forecast.main.temp_min)}&#176; C`;
        document.getElementById(`forecast-day-temp-${i}`).innerHTML = `Day - ${convertKelvinToCelsius(forecast.main.temp_max)}&#176; C`;
      }
    }
  };

  const convertKelvinToCelsius = (kelvin) => {
    return Math.round(kelvin - 273.15);
  };

  // Helper function to get the URL of the weather icon
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };


  const getWeatherByLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
        const data = await response.json();
        updateWeatherUI(data, null); // Only update the current weather UI
      }, (error) => {
        console.error('Error getting location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  // Function to handle the search button click event
  const handleSearch = async () => {
    const location = document.getElementById('inputSearch').value;
    if (location.trim() !== '') {
      const currentWeather = await fetchCurrentWeather(location);
      const forecastWeather = await fetchForecastWeather(location);
      updateWeatherUI(currentWeather, forecastWeather);
    }
  };

  // Attach event listener to the search button
  document.getElementById('button').addEventListener('click', handleSearch);

  document.getElementById('locationButton').addEventListener('click', getWeatherByLocation);
