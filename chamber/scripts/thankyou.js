const params = new URLSearchParams(window.location.search);
const detailsContainer = document.getElementById('submission-details');

const firstName = params.get('firstName') || 'N/A';
const lastName = params.get('lastName') || 'N/A';
const email = params.get('email') || 'N/A';
const phone = params.get('phone') || 'N/A';
const businessName = params.get('businessName') || 'N/A';
const timestamp = params.get('timestamp') || 'N/A';

detailsContainer.innerHTML = `
    <p><strong>First Name:</strong> ${firstName}</p>
    <p><strong>Last Name:</strong> ${lastName}</p>
    <p><strong>Email Address:</strong> ${email}</p>
    <p><strong>Mobile Phone:</strong> ${phone}</p>
    <p><strong>Business/Organization:</strong> ${businessName}</p>
    <p><strong>Application Date:</strong> ${timestamp}</p>
`;

// Footer dates
document.getElementById('currentyear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Modification: ${document.lastModified}`;