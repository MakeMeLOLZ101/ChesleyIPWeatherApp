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
    '50D': './images/FogIcon.png',
    '50N': './images/FogIcon.png'
};

// Add favorites handling
let favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
let currentCity = null;

function toggleFavorite() {
    if (!currentCity) return;
    
    const cityIndex = favorites.findIndex(fav => fav.name === currentCity.name);
    const starIcon = document.querySelector('.star-icon');
    
    if (cityIndex === -1) {
        favorites.push({
            name: currentCity.name,
            country: currentCity.sys.country
        });
        starIcon.src = './images/StarIconFilled.png';
    } else {
        favorites.splice(cityIndex, 1);
        starIcon.src = './images/StarIcon.png';
    }
    
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
    updateFavoritesMenu();
}

function updateFavoritesMenu() {
    const favoritesMenu = document.querySelector('.favorites-menu');
    if (!favoritesMenu) {
        createFavoritesMenu();
        return;
    }
    
    favoritesMenu.innerHTML = '';
    favorites.forEach(city => {
        const cityElement = document.createElement('div');
        cityElement.classList.add('favorite-city');
        cityElement.textContent = `${city.name}, ${city.country}`;
        cityElement.addEventListener('click', () => loadCity(`${city.name}`));
        favoritesMenu.appendChild(cityElement);
    });
}

function toggleFavoritesMenu() {
    const favoritesMenu = document.querySelector('.favorites-menu');
    const favoritesButton = document.querySelector('.favorites-button');

    favoritesMenu.classList.toggle('active');
    favoritesButton.classList.toggle('active');
}

function createFavoritesMenu() {
    const favoritesContainer = document.createElement('div');
    favoritesContainer.classList.add('favorites-menu');

    document.querySelector('.column-right').appendChild(favoritesContainer);
    updateFavoritesMenu();
}


document.addEventListener('click', (event) => {
    const favoritesMenu = document.querySelector('.favorites-menu');
    const favoritesButton = document.querySelector('.favorites-button');
    
    if (!favoritesButton.contains(event.target) && !favoritesMenu.contains(event.target)) {
        favoritesMenu.classList.remove('active');
        favoritesButton.classList.remove('active');
    }
})

async function loadCity(city) {
    const weatherData = await getWeatherData(city);
    if (weatherData) {
        currentCity = weatherData;
        updateWeatherDisplay(weatherData);
        const forecastData = await getForecastData(city);
        updateForecastDisplay(forecastData);
        
        // Update star icon
        const starIcon = document.querySelector('.star-icon');
        const isFavorite = favorites.some(fav => fav.name === weatherData.name);
        starIcon.src = isFavorite ? './images/StarIconFilled.png' : './images/StarIcon.png';
    }
}

// Update time using System's Clock
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

// Fetch weather data not using System's Clock
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

// Fetch forecast data
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

// Update weather display
function updateWeatherDisplay(data) {
    if (!data) return;
    currentCity = data;
    
    document.querySelector('.city-name').textContent = `${data.name}, ${data.sys.country}`;
    document.querySelector('.current-weather').textContent = data.weather[0].description;
    document.querySelector('.temp-value').textContent = `${Math.round(data.main.temp)}°F`;
    
    const skyIconElement = document.querySelector('.sky-icon');
    const iconCode = data.weather[0].icon;
    const iconPath = weatherIcons[iconCode] || weatherIcons['01d'];
    skyIconElement.innerHTML = `<img src="${iconPath}" alt="weather icon" class="sky-icon-img">`;
}

// Update the forecast display
function updateForecastDisplay(data) {
    if (!data) return;

    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    const forecastDays = document.querySelectorAll('.forecast .day');
    
    dailyForecasts.slice(0, 5).forEach((forecast, index) => {
        if (forecastDays[index]) {
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
        await loadCity(city);
        event.target.value = '';
    }
}

function saveLastCity(cityData) {
    if (!cityData) return;
    const lastCity = {
        name: cityData.name,
        country: cityData.sys.country
    };
    localStorage.setItem('lastViewedCity', JSON.stringify(lastCity));
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.search-box').addEventListener('keypress', handleSearch);
    document.querySelector('.star-icon').addEventListener('click', toggleFavorite);
    document.querySelector('.favorites-button').addEventListener('click', toggleFavoritesMenu);
    createFavoritesMenu();
    updateTime();
    updateDate();
    setInterval(updateTime, 60000);
    
    // Should load last viewed city
    const lastCity = JSON.parse(localStorage.getItem('lastViewedCity'));
    if (lastCity) {
        loadCity(lastCity.name);
    } else {
        // If no last city, will ask for new location
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&appid=${API_KEY}`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        loadCity(data.name);
                    } else {
                        // If that fails, get New York
                        loadCity('New York');
                    }
                } catch (error) {
                    loadCity('New York');
                }
            },
            () => {
                // If your denied, you get New York
                loadCity('New York');
            }
        );
    }
});