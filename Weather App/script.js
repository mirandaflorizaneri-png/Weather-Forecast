const apiKey = "092b9058489d82e7034c4407c9497fc7";

const defaultLocation = 'San Francisco';

const refs = {
    searchBtn: document.getElementById('searchBtn'),
    cityInput: document.getElementById('cityInput'),
    message: document.getElementById('message'),
    cityName: document.getElementById('cityName'),
    date: document.getElementById('date'),
    temperature: document.getElementById('temperature'),
    description: document.getElementById('description'),
    humidity: document.getElementById('humidity'),
    weatherIcon: document.getElementById('weatherIcon'),
    mapFrame: document.getElementById('mapFrame'),
    forecast: document.getElementById('forecast')
};
refs.weatherBg = document.getElementById('weatherBg');


function applyWeatherBackground(wData) {
    if (!refs.weatherBg) return;
    
    refs.weatherBg.className = 'weather-bg';

    if (!wData || !wData.weather || !wData.weather[0]) return;
    const main = (wData.weather[0].main || '').toLowerCase();
    const desc = (wData.weather[0].description || '').toLowerCase();
    const windSpeed = (wData.wind && typeof wData.wind.speed === 'number') ? wData.wind.speed : 0;

  
    if (main.includes('thunder')) refs.weatherBg.classList.add('bg-thunder');
    else if (main.includes('snow')) refs.weatherBg.classList.add('bg-snow');
    else if (main.includes('rain') || main.includes('drizzle')) refs.weatherBg.classList.add('bg-rain');
    else if (main.includes('clear')) refs.weatherBg.classList.add('bg-sunny');
    else if (main.includes('cloud')) refs.weatherBg.classList.add('bg-cloudy');
    else if (main.includes('mist') || main.includes('fog') || main.includes('haze')) refs.weatherBg.classList.add('bg-fog');
    else if (windSpeed >= 10 || desc.includes('wind')) refs.weatherBg.classList.add('bg-windy');
    else refs.weatherBg.classList.add('bg-cloudy');
}

function setMessage(text, type = 'info') {
    refs.message.textContent = text;
    refs.message.className = `message ${type}`;
}

function setLoading(isLoading) {
    refs.searchBtn.disabled = isLoading;
    refs.cityInput.disabled = isLoading;
    if (isLoading) {
        setMessage('Loading…', 'loading');
    }
}

refs.searchBtn.addEventListener('click', () => {
    const city = refs.cityInput.value.trim();
    if (!city) return setMessage('Please enter a city or country name.', 'error');
    getWeather(city);
});


refs.cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') refs.searchBtn.click();
});


document.addEventListener('DOMContentLoaded', () => {
    const inputCity = refs.cityInput.value.trim();
    const initialCity = inputCity || defaultLocation;
    if (initialCity) {
        getWeather(initialCity).catch(() => {
            setMessage('Unable to load default location.', 'error');
        });
    } else {
        setMessage('Enter a city or country to begin.', 'info');
    }
});

async function getWeather(location) {
    try {
        setLoading(true);

      
        const wRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`);
        if (!wRes.ok) {
            const err = await wRes.json().catch(() => ({}));
            throw new Error(err.message || 'Location not found');
        }
        const wData = await wRes.json();

       
        refs.cityName.innerText = wData.name || location;
        refs.date.innerText = new Date().toLocaleString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
        refs.temperature.innerText = `${Math.round(wData.main.temp)}°C`;
        const desc = wData.weather && wData.weather[0] && wData.weather[0].description ? wData.weather[0].description : 'N/A';
        refs.description.innerText = desc.replace(/\b\w/g, c => c.toUpperCase());
        refs.humidity.innerText = `Humidity: ${wData.main.humidity}%`;

        const icon = wData.weather && wData.weather[0] && wData.weather[0].icon ? wData.weather[0].icon : null;
        if (icon) {
            refs.weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            refs.weatherIcon.alt = desc;
            refs.weatherIcon.loading = 'lazy';
        } else {
            refs.weatherIcon.src = '';
            refs.weatherIcon.alt = 'No icon';
        }

       
        if (wData.coord && typeof wData.coord.lat === 'number' && typeof wData.coord.lon === 'number') {
            refs.mapFrame.src = `https://www.google.com/maps?q=${wData.coord.lat},${wData.coord.lon}&z=10&output=embed`;
        }

       
        try { applyWeatherBackground(wData); } catch (e) {  }

        setMessage('Weather loaded.', 'success');

    } catch (err) {
        setMessage(err.message || 'Location not found', 'error');
        throw err;
    } finally {
        setLoading(false);
      
        loadForecast(location).catch(() => setMessage('Forecast unavailable.', 'warning'));
    }
}

async function loadForecast(location) {
    try {
        const fRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`);
        if (!fRes.ok) throw new Error('Forecast not available');
        const fData = await fRes.json();

        refs.forecast.innerHTML = '';
        if (!fData.list || !fData.list.length) return;

        
        for (let i = 0; i < fData.list.length; i += 8) {
            const day = fData.list[i];
            const card = document.createElement('div');
            card.className = 'forecast-card';

            const dateEl = document.createElement('h4');
            dateEl.innerText = new Date(day.dt_txt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

            const img = document.createElement('img');
            img.src = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
            img.alt = day.weather[0].description || 'Weather icon';
            img.loading = 'lazy';

            const temp = document.createElement('p');
            temp.innerText = `${Math.round(day.main.temp)}°C`;

            card.appendChild(dateEl);
            card.appendChild(img);
            card.appendChild(temp);

            refs.forecast.appendChild(card);
        }
    } catch (err) {
        refs.forecast.innerHTML = '';
        throw err;
    }
}
