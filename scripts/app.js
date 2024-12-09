const API_KEY = 'e44975c9d8c160c0d4cf7624985cebf2';

        // Fetch weather data
        async function getWeatherData(city) {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
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
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`);
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
            document.querySelector('.temp-value').textContent = `${Math.round(data.main.temp)}°`;
            document.querySelector('.sky-icon').textContent = weatherIcons[data.weather[0].icon] || '';
        }

        // To Update the forecast display
        function updateForecastDisplay(data) {
            if (!data) return;

            const forecastContainer = document.querySelector('.forecast');
            forecastContainer.innerHTML = '';

            const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));
            
            dailyForecasts.slice(0, 7).forEach((forecast, index) => {
                const date = new Date(forecast.dt * 1000);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                const dayNumber = date.getDate();

                const dayElement = document.createElement('div');
                dayElement.className = 'day';
                dayElement.innerHTML = `
                    <div class="day-name">${dayName}</div>
                    <div class="date">${dayNumber}</div>
                    <div class="weather-icon">${weatherIcons[forecast.weather[0].icon] || ''}</div>
                `;
                forecastContainer.appendChild(dayElement);
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