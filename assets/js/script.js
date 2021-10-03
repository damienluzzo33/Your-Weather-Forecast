// store open weather API key
var API_key = '5962ba4bf00030115c5c6bf02a21e266';
// temporarily hard code main params
var longitude, latitude, callFiveDayAPI, oneCallAPI;
var city_name = 'austin';
var part = 'hourly,minutely' 
// link to the input, the button, and the unordered list so we can add event listeners to the
var cityInput = document.getElementById('city-name');
var saveButton = document.getElementById('submit');
var savedSearches = document.getElementById('saved-searches');

// create function to gather coordinates from the Five Day API
function getCoordinates() {
    // assign string template literal to API url for 5 day
    callFiveDayAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${city_name}&appid=${API_key}`;
	// fetch from the five day api
	fetch(callFiveDayAPI)
        // then run this function
        .then(function(response) {
        // if the response was successful
		if (response.ok) {
            // convert response to json and then run function with data
			response.json().then(function(data) {
				console.log(data.city.coord);
                // get the latitude and longitude of the city searched
				latitude = data.city.coord.lat;
				longitude = data.city.coord.lon;
                // use latitude and longitude to get data from one call api
                getWeatherOneDay(latitude, longitude);
			});
            // otherwise, throw an error message to console
		} else {
			console.log('ERROR BRO!');
		}
	});
}

getCoordinates();

// create function that uses latitude and longitude from the 5 day api to use as parameters to then use the one call api
function getWeatherOneDay(latitude, longitude) {
    // assign string template literal to API url for one call
    oneCallAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=${part}&appid=${API_key}`;
    console.log(oneCallAPI);
    // fetch one call API
	fetch(oneCallAPI).then(function(response) {
        // if the response is successful
		if (response.ok) {
            // turn response into json and then
			response.json().then(function(data) {
                console.log(data);
                // get city name
                console.log(city_name);
                // get the data points we want
                // get date (dt), icon (icon), temp (temp), humidity (humidity), wind speed, and uv index (uvi)
                console.log("current: " + data.current);
                console.log("humidity: " + data.current.humidity);
                console.log("temperature: " + data.current.temp);
                console.log("uvi: " + data.current.uvi);
                console.log("date: " + data.current.dt);
                console.log("wind speed: " + data.current.wind_speed);
                console.log("weather desc: " + data.current.weather[0].description);
                console.log("weather icon: " + data.current.weather[0].icon);
                console.log("weather status: " + data.current.weather[0].main);
                // Under the current day, show the 5-day forecast for the city with date, humidity, min and max temp, wind speed,
                console.log(data.daily)
                for (let i = 1; i < 6; i++) {
                    console.log(data.daily[i]);
                    console.log(data.daily[i].humidity);
                    console.log(data.daily[i].temp.max);
                    console.log(data.daily[i].temp.min);
                    console.log(data.daily[i].dt);
                    console.log(data.daily[i].wind_speed);
                    console.log(data.daily[i].weather[0].description);
                    console.log(data.daily[i].weather[0].icon);
                    console.log(data.daily[i].weather[0].main);
                }
            });
		} else {
			console.log('ERROR BRO!');
		}
	});
}

// TODO - When the cities in the previous searches unordered list are clicked, then the weather for that clicked city is displayed again