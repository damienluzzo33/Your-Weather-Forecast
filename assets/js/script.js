// store open weather API key
var API_key = '5962ba4bf00030115c5c6bf02a21e266';
// temporarily hard code main params
var longitude, latitude, callFiveDayAPI, oneCallAPI;
var city_name;
var response;
var part = 'hourly,minutely' 
// link to the input, the button, and the unordered list so we can add event listeners to the
var cityInput = document.getElementById('city-name');
var saveButton = document.getElementById('submit');
var savedSearches = document.getElementById('saved-searches');
var mainDiv = document.getElementById('display-weather');

JSON.parse(localStorage.getItem("userStorage"))

saveButton.addEventListener("click", function(event) {
    event.preventDefault();
    city_name = "";
    mainDiv.innerHTML = "";
    response = cityInput.value;
    city_name = response;
    getCoordinates(city_name);
    // create a list item and append the search result list item to the saved searches ul
    var newListItem = document.createElement('li');
    newListItem.setAttribute("class", "list-group-item");
    newListItem.textContent = city_name;
    newListItem.addEventListener("click", function(event){
        mainDiv.innerHTML = "";
        city_name = event.target.textContent;
        getCoordinates(`${city_name}`);
    })
    savedSearches.appendChild(newListItem);
    // if there is a result, store search list item in local storage
    localStorage.setItem("userStorage", JSON.stringify(savedSearches));
    // <li class="list-group-item"><a href="">Text Here</a></li>
});

// create function to gather coordinates from the Five Day API
function getCoordinates(cityName) {
    // assign string template literal to API url for 5 day
    callFiveDayAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_key}`;
	// fetch from the five day api
	fetch(callFiveDayAPI)
        // then run this function
        .then(function(response) {
        // if the response was successful
		if (response.ok) {
            // convert response to json and then run function with data
			response.json().then(function(data) {
                // get the latitude and longitude of the city searched
				latitude = data.city.coord.lat;
				longitude = data.city.coord.lon;
                // use latitude and longitude to get data from one call api
                getWeatherOneDay(latitude, longitude);
			});
            // otherwise, throw an error message to console
		} else {
			alert("That's NOT a city. Enter a REAL city please.");
		}
	});
}

// create function that uses latitude and longitude from the 5 day api to use as parameters to then use the one call api
function getWeatherOneDay(latitude, longitude) {
    // assign string template literal to API url for one call
    oneCallAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=${part}&appid=${API_key}`;
    // fetch one call API
	fetch(oneCallAPI).then(function(response) {
        // if the response is successful
		if (response.ok) {
            // turn response into json and then
			response.json().then(function(data) {
                // get the data points we want
                // get date (dt), icon (icon), temp (temp), humidity (humidity), wind speed, and uv index (uvi)
                var currentHumidity = data.current.humidity;
                // convert Kelvin to Fahrenheit 
                var currentTemperature = (Math.round(data.current.temp-273.15)*(9/5) + 32);
                // convert unix time to the proper data format
                var currentUVI = data.current.uvi;
                // get date time and convert it to a locale date string as well as the day of the week
                var currentDateTime = new Date(data.current.dt*1000);
                var currentDate = currentDateTime.toLocaleDateString("en-US");
                var currentDay = currentDateTime.getDay();
                    if (currentDay === 1) currentDay = "Monday";
                    else if (currentDay === 2) currentDay = "Tuesday";
                    else if (currentDay === 3) currentDay = "Wednesday";
                    else if (currentDay === 4) currentDay = "Thursday";
                    else if (currentDay === 5) currentDay = "Friday";
                    else if (currentDay === 6) currentDay = "Saturday";
                    else if (currentDay === 0) currentDay = "Sunday";
                // get the wind speed and the wind degrees direction
                // TODO convert degrees to direction
                var currentWind = Math.round(data.current.wind_speed);
                var currentWindDir = data.current.wind_deg;
                // get the weather description and convert it to a nicer string
                var currentDescription = data.current.weather[0].description;
                var properCurrentDescription = "";
                var statusArr = currentDescription.split(" ");
                if (statusArr.length === 1) {
                    var lowers = statusArr[i].slice(1);
                    var upper = statusArr[i][0].toUpperCase();
                    properCurrentDescription = properCurrentDescription.concat(upper);
                    properCurrentDescription = properCurrentDescription.concat(lowers);
                } else {
                for (var i=0; i<statusArr.length; i++) {
                    var lowers = statusArr[i].slice(1);
                    var upper = statusArr[i][0].toUpperCase();
                    if (i === statusArr.length - 1) {
                        properCurrentDescription = properCurrentDescription.concat(upper);
                        properCurrentDescription = properCurrentDescription.concat(lowers);
                    } else {
                        properCurrentDescription = properCurrentDescription.concat(upper);
                        properCurrentDescription = properCurrentDescription.concat(lowers);
                        properCurrentDescription = properCurrentDescription.concat(" ");
                        }
                    }
                }
                // get the weather icon
                var currentIcon = data.current.weather[0].icon;
                // convert icon id to icon image url
                var currentIconURL = `http://openweathermap.org/img/wn/${currentIcon}@2x.png`
                // get the weather status
                var currentStatus = data.current.weather[0].main;
                console.log(currentStatus);
                // create div to hold the current weather results
                var currentWeatherResults = document.createElement('div');
                // give the div for current weather classes
                currentWeatherResults.setAttribute("class", "container d-flex justify-content-center");
                currentWeatherResults.setAttribute("style", "max-width: 52rem;")
                // create bootstrap html object and populate current weather results
                currentWeatherResults.innerHTML = `
                <div class="card mb-3" style="min-width: 30rem;">
                    <div class="container">
                        <div class="card-body row d-flex justify-content-center text-center">
                            <h3 class="col-12 card-title">${city_name}</h3>
                            <p class="col-12 card-text"><small class="text-muted">${currentDay} ${currentDate}</small></p>
                            <div class="row col-12 text-center d-flex justify-content-center">
                                <div class="row d-flex justify-content-center col-12 icon-container" style="max-width: 30rem; max-height: 30rem;"> 
                                    <img class="col-12 text-center pb-0 mb-0" style="max-height: 20rem; max-width: 20rem;" src="${currentIconURL}" alt="current weather icon">
                                    <p class="col-12 card-text text-center status-text-main status pt-0 mt-0">${properCurrentDescription}</p>
                                </div>
                                <div class="card-body">
                                    <p class="card-text current-details">Temp: ${currentTemperature} F</p>
                                    <p class="card-text current-details" id="uv-index">UVI: ${currentUVI}</p>
                                    <p class="card-text current-details">Humidity: ${currentHumidity}%</p>
                                    <p class="card-text current-details">Wind: ${currentWind} mph ${currentWindDir}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
                // append card to the display weather div
                mainDiv.appendChild(currentWeatherResults);
                
                var dailyWeather = document.createElement('div');
                dailyWeather.setAttribute("class", "container d-flex justify-content-center flex-wrap")
                // append daily weather to the main div
                mainDiv.appendChild(dailyWeather);
                // make the UV index responsive to the value
                var uvIndex = document.getElementById("uv-index")
                if (Number(uvIndex.textContent) >= 8) {
                    uvIndex.setAttribute("style", "background-color: red; color: white;");
                } else if (Number(uvIndex.textContent) >= 6) {
                    uvIndex.setAttribute("style", "background-color: orange; color: white;");
                } else if (Number(uvIndex.textContent) >= 3) {
                    uvIndex.setAttribute("style", "background-color: yellow;");
                }
                // Moderate	3-5
                // High	6-7
                // Very High	8-10
                // Extreme	11+
                // Under the current day, show the 5-day forecast for the city with date, humidity, min and max temp, wind speed,
                for (let i = 1; i < 6; i++) {
                    // get the humidity
                    var dailyHumidity = data.daily[i].humidity;
                    // get min and max temperatures
                    var dailyMax = (Math.round((data.daily[i].temp.max-273.15)*(9/5) + 32));
                    var dailyMin = (Math.round((data.daily[i].temp.min-273.15)*(9/5) + 32));
                    // get the date and convert to calendar string and day of the week
                    var dailyDate = new Date(data.daily[i].dt*1000);
                    dailyDate = dailyDate.getDay();
                    if (dailyDate === 1) dailyDate = "Monday";
                    else if (dailyDate === 2) dailyDate = "Tuesday";
                    else if (dailyDate === 3) dailyDate = "Wednesday";
                    else if (dailyDate === 4) dailyDate = "Thursday";
                    else if (dailyDate === 5) dailyDate = "Friday";
                    else if (dailyDate === 6) dailyDate = "Saturday";
                    else if (dailyDate === 0) dailyDate = "Sunday";
                    // get the wind speed
                    var dailyWind = Math.round(data.daily[i].wind_speed);
                    // get the full weather description
                    var dailyDescription = data.daily[i].weather[0].description;
                    // now convert it to a capital cased description
                    var properDailyDescription = "";
                    var dailyStatusArr = dailyDescription.split(" ");
                    if (dailyStatusArr.length === 1) {
                        var lowers2 = dailyStatusArr[0].slice(1);
                        var upper2 = dailyStatusArr[0][0].toUpperCase();
                        properDailyDescription = properDailyDescription.concat(upper2);
                        properDailyDescription = properDailyDescription.concat(lowers2);
                    } else {
                        for (var j=0; j<dailyStatusArr.length; j++) {
                            var lowers2 = dailyStatusArr[j].slice(1);
                            var upper2 = dailyStatusArr[j][0].toUpperCase();
                            if (j === dailyStatusArr.length - 1) {
                                properDailyDescription = properDailyDescription.concat(upper2);
                                properDailyDescription = properDailyDescription.concat(lowers2);
                            } else {
                                properDailyDescription = properDailyDescription.concat(upper2);
                                properDailyDescription = properDailyDescription.concat(lowers2);
                                properDailyDescription = properDailyDescription.concat(" ");
                            }
                        }
                    }
                    // get the weather icon id
                    var dailyIcon = data.daily[i].weather[0].icon;
                    // convert icon id to icon image url
                    var dailyIconURL = `http://openweathermap.org/img/wn/${dailyIcon}@2x.png`
                    console.log("weather status: " + data.daily[i].weather[0].main);
                    // create div to append to the display weather section
                    var dailyWeatherDiv = document.createElement("div");
                    // dynamic set inner html to be a bootstrap card with extracted API weather values
                    dailyWeatherDiv.innerHTML = `
                    <div class="card border-success mb-3" style="max-width: 10rem; min-width: 10rem;height: 450px;">
                        <div class="card-header bg-transparent text-center border-success text-center">
                            ${dailyDate}
                        </div>
                        <div>
                            <div class="text-center">
                                <div class="icon-container" style="max-width: 18rem"> 
                                    <img class="col-12 text-center pb-0 mb-0" src="${dailyIconURL}" alt="daily weather icon">
                                    <p class="col-12 card-text text-center status status-text pt-0 mt-0">${properDailyDescription}</p>
                                </div>
                                <div class="text-center align-content-center card-body">
                                        <p class="card-text">High: ${dailyMax}</p>
                                        <p class="card-text">Low: ${dailyMin}</p>
                                        <p class="card-text">Wind: ${dailyWind} mph</p>
                                        <p class="card-text">Humidity: ${dailyHumidity}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                    // append card to the display weather div
                    dailyWeather.appendChild(dailyWeatherDiv);
                }
            });
		} else {
			console.log('ERROR BRO!');
		}
	});
}

// TODO - When the cities in the previous searches unordered list are clicked, then the weather for that clicked city is displayed again