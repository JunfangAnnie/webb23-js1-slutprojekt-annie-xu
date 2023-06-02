const API = "0457fe169010ceae06f920cc8b7c6d58";
const URL = "https://api.openweathermap.org/data/2.5";

const getCurrentWeather = async (city) => {
	const response = await fetch(`${URL}/weather?q=${city}&units=metric&appid=${API}&lang=sv`);

	if (!response.ok) {
		throw new Error(`${response.status} ${response.statusText}`);
	}

	const data = await response.json();

	return data;
}

const forecastEl = document.querySelector('#forecast');

const renderAlert = (msg, severity = 'info') => {
	forecastEl.innerHTML =
		`<div class="alert alert-${severity}">${msg}</div>`;
}

const renderWarning = msg => renderAlert(msg, 'warning');

const renderCurrentWeather = data => {
	const conditions = data.weather.map(condition =>
		`<li><img src="http://openweathermap.org/img/wn/${condition.icon}@2x.png" title="${condition.description}"></li>`
	);

    console.log (data)

	const now = Math.round(Date.now() / 1000);

	const banner = (now > data.sys.sunrise && now < data.sys.sunset)
		? '/img/day.png'
		: '/img/night.png';

	const freshness = new Date( data.dt * 1000 );

	forecastEl.innerHTML = `
		<div class="card">
			<img src="${banner}" class="card-img-top">
			<div class="card-body">
				<h5 class="card-title" id="location">
					<span id="city">${data.name}</span>,
					<span id="country">${data.sys.country}</span>
				</h5>
				<p class="desc">
					<span id="description">${data.weather[0].description}</span>
				</p>

                <ul class="conditions">
                    ${conditions.join('')}
                </ul>

				<p class="temp"> Temperatur:
					<span id="temperature">${data.main.temp}</span>
					&deg;C
				</p>
				<p class="wind"> Vindhastighet: 
					<span id="windspeed">${data.wind.speed}</span>
					m/s
				</p>

				<p>${freshness.toLocaleString()}</p>
			</div>
		</div>
	`;
}

document.querySelector('#search-form').addEventListener('submit', async e => {
    e.preventDefault();
  
    const city = e.target.query.value.trim();

	console.log(`Söker efter: "${city}"`);
	try {
		const data = await getCurrentWeather(city);

		renderCurrentWeather(data);
	} catch (e) {
		renderWarning("That does not look like a city.");
	}

});