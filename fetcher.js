function initPage() {
    const city = document.getElementById("enter-city");
    const search = document.getElementById("search-button");
    const clear = document.getElementById("clear-history");
    const name = document.getElementById("city-name");
    const picture = document.getElementById("current-pic");
    const temperature = document.getElementById("temperature");
    const humidity = document.getElementById("humidity");
    const windSpeed = document.getElementById("wind-speed");
    const history = document.getElementById("history");
    var fiveDay = document.getElementById("fiveday-header");
    var todaysWeather = document.getElementById("today-weather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    const APIKey = "ff52f28f75546571685835d3c167cbd0";

    function getWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
            .then(function(response) {
                todaysWeather.classList.remove("d-none");

                const currentDate = new Date(response.data.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth();
                const year = currentDate.getFullYear();

                name.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
                let weatherPic = response.data.weather[0].icon;
                picture.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                picture.setAttribute("alt", response.data.weather[0].description);
                
                temperature.innerHTML = "Temperature: " + response.data.main.temp + " K";
                humidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                windSpeed.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

                let cityId = response.data.id;
                let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityId + "&appid=" + APIKey;
                axios.get(forecastQueryURL)
                    .then(function(response) {
                        fiveDay.classList.remove("d-none");

                        const forecastQuery = document.querySelectorAll(".forecast");
                        for(let i = 0; i < forecastQuery.length; i++) {
                            forecastQuery[i].innerHTML = "";
                            const forecastIndex = i * 8 + 4;
                            const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                            const forecastDay = forecastDate.getDate();
                            const forecastMonth = forecastDate.getMonth();
                            const forecastYear = forecastDate.getFullYear();
                            const forecastDateEle = document.createElement("p");

                            forecastDateEle.setAttribute("class", "mt-3 mb-0 forecast-date");
                            forecastDateEle.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecastQuery[i].append(forecastDateEle);

                            const forecastWeatherEle = document.createElement("img");
                            forecastWeatherEle.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                            forecastWeatherEle.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                            forecastQuery[i].append(forecastWeatherEle);
                            const forecastTemp = document.createElement("p");
                            forecastTemp.innerHTML = "Temp: " + response.data.list[forecastIndex].main.temp + " K";
                            forecastQuery[i].append(forecastTemp);
                            const forecastHumidity = document.createElement("p");
                            forecastHumidity.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                            forecastQuery[i].append(forecastHumidity);

                        }
                            
                    })
            })
    }

    search.addEventListener("click", function() {
        const searchTerm = city.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    clear.addEventListener("click", function() {
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
    })

    function renderSearchHistory() {
        history.innerHTML = "";
        for(let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function() {
                getWeather(historyItem.value);
            })
            history.append(historyItem);
        }
    }

    renderSearchHistory();
    if(searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1])
    }

}

initPage();