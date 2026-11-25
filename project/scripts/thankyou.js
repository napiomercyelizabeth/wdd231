const parameters = new URLSearchParams(window.location.search);
const name = document.querySelector('#customer-name');
const details = document.querySelector('#request-details');

if (name) {
  name.textContent = parameters.get('name') || 'beautiful';
}

if (details) {
  const fields = [
    ['Email', 'email'],
    ['Interest', 'interest'],
    ['Message', 'message'],
    ['Submitted', 'submittedAt']
  ];

  details.innerHTML = fields.map(([label, key]) => {
    let value = parameters.get(key) || 'Not provided';
    if (key === 'submittedAt') {
      const date = new Date(value);
      value = isNaN(date.getTime()) ? value : date.toLocaleString();
    }
    return `<div><dt>${label}</dt><dd>${value}</dd></div>`;
  }).join('');
}

const year = document.querySelector('#current-year');
if (year) year.textContent = new Date().getFullYear();
