lucide.createIcons();
// theme-toggle
const themeBtn=document.querySelector(".theme-toggle");
themeBtn.addEventListener("click",()=>{
    document.body.classList.toggle("light");
    if(document.body.classList.contains("light")){
        themeBtn.innerHTML='<i data-lucide="sun-medium"></i>'; 
    }else{
        themeBtn.innerHTML='<i data-lucide="moon"></i>'; 
    }
    lucide.createIcons();
});

const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const cityName = document.querySelector(".city-name");
const currentTemp = document.querySelector(".current-temp");
const weatherCondition = document.querySelector(".weather-condition");
const humidity = document.querySelector(".humidity");
const windSpeed = document.querySelector(".wind-speed");
const feelsLike = document.querySelector(".feels-like");
const visibility = document.querySelector(".visibility");
const pressure = document.querySelector(".pressure");
const weatherIcon = document.querySelector(".weather-icon");
const maxMinTemp = document.querySelector(".max-min-temp");
const currentDate = document.querySelector(".current-date");
const hourlyContainer = document.querySelector(".hourly-container");
const fiveDayContainer = document.querySelector(".five-day-container");

const API_KEY = "f64dab4d5df78739758c3e5556be7ea8";
async function getWeather(city){
    try{
    const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if(data.cod=="404"){
    alert("City not found!");
    return;
    }
    cityName.textContent =`${data.name}, ${data.sys.country}`;
    currentTemp.innerHTML = `
    ${Math.round(data.main.temp)}°
    <span>C</span>
    `;
    const condition = data.weather[0].main;
    weatherCondition.textContent = condition;

    switch(condition){
        case "Clear":
        document.body.style.background =
        "linear-gradient(135deg,#56CCF2,#2F80ED)";
        break;

        case "Clouds":
        document.body.style.background =
        "linear-gradient(135deg,#757F9A,#D7DDE8)";
        break;

        case "Rain":
        case "Drizzle":
        document.body.style.background =
        "linear-gradient(135deg,#2C3E50,#4CA1AF)";
        break;

        case "Thunderstorm":
        document.body.style.background =
        "linear-gradient(135deg,#232526,#414345)";
        break;

        case "Snow":
        document.body.style.background =
        "linear-gradient(135deg,#E6DADA,#274046)";
        break;

        case "Mist":
        case "Fog":
        case "Haze":
        document.body.style.background =
        "linear-gradient(135deg,#BDC3C7,#2C3E50)";
        break;

    default:
        document.body.style.background =
        "linear-gradient(135deg,#0f1b5c,#243b8a,#5b3f9b)";
}
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent =`${Math.round(data.wind.speed * 3.6)} km/h`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
    visibility.textContent = `${data.visibility/1000} km`;
    pressure.textContent = `${data.main.pressure} hPa`;
    const iconCode = data.weather[0].icon;
    weatherIcon.src =
    `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    maxMinTemp.innerHTML =
    `H:${Math.round(data.main.temp_max)}°
     L:${Math.round(data.main.temp_min)}°`;
    const today = new Date();
    currentDate.textContent =
    today.toLocaleString("en-US",{
    weekday:"long",
    day:"numeric",
    month:"long",
    hour:"numeric",
    minute:"2-digit"
    });
    }
    catch(error){
        console.log(error);
    }
}
async function getHourlyForecast(city){
    const url =`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (data.cod !== "200") {
    alert("City not found!");
    return;
    }
    hourlyContainer.innerHTML = "";
    data.list.slice(0,8).forEach(item => {
    const temp = Math.round(item.main.temp);
    const icon = item.weather[0].icon;
    const time = new Date(item.dt_txt).toLocaleTimeString([],{
        hour:"numeric",
        minute:"2-digit"
    });
    hourlyContainer.innerHTML += `
    <div class="forecast-card">
        <p>${time}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
        <h3>${temp}°</h3>
    </div>
    `;
    // console.log(temp);
    // console.log(icon);
    // console.log(time);
    });
}
async function getFiveDayForecast(city){
    const url =`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (data.cod !== "200") {
    alert("City not found!");
    return;
    }
    fiveDayContainer.innerHTML = "";
    const dailyData = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
    );
    dailyData.slice(0,5).forEach(item=>{
        const date = new Date(item.dt_txt);
        const day = date.toLocaleDateString("en-US",{
        weekday:"short"
        });
        const dayNumber = date.toLocaleDateString("en-US",{
        day:"numeric",
        month:"short"
        });
        const icon = item.weather[0].icon;
        const high = Math.round(item.main.temp_max);
        const low = Math.round(item.main.temp_min);
        fiveDayContainer.innerHTML += `
        <div class="day-card">
        <h3>${day}</h3>
        <p>${dayNumber}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
        <div class="day-temp">
        <span class="high">${high}°</span>
        <span class="low">${low}°</span>
        </div>
        </div>
        `;
        });
}
cityInput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        const city = cityInput.value;
        if (!city) {
        alert("Please enter a city");
        return;
        }
        getWeather(city);
        getHourlyForecast(city);
        getFiveDayForecast(city);
    }
});
searchBtn.addEventListener("click", () => {
    const city = cityInput.value;
    if (!city) {
        alert("Please enter a city");
        return;
    }
    getWeather(city);
    getHourlyForecast(city);
    getFiveDayForecast(city);
});

// Page load
getWeather("Delhi");
getHourlyForecast("Delhi");
getFiveDayForecast("Delhi");
