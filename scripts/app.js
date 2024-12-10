const API_KEY = 'e44975c9d8c160c0d4cf7624985cebf2';
        const weatherIcons = {
            '01d': '☀️',
            '01n': '🌙',
            '02d': '⛅',
            '02n': '☁️',
            '03d': '☁️',
            '03n': '☁️',
            '04d': '☁️',
            '04n': '☁️',
            '09d': '🌧️',
            '09n': '🌧️',
            '10d': '🌦️',
            '10n': '🌧️',
            '11d': '⛈️',
            '11n': '⛈️',
            '13d': '🌨️',
            '13n': '🌨️',
            '50d': '🌫️',
            '50n': '🌫️'
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

        // To Update the weather display
        function updateWeatherDisplay(data) {
            if (!data) return;

            document.querySelector('.city-name').textContent = `${data.name}, ${data.sys.country}`;
            document.querySelector('.current-weather').textContent = data.weather[0].description;
            document.querySelector('.temp-value').textContent = `${Math.round(data.main.temp)}°F`;
            document.querySelector('.sky-icon').textContent = weatherIcons[data.weather[0].icon] || '';
        }

        // To Update the forecast display
        function updateForecastDisplay(data) {
            if (!data) return;

            const forecastContainer = document.querySelector('.forecast');
            forecastContainer.innerHTML = '';

            const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));
            const forecastDays = document.querySelectorAll('.forecast .day')

            dailyForecasts.slice(0, 5).forEach((forecast, index) => {
                if (forecastDays[index]){
                const date = new Date(forecast.dt * 1000);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                const dayNumber = date.getDate();

                forecastDays[index].querySelector('.day-name').textContent = dayName;
                forecastDays[index].querySelector('.date').textContent = dayNumber;
                forecastDays[index].querySelector('.weather-icon').textContent = weatherIcons[forecast.weather[0].icon] || '☀️';
                }
            });
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

        // Initial setup
        document.querySelector('.search-box').addEventListener('keypress', handleSearch);
        updateTime();
        updateDate();
        setInterval(updateTime, 60000);