const express = require('express');
const axios = require('axios');
const path = require('path');

// Utworzenie aplikacji Express
const app = express();

// Port, na ktorym aplikacja bedzie nasluchiwac
const PORT = 8080;

// Klucz API do komunikacji z API OpenWeather
const API_KEY = 'b90b0bd6be4ad04309ae3da24ee3b87b';

// Informacje wyswietlane w logach
console.log(`Data uruchomienia: ${new Date().toISOString()}`);
console.log('Autor: Robert Horbaczewski');
console.log(`Nasłuchiwanie na porcie TCP: ${PORT}`);

// Udostepnienie plikow statycznych z katalogu public
app.use(express.static('public'));

// Lista krajow i miast do wyboru w aplikacji
const locations = {
    Polska: ['Lublin', 'Wlodawa'],
    Finlandia: ['Helsinki', 'Somero']
};

// Mapowanie nazw na kody dla API OpenWeather
const countryCodes = {
    Polska: 'PL',
    Finlandia: 'FI'
};

// Endpoint pobierajacy aktualne informacje o pogodzie
app.get('/weather', async (req, res) => {
    try {
        const city = req.query.city;
        const country = req.query.country;
        const countryCodes = {
            Polska: 'PL',
            Finlandia: 'FI'
        };

        const countryCode = countryCodes[country];
        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${API_KEY}&units=metric&lang=pl`;
        const response = await axios.get(url);
        const weatherData = {
            city: city,
            temperature: response.data.main.temp,
            description: response.data.weather[0].description,
            humidity: response.data.main.humidity
        };
        res.json(weatherData);
    } catch (error) {
        console.log(error.response?.data || error.message);
        res.status(500).json({
            error: 'Błąd pobierania pogody'
        });
    }
});

// Uruchomienie serwera aplikacji
app.listen(PORT, () => {
    console.log('Serwer działa poprawnie');
});