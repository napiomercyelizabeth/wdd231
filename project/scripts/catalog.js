import { fetchProducts, formatUGX } from './dataService.js';

const STORAGE_KEY = 'napio_favorites_v1';
const productList = document.querySelector('#product-list');
const errorElement = document.querySelector('#catalog-error');
const filterGroup = document.querySelector('#category-filters');
const savedSummary = document.querySelector('#saved-summary');
const dialog = document.querySelector('#product-dialog');
const dialogContent = document.querySelector('#dialog-content');

let allProducts = [];
let activeCategory = 'all';
let savedIds = loadFavorites();

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  if (savedSummary) savedSummary.textContent = `Saved favorites: ${savedIds.length}`;
}

function cardMarkup(product) {
  const isSaved = savedIds.includes(product.id);
  return `
    <article class="product-card">
      <div class="product-art" aria-hidden="true"><span>${product.category}</span></div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>
        <p>${product.finish}</p>
        <p class="product-price">${formatUGX(product.price)}</p>
        <div class="card-actions">
          <button class="details-button" type="button" data-product-id="${product.id}">View details</button>
          <button class="favorite-button${isSaved ? ' saved' : ''}" type="button" data-favorite-id="${product.id}" aria-label="${isSaved ? 'Remove' : 'Add'} ${product.name} ${isSaved ? 'from' : 'to'} favorites" aria-pressed="${isSaved}">${isSaved ? '♥' : '♡'}</button>
        </div>
      </div>
    </article>`;
}

function render() {
  if (!productList) return;
  const visible = activeCategory === 'all'
    ? allProducts
    : allProducts.filter((product) => product.category === activeCategory);
  productList.innerHTML = visible.map(cardMarkup).join('');
  saveFavorites();
}

filterGroup?.addEventListener('click', (event) => {
  const button = event.target.closest('.filter-btn');
  if (!button) return;
  activeCategory = button.dataset.category;
  filterGroup.querySelectorAll('.filter-btn').forEach((filter) => {
    const selected = filter === button;
    filter.classList.toggle('is-selected', selected);
    filter.setAttribute('aria-pressed', String(selected));
  });
  render();
});

document.addEventListener('click', (event) => {
  const detailsButton = event.target.closest('[data-product-id]');
  if (detailsButton) {
    const product = allProducts.find((item) => item.id === detailsButton.dataset.productId);
    if (product && dialog && dialogContent) {
      dialogContent.innerHTML = `
        <p class="eyebrow">${product.category}</p>
        <h2 id="dialog-title">${product.name}</h2>
        <p>${product.description}</p>
        <dl class="product-details">
          <div><dt>Price</dt><dd>${formatUGX(product.price)}</dd></div>
          <div><dt>Finish</dt><dd>${product.finish}</dd></div>
          <div><dt>Category</dt><dd>${product.category}</dd></div>
        </dl>`;
      dialog.showModal();
    }
  }

  const favoriteButton = event.target.closest('[data-favorite-id]');
  if (favoriteButton) {
    const id = favoriteButton.dataset.favoriteId;
    savedIds = savedIds.includes(id)
      ? savedIds.filter((savedId) => savedId !== id)
      : [...savedIds, id];
    saveFavorites();
    render();
  }

  if (event.target.closest('.dialog-close') && dialog) dialog.close();
});

if (dialog) {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}

async function init() {
  try {
    allProducts = await fetchProducts('data/products.json');
    render();
  } catch (error) {
    if (errorElement) errorElement.textContent = 'The collection could not be loaded. Please refresh the page.';
  }
}

init();
