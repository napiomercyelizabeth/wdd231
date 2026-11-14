// 1. Mobile Menu Toggle for small screens
const menuButton = document.querySelector('#menu');
const navigation = document.querySelector('.navigation');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuButton.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });
}

// 2. Footer Dates (Current year & Last modified)
const currentyear = document.querySelector('#currentyear');
const lastModified = document.querySelector('#lastModified');
const now = new Date();
currentyear.textContent = now.getFullYear();
lastModified.textContent = `Last Modification: ${document.lastModified}`;

// 3. OpenWeatherMap API Integration (Lira, Uganda - City ID: 230166)
const apiKey = '22daad764531fa1c568147c742570f02';
const cityId = '230166';
const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=metric&appid=${apiKey}`;

async function fetchWeather() {
  try {
    const response = await fetch(weatherUrl);
    if (response.ok) {
      const data = await response.json();
      displayWeather(data);
    } else {
      console.error('Weather data fetch failed:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function displayWeather(data) {
  const tempSpan = document.querySelector('#current-temp');
  const descSpan = document.querySelector('#weather-desc');
  const forecastList = document.querySelector('#forecast-list');

  if (!data || !data.list || data.list.length === 0) {
    if (tempSpan) tempSpan.textContent = 'N/A';
    if (descSpan) descSpan.textContent = 'Unavailable';
    return;
  }

  // Current weather details from the first forecast entry
  const current = data.list[0];
  tempSpan.textContent = Math.round(current.main.temp);
  
  const description = current.weather[0].description;
  descSpan.textContent = description.charAt(0).toUpperCase() + description.slice(1);

  // 3-Day Forecast (filtering entries around 12:00:00 daily)
  forecastList.innerHTML = '';
  const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);

  dailyForecasts.forEach(day => {
    const dateObj = new Date(day.dt * 1000);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const dayTemp = Math.round(day.main.temp);
    const dayDesc = day.weather[0].description;

    const li = document.createElement('li');
    li.textContent = `${dayName}: ${dayTemp}°C - ${dayDesc}`;
    forecastList.appendChild(li);
  });
}

fetchWeather();

// 4. Company Spotlight Section (Fetch JSON, filter Gold/Silver levels, randomize)
const memberUrl = 'data/members.json';
const spotlightContainer = document.querySelector('#spotlight-cards');

async function loadSpotlights() {
  try {
    const response = await fetch(memberUrl);
    const data = await response.json();

    // Filter members with Gold (3) or Silver (2) membership levels
    const qualifiedMembers = data.members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3);
    
    // Randomize array order and select 2 to 3 members
    const shuffled = [...qualifiedMembers].sort(() => 0.5 - Math.random());
    const selectedSpotlights = shuffled.slice(0, 3);

    renderSpotlights(selectedSpotlights);
  } catch (error) {
    console.error('Error loading member spotlights:', error);
  }
}

function renderSpotlights(members) {
  if (!spotlightContainer) return;

  spotlightContainer.innerHTML = '';
  members.forEach(member => {
    const card = document.createElement('section');
    card.classList.add('spotlight-card');

    const levelText = member.membershipLevel === 3 ? 'Gold Member' : 'Silver Member';

    card.innerHTML = `
      <h3>${member.name}</h3>
      <img src="images/${member.image}" alt="Logo of ${member.name}" loading="lazy" width="100" height="100">
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a>
      <p class="membership-level">Level: ${levelText}</p>
    `;

    spotlightContainer.appendChild(card);
  });
}

loadSpotlights();