# Weather App

 A lightweight browser-based weather app that shows current weather, a 5-day forecast, and an embedded map for queried locations using the OpenWeatherMap API.

## Features
- Search by city or country name (press Enter or click Search)
- Current temperature, description, humidity, and icon
- 5-day forecast (daily snapshots) based on 3-hour forecast data
- Embedded Google Map centered on the location
- Animated backgrounds that reflect the current weather

## Prerequisites
- A modern web browser (Chrome, Edge, Firefox, Safari)
- Internet connection (fetches data from OpenWeatherMap and Google Maps)

Note: This project includes a built-in OpenWeatherMap API key inside `script.js`. For production or public sharing, replace it with your own API key and do not commit it to public repositories.

## Usage
1. Open `index.html` in your browser (double-click or use `Open File...` in the browser).
2. Type a city (for example: `London` or `San Francisco`) and press Enter or click the `Search` button.
3. The main view will show current weather and the bottom area will show a forecast and map.

## Files
- `index.html` — UI markup and input elements
- `style.css` — Styles and animated background classes
- `script.js` — Fetches weather/forecast, updates UI, and embeds map

## Customization
- To change the default city shown on load, edit `defaultLocation` in `script.js`.
- To use your own OpenWeatherMap API key, replace the `apiKey` variable at the top of `script.js` with your key.

## License
This project is provided as-is. Add a license file if you intend to publish it.


