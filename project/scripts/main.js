const menuButton = document.querySelector('#menu-button');
const navigation = document.querySelector('#primary-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('open', !open);
  });
}

const year = document.querySelector('#current-year');
if (year) year.textContent = new Date().getFullYear();

const modified = document.querySelector('#last-modified');
if (modified) modified.textContent = `Last updated: ${document.lastModified}`;

const featuredContainer = document.querySelector('#featured-products');
const errorMessage = document.querySelector('#product-error');
const dialog = document.querySelector('#product-dialog');
const dialogContent = document.querySelector('#dialog-content');
let featuredProducts = [];

function formatPrice(price) {
  return `UGX ${Number(price).toLocaleString('en-US')}`;
}

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem('napio_favorites_v1'));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function cardMarkup(product) {
  const savedIds = loadFavorites();
  const isSaved = savedIds.includes(product.id);
  return `
    <article class="product-card">
      <div class="product-art" aria-hidden="true"><span>${product.category}</span></div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>
        <p>${product.finish}</p>
        <p class="product-price">${formatPrice(product.price)}</p>
        <div class="card-actions">
          <button class="details-button" type="button" data-product-id="${product.id}">View details</button>
          <button class="favorite-button${isSaved ? ' saved' : ''}" type="button" data-favorite-id="${product.id}" aria-label="${isSaved ? 'Remove' : 'Add'} ${product.name} ${isSaved ? 'from' : 'to'} favorites" aria-pressed="${isSaved}">${isSaved ? '♥' : '♡'}</button>
        </div>
      </div>
    </article>`;
}

async function loadFeatured() {
  if (!featuredContainer) return;
  try {
    const response = await fetch('data/products.json');
    if (!response.ok) throw new Error(`Unable to load products (${response.status})`);
    const products = await response.json();
    featuredProducts = products.filter((product) => product.featured).slice(0, 4);
    featuredContainer.innerHTML = featuredProducts.map(cardMarkup).join('');
  } catch (error) {
    if (errorMessage) errorMessage.textContent = 'Our collection could not be loaded. Please refresh the page.';
  }
}

document.addEventListener('click', (event) => {
  const detailsButton = event.target.closest('[data-product-id]');
  if (detailsButton) {
    const product = featuredProducts.find((item) => item.id === detailsButton.dataset.productId);
    if (product && dialog && dialogContent) {
      dialogContent.innerHTML = `
        <p class="eyebrow">${product.category}</p>
        <h2 id="dialog-title">${product.name}</h2>
        <p>${product.description}</p>
        <dl class="product-details">
          <div><dt>Price</dt><dd>${formatPrice(product.price)}</dd></div>
          <div><dt>Finish</dt><dd>${product.finish}</dd></div>
          <div><dt>Category</dt><dd>${product.category}</dd></div>
        </dl>`;
      dialog.showModal();
    }
  }

  const favoriteButton = event.target.closest('[data-favorite-id]');
  if (favoriteButton) {
    const id = favoriteButton.dataset.favoriteId;
    const savedIds = loadFavorites();
    const updated = savedIds.includes(id)
      ? savedIds.filter((savedId) => savedId !== id)
      : [...savedIds, id];
    localStorage.setItem('napio_favorites_v1', JSON.stringify(updated));
    if (featuredContainer) featuredContainer.innerHTML = featuredProducts.map(cardMarkup).join('');
  }

  if (event.target.closest('.dialog-close') && dialog) dialog.close();
});

if (dialog) {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}

loadFeatured();
