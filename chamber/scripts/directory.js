// Mobile menu toggle
const menubutton = document.querySelector('#menu');
const navigation = document.querySelector('.navigation');

if (menubutton) {
    menubutton.setAttribute('aria-expanded', 'false');
    menubutton.addEventListener('click', () => {
        if (navigation) {
            navigation.classList.toggle('open');
        }
        menubutton.classList.toggle('open');
        const expanded = menubutton.getAttribute('aria-expanded') === 'true';
        menubutton.setAttribute('aria-expanded', String(!expanded));
    });
}

// Update the footer date and last modified text
const currentyear = document.querySelector('#currentyear');
const lastModified = document.querySelector('#lastModified');

const today = new Date();
if (currentyear) {
    currentyear.textContent = today.getFullYear();
}
if (lastModified) {
    lastModified.textContent = `Last updated: ${document.lastModified}`;
}

// Load member data from JSON
const url = 'data/members.json';
const cards = document.querySelector('#cards');

async function getMembersData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayMembers(data.members);
    } catch (error) {
        console.error('Error fetching data:', error);
        if (cards) {
            cards.innerHTML = '<p>Unable to load the directory right now. Please try again later.</p>';
        }
    }
}

getMembersData();

// Build member cards
const displayMembers = (members) => {
    if (!cards) return;

    cards.innerHTML = '';
    members.forEach((member) => {
        const card = document.createElement('section');
        const portrait = document.createElement('img');
        const name = document.createElement('h3');
        const address = document.createElement('p');
        const phone = document.createElement('p');
        const website = document.createElement('a');
        const level = document.createElement('p');

        portrait.setAttribute('src', `images/${member.image}`);
        portrait.setAttribute('alt', `Logo of ${member.name}`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '100');
        portrait.setAttribute('height', '100');

        name.textContent = member.name;
        address.textContent = member.address;
        phone.textContent = member.phone;

        website.setAttribute('href', member.website);
        website.setAttribute('target', '_blank');
        website.setAttribute('rel', 'noopener noreferrer');
        website.textContent = member.website;

        let levelText = 'Member';
        if (member.membershipLevel === 3) {
            levelText = 'Gold Member';
        } else if (member.membershipLevel === 2) {
            levelText = 'Silver Member';
        } else if (member.membershipLevel === 1) {
            levelText = 'Bronze Member';
        }

        level.textContent = `Level: ${levelText}`;

        card.appendChild(portrait);
        card.appendChild(name);
        card.appendChild(address);
        card.appendChild(phone);
        card.appendChild(website);
        card.appendChild(level);

        cards.appendChild(card);
    });
};

// Switch between grid and list view
const gridbutton = document.querySelector('#grid');
const listbutton = document.querySelector('#list');

function setView(view) {
    if (!cards) return;

    if (view === 'list') {
        cards.classList.add('list');
        cards.classList.remove('grid');
        if (listbutton) listbutton.classList.add('active');
        if (gridbutton) gridbutton.classList.remove('active');
        if (listbutton) listbutton.setAttribute('aria-pressed', 'true');
        if (gridbutton) gridbutton.setAttribute('aria-pressed', 'false');
    } else {
        cards.classList.add('grid');
        cards.classList.remove('list');
        if (gridbutton) gridbutton.classList.add('active');
        if (listbutton) listbutton.classList.remove('active');
        if (gridbutton) gridbutton.setAttribute('aria-pressed', 'true');
        if (listbutton) listbutton.setAttribute('aria-pressed', 'false');
    }
}

if (gridbutton) {
    gridbutton.setAttribute('aria-pressed', 'true');
    gridbutton.addEventListener('click', () => {
        setView('grid');
    });
}

if (listbutton) {
    listbutton.setAttribute('aria-pressed', 'false');
    listbutton.addEventListener('click', () => {
        setView('list');
    });
}

if (gridbutton && listbutton) {
    setView('grid');
}