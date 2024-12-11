import { API_KEY } from './weather.js';

        const weatherIcons = {
            '01d': './images/SunnyIcon.png',
            '01n': './images/SunnyIcon.png',
            '02d': './images/PartlyClearIcon.png',
            '02n': './images/PartlyClearIcon.png',
            '03d': './images/PartlyClearIcon.png',
            '03n': './images/PartlyClearIcon.png',
            '04d': './images/CloudIcon.png',
            '04n': './images/CloudIcon.png',
            '09d': './images/RainyIcon.png',
            '09n': './images/RainyIcon.png',
            '10d': './images/RainyIcon.png',
            '10n': './images/RainyIcon.png',
            '11d': './images/StormyIcon.png',
            '11n': './images/StormyIcon.png',
            '13d': './images/SnowIcon.png',
            '13n': './images/SnowIcon.png',
            '50d': './images/FogIcon.png',
            '50n': './images/FogIcon.png'
        };

        function updateTime() {
            const now = new Date();
            const timeDisplay = now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            document.querySelector('.time').textContent = timeDisplay;
        }

        // Update date using System's Clock
        function updateDate() {
            const now = new Date();
            const dateDisplay = now.toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            document.querySelector('.date').textContent = dateDisplay;
        }

        // Fetch weather data
        async function getWeatherData(city) {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`);
                if (!response.ok) {
                    throw new Error('City not found');
                }
                const data = await response.json();
                return data;
            } catch (error) {
                showError(error.message);
                return null;
            }
        }

        // Fetch future weather data
        async function getForecastData(city) {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${API_KEY}`);
                if (!response.ok) {
                    throw new Error('Forecast data not available');
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching forecast:', error);
                return null;
            }
        }

        // Weather display
        function updateWeatherDisplay(data) {
            if (!data) return;

            document.querySelector('.city-name').textContent = `${data.name}, ${data.sys.country}`;
            document.querySelector('.current-weather').textContent = data.weather[0].description;
            document.querySelector('.temp-value').textContent = `${Math.round(data.main.temp)}°F`;
            
            const skyIconElement = document.querySelector('.sky-icon');
            const iconCode = data.weather[0].icon;
            const iconPath = weatherIcons[iconCode] || weatherIcons['01d'];
            skyIconElement.innerHTML = `<img src="${iconPath}" alt="weather icon" class="sky-icon-img">`;
        }

        // To Update the forecast display
        function updateForecastDisplay(data) {
            if (!data) return;

            const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));
            const forecastDays = document.querySelectorAll('.forecast .day');
            
            dailyForecasts.slice(0, 5).forEach((forecast, index) => {
                if (forecastDays[index]){
                const date = new Date(forecast.dt * 1000);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                const dayNumber = date.getDate();

                forecastDays[index].querySelector('.day-name').textContent = dayName;
                forecastDays[index].querySelector('.date').textContent = dayNumber;
                const weatherIconElement = forecastDays[index].querySelector('.weather-icon-img');
                const iconCode = forecast.weather[0].icon;
                const iconPath = weatherIcons[iconCode] || weatherIcons['01d'];
                weatherIconElement.innerHTML = `<img src="${iconPath}" alt="weather icon" class="weather-icon-img">`;
                }
            });
        }

        // Show error message
        function showError(message) {
            const errorElement = document.querySelector('.error-message');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 3000);
        }

        // Search bar
        async function handleSearch(event) {
            if (event.key === 'Enter') {
                const city = event.target.value.trim();
                if (!city) return;

                const weatherData = await getWeatherData(city);
                if (weatherData) {
                    updateWeatherDisplay(weatherData);
                    const forecastData = await getForecastData(city);
                    updateForecastDisplay(forecastData);
                    event.target.value = '';
                }
            }
        }

        document.querySelector('.search-box').addEventListener('keypress', handleSearch);
        updateTime();
        updateDate();
        setInterval(updateTime, 60000);

        // Load default city
        window.addEventListener('load', async () => {
            const defaultCity = 'Stockton';
            const weatherData = await getWeatherData(defaultCity);
            if (weatherData) {
                updateWeatherDisplay(weatherData);
                const forecastData = await getForecastData(defaultCity);
                updateForecastDisplay(forecastData);
            }
        });