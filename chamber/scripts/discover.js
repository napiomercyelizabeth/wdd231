// Store and display the visitor's previous visit date.
const messageContainer = document.getElementById('visitor-message');
const lastVisit = localStorage.getItem('chamberLastVisit');
const now = Date.now();
const millisecondsPerDay = 1000 * 60 * 60 * 24;

if (!lastVisit) {
    messageContainer.textContent = 'Welcome! This is your first visit to the Discover page.';
} else {
    const daysBetween = Math.floor((now - Number(lastVisit)) / millisecondsPerDay);

    if (daysBetween < 1) {
        messageContainer.textContent = 'Welcome back! You visited today.';
    } else if (daysBetween === 1) {
        messageContainer.textContent = 'You last visited 1 day ago.';
    } else {
        messageContainer.textContent = `You last visited ${daysBetween} days ago.`;
    }
}

localStorage.setItem('chamberLastVisit', now.toString());

// Responsive navigation menu.
const menuButton = document.getElementById('menu');
const navigation = document.getElementById('primary-navigation');

menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuButton.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});

// 2. Fetch and Render 8 Points of Interest
const placesUrl = 'data/places.json';
const gridContainer = document.getElementById('discover-grid');

async function loadPlaces() {
    try {
        const response = await fetch(placesUrl);
        if (!response.ok) throw new Error('Failed to load places data');
        const places = await response.json();
        renderCards(places);
    } catch (error) {
        console.error('Error loading discover places:', error);
    }
}

function renderCards(places) {
    gridContainer.innerHTML = '';

    places.forEach((place, index) => {
        const card = document.createElement('article');
        card.className = `discover-card card-${index + 1}`;

        card.innerHTML = `
            <h3>${place.name}</h3>
            <figure>
                <img src="images/${place.image}" alt="${place.name}" width="300" height="200" loading="lazy">
            </figure>
            <address>${place.address}</address>
            <p>${place.description}</p>
            <button type="button" class="learn-more-btn">Learn More</button>
        `;

        gridContainer.appendChild(card);
    });
}

loadPlaces();

// 3. Footer Dates
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Modification: ${document.lastModified}`;