const summaryList = document.querySelector('#submitted-details');
const params = new URLSearchParams(window.location.search);

const fields = [
  ['Name', 'customerName'],
  ['Email', 'customerEmail'],
  ['Interest Area', 'orderCategory'],
  ['Estimated Quantity', 'itemCount'],
  ['Color Preferences & Notes', 'notes']
];

if (summaryList) {
  summaryList.innerHTML = fields.map(([label, key]) => {
    const value = params.get(key)?.trim() || 'Not provided';
    return `<dt>${label}</dt><dd>${value}</dd>`;
  }).join('');
}
