const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'ejs');

const apiKey = `${process.env.API_KEY}`;
console.log(apiKey);

app.get('/', (req, res) => {
  res.render('index', { weather: null, error: null });
});

app.post('/', (req, res) => {
  let city = req.body.city;

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  https.get(url, (response) => {
    response.on('data', (data) => {
      let weather = JSON.parse(data);
      // you shall output it in the console just to make sure that the data being displayed is what you want

      if (weather.main == undefined) {
        res.render('index', {
          weather: null,
          error: 'Error, please try again',
        });
      } else {
        // we shall use the data got to set up your output
        let place = `${weather.name}, ${weather.sys.country}`,
          /* you shall calculate the current timezone using the data fetched*/
          weatherTimezone = `${new Date(
            weather.dt * 1000 - weather.timezone * 1000
          )}`;
        let weatherTemp = `${weather.main.temp}`,
          weatherPressure = `${weather.main.pressure}`,
          /* you will fetch the weather icon and its size using the icon data*/
          weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
          weatherDescription = `${weather.weather[0].description}`,
          humidity = `${weather.main.humidity}`,
          clouds = `${weather.clouds.all}`,
          visibility = `${weather.visibility}`,
          main = `${weather.weather[0].main}`,
          weatherFahrenheit;
        weatherFahrenheit = (weatherTemp * 9) / 5 + 32;

        res.render('index', {
          weather: weather,
          place: place,
          temp: weatherTemp,
          pressure: weatherPressure,
          icon: weatherIcon,
          description: weatherDescription,
          timezone: weatherTimezone,
          humidity: humidity,
          fahrenheit: weatherFahrenheit,
          clouds: clouds,
          visibility: visibility,
          main: main,
          error: null,
        });
      }
    });
  });
});

app.listen(3000, (req, res) => {
  console.log('server is listening on port 3000...');
});
