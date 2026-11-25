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

const submittedAt = document.querySelector('#submitted-at');
if (submittedAt) submittedAt.value = new Date().toISOString();

const catalogContainer = document.querySelector('#catalog-products');
const featuredContainer = document.querySelector('#featured-products');
const errorMessage = document.querySelector('#product-error');
let allProducts = [];

const formatPrice = (price) => `UGX ${price.toLocaleString('en-US')}`;

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('napioFavorites')) || [];
  } catch {
    return [];
  }
}

function saveFavorite(id) {
  const favorites = getFavorites();
  const updated = favorites.includes(id)
    ? favorites.filter((favoriteId) => favoriteId !== id)
    : [...favorites, id];
  localStorage.setItem('napioFavorites', JSON.stringify(updated));
  return updated;
}

function productCard(product) {
  const favorites = getFavorites();
  const favorite = favorites.includes(product.id);
  return `
    <article class="product-card">
      <div class="product-art product-${product.id}" role="img" aria-label="${product.name}">
        <span>${product.category}</span>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <div class="card-actions">
          <button class="details-button" type="button" data-product-id="${product.id}">View details</button>
          <button class="favorite-button ${favorite ? 'saved' : ''}" type="button" data-favorite-id="${product.id}" aria-label="${favorite ? 'Remove' : 'Add'} ${product.name} ${favorite ? 'from' : 'to'} favorites" aria-pressed="${favorite}">${favorite ? '♥' : '♡'}</button>
        </div>
      </div>
    </article>`;
}

function renderProducts(container, products) {
  if (container) container.innerHTML = products.map(productCard).join('');
}

async function loadProducts() {
  try {
    const response = await fetch('data/products.json');
    if (!response.ok) throw new Error(`Unable to load products (${response.status})`);
    allProducts = await response.json();

    if (featuredContainer) {
      renderProducts(featuredContainer, allProducts.filter((product) => product.featured).slice(0, 4));
    }

    if (catalogContainer) {
      renderProducts(catalogContainer, allProducts);
      document.querySelectorAll('.filter').forEach((button) => {
        button.addEventListener('click', () => {
          document.querySelectorAll('.filter').forEach((filter) => {
            filter.classList.remove('active');
            filter.setAttribute('aria-pressed', 'false');
          });
          button.classList.add('active');
          button.setAttribute('aria-pressed', 'true');
          const category = button.dataset.category;
          const filtered = category === 'all'
            ? allProducts
            : allProducts.filter((product) => product.category === category);
          renderProducts(catalogContainer, filtered);
        });
      });
    }
  } catch (error) {
    if (errorMessage) errorMessage.textContent = 'Our collection could not be loaded. Please refresh the page.';
    console.error(error);
  }
}

const dialog = document.querySelector('#product-dialog');
const dialogContent = document.querySelector('#dialog-content');

document.addEventListener('click', (event) => {
  const detailsButton = event.target.closest('[data-product-id]');
  if (detailsButton) {
    const product = allProducts.find((item) => item.id === Number(detailsButton.dataset.productId));
    if (product && dialog && dialogContent) {
      dialogContent.innerHTML = `
        <p class="eyebrow">${product.category}</p>
        <h2 id="dialog-title">${product.name}</h2>
        <p>${product.description}</p>
        <dl class="product-details">
          <div><dt>Price</dt><dd>${formatPrice(product.price)}</dd></div>
          <div><dt>Materials</dt><dd>${product.material}</dd></div>
          <div><dt>Color</dt><dd>${product.color}</dd></div>
        </dl>`;
      dialog.showModal();
    }
  }

  const favoriteButton = event.target.closest('[data-favorite-id]');
  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favoriteId);
    saveFavorite(id);
    const container = favoriteButton.closest('.product-grid');
    if (container) {
      const visibleCards = [...container.querySelectorAll('.details-button')];
      const visibleIds = visibleCards.map((button) => Number(button.dataset.productId));
      const visibleProducts = allProducts.filter((product) => visibleIds.includes(product.id));
      renderProducts(container, visibleProducts);
    }
  }

  if (event.target.closest('.dialog-close') && dialog) dialog.close();
});

if (dialog) {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}

loadProducts();
