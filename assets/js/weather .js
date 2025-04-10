document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("search-btn").addEventListener("click", fetchWeather);
    document.getElementById("close-btn").addEventListener("click", closeModal);
});

async function fetchWeather() {
    const city = document.getElementById("name-field").value.trim();

    if (!city) {
        alert("Enter the name of the city!");
        return;
    }

    const apiKey = "HG3EeOT0x6tg1ZRsCCU7LxAW172TAhUK"; // API key
    const locationUrl = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${encodeURIComponent(city)}`;

    try {
        // 1. get cityKey
        const locationResponse = await fetch(locationUrl);
        if (!locationResponse.ok) throw new Error(`Error HTTP: ${locationResponse.status}`);
        
        const locationData = await locationResponse.json();
        if (locationData.length === 0) {
            document.getElementById("cityKey").innerText = "City not found!";
            document.getElementById("temperature").innerText = "";
            document.getElementById("modal").style.display = "block";
            return;
        }

        const cityKey = locationData[0].Key;

        // 2. Get forecast
        const weatherUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${cityKey}?apikey=${apiKey}&metric=true`;
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) throw new Error(`Error HTTP: ${weatherResponse.status}`);
        
        const weatherData = await weatherResponse.json();
        const minTemp = weatherData.DailyForecasts[0].Temperature.Minimum.Value;
        const maxTemp = weatherData.DailyForecasts[0].Temperature.Maximum.Value;

        document.getElementById("temperature").innerText = `Nhiệt Độ Thấp Nhất : ${minTemp}°C, Nhiệt Độ Cao Nhất: ${maxTemp}°C`;
        document.getElementById("modal").style.display = "block";

       

    } catch (error) {
        console.error("Request error:", error);
        document.getElementById("cityKey").innerText = "Data loading error";
        document.getElementById("temperature").innerText = "";
        document.getElementById("modal").style.display = "block";
    }
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}
