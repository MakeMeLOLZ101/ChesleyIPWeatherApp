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

        document.querySelector('.search-box').addEventListener('keypress', handleSearch);
        updateTime();
        updateDate();
        setInterval(updateTime, 60000);