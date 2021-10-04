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
var displayWeather = document.getElementById('display-weather');

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
                // get city name
                console.log(city_name);
                // get the data points we want
                // get date (dt), icon (icon), temp (temp), humidity (humidity), wind speed, and uv index (uvi)
                console.log("current: " + data.current);
                console.log("humidity: " + data.current.humidity);
                var currentHumidity = data.current.humidity;
                console.log("temperature: " + data.current.temp);
                var currentTemperature = data.current.temp;
                console.log("uvi: " + data.current.uvi);
                var currentUVI = data.current.uvi;
                console.log("date: " + data.current.dt);
                var currentDate = data.current.dt;
                console.log("wind speed: " + data.current.wind_speed);
                var currentWind = data.current.wind_speed;
                console.log("wind degree: " + data.current.wind_deg);
                var currentWindDir = data.current.wind_deg;
                console.log("weather desc: " + data.current.weather[0].description);
                var currentDescription = data.current.weather[0].description;
                console.log("weather icon: " + data.current.weather[0].icon);
                var currentIcon = data.current.weather[0].icon;
                console.log("weather status: " + data.current.weather[0].main);
                var currentStatus = data.current.weather[0].main;
                // create div to hold the current weather results
                var currentWeatherResults = document.createElement('div');
                // create bootsrap html object and populate current weather results
                currentWeatherResults.innerHTML = `
                <div class="card mb-3">
                    <div class="column no-gutters">
                        <div class="card-body d-flex justify-content-center">
                            <h3 class="card-title">${city_name}</h3>
                            <p class="card-text"><small class="text-muted">${currentDate}</small></p>
                            <div class="row">
                                <div class="d-flex justify-content-center col-5">
                                    <div>${currentIcon}</div>
                                    <p>${currentStatus}</p>
                                </div>
                                <div class="d-flex justify-content-left col-5">
                                    <div class="column">
                                        <div class="row">
                                            <p class="card-text">${currentTemperature}</p>
                                            <p class="card-text">${currentUVI}</p>
                                            <p class="card-text">${currentHumidity}</p>
                                        </div>
                                        <div class="row">
                                            <p class="card-text">${currentWind}</p>
                                            <p class="card-text">${currentWindDir}</p>
                                            <p class="card-text">${currentDescription}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
                // append card to the display weather div
                displayWeather.appendChild(currentWeatherResults);
                // add bootsrtap classes to daily results div
                currentWeatherResults.setAttribute("class", "row d-flex justify-content-center");
                // TODO = Make sure it all works
                // TODO = Adjust styles and data values to make it work properly
                // Under the current day, show the 5-day forecast for the city with date, humidity, min and max temp, wind speed,
                console.log(data.daily)
                for (let i = 1; i < 6; i++) {
                    console.log(data.daily[i]);
                    console.log("humidity: " + data.daily[i].humidity);
                    var dailyHumidity = data.daily[i].humidity;
                    console.log("max temperature: " + data.daily[i].temp.max);
                    var dailyMax = data.daily[i].temp.max;
                    console.log("min temperature: " + data.daily[i].temp.min);
                    var dailyMin = data.daily[i].temp.min;
                    console.log("date: " + data.daily[i].dt);
                    var dailyDate = data.daily[i].dt;
                    console.log("wind speed: " + data.daily[i].wind_speed);
                    var dailyWind = data.daily[i].wind_speed;
                    console.log("weather desc: " + data.daily[i].weather[0].description);
                    var dailyDescription = data.daily[i].weather[0].description;
                    console.log("weather icon: " + data.daily[i].weather[0].icon);
                    var dailyIcon = data.daily[i].weather[0].icon;
                    console.log("weather status: " + data.daily[i].weather[0].main);
                    var dailyStatus =  data.daily[i].weather[0].main;
                    // create div to append to the display weather section
                    var dailyWeatherResults = document.createElement("div");
                    // dynamic set inner html to be a bootstrap card with extracted API weather values
                    dailyWeatherResults.innerHTML = `<div class="card border-success mb-3" style="max-width: 12rem;">
                        <div class="card-header bg-transparent border-success text-align-center">${dailyDate}</div>
                        <div class="card-body text-success">
                            <div class="d-flex justify-content-center"> 
                                <div>${dailyIcon}</div>
                                <p class="card-text">${dailyStatus}</p>
                            </div>
                            <div>
                                <div class="row d-flex justify-content-around">
                                    <p class="card-text">${dailyMin}</p>
                                    <p class="card-text">${dailyMax}</p>
                                </div>
                                <div class="row d-flex justify-content-around">
                                    <p class="card-text">${dailyWind}</p>
                                    <p class="card-text">${dailyHumidity}</p>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer bg-transparent border-success d-flex justify-content-center text-align-center">
                            ${dailyDescription}
                        </div>
                    </div>`
                    // append card to the display weather div
                    displayWeather.appendChild(dailyWeatherResults);
                    // add bootsrtap classes to daily results div
                    dailyWeatherResults.setAttribute("class", "row d-flex justify-content-center");
                }
            });
		} else {
			console.log('ERROR BRO!');
		}
	});
}

// TODO - When the cities in the previous searches unordered list are clicked, then the weather for that clicked city is displayed again