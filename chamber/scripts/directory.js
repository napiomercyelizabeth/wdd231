// Menu button for small screens
const menubutton = document.querySelector('#menu');
const navigation = document.querySelector('.navigation');

menubutton.addEventListener('click', () => {
    navigation.classList.toggle('open');
    menubutton.classList.toggle('open');
});

// Footer following current dates and last modification done 
const currentyear = document.querySelector('#currentyear');
const lastModified = document.querySelector('#lastModified');

const today = new Date();
currentyear.textContent = today.getFullYear();
lastModified.textContent = `Last Modification: ${document.lastModified}`;

// Fetch JSON Member Data
const url = 'data/members.json';
const cards = document.querySelector('#cards');

async function getMembersData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMembers(data.members);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

getMembersData();

// The display of members function
const displayMembers = (members) => {
    cards.innerHTML = ''; // clear out container
    members.forEach((member) => {
        let card = document.createElement('section');
        
        let portrait = document.createElement('img');
        let name = document.createElement('h3');
        let address = document.createElement('p');
        let phone = document.createElement('p');
        let website = document.createElement('a');
        let level = document.createElement('p');

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
        website.textContent = member.website;

        let levelText = member.membershipLevel === 3 ? 'Gold Member' : member.membershipLevel === 2 ? 'Silver Member' : 'Member';
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

// the Grid appears regardless of the button clicked and the list appears
const gridbutton = document.querySelector('#grid');
const listbutton = document.querySelector('#list');

gridbutton.addEventListener('click', () => {
    cards.classList.add('grid');
    cards.classList.remove('list');
});

listbutton.addEventListener('click', () => {
    cards.classList.add('list');
    cards.classList.remove('grid');
});