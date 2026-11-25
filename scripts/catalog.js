import { fetchProducts, formatUGX } from "./dataService.js";

const STORAGE_KEY = "napio_favorites_v1";
const productList = document.querySelector("#product-list");
const featuredProducts = document.querySelector("#featured-products");
const errorEl = document.querySelector("#catalog-error") || document.querySelector("#product-error");
const filterGroup = document.querySelector("#category-filters");
const savedSummary = document.querySelector("#saved-summary");
const dialog = document.querySelector("#product-dialog");
const dialogContent = document.querySelector("#dialog-content");
const dialogClose = dialog?.querySelector(".dialog-close");

let allProducts = [];
let activeCategory = "all";
let savedIds = loadFavorites();

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFavorites(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  if (savedSummary) {
    savedSummary.textContent = `Saved favorites: ${ids.length}`;
  }
}

function renderCardMarkup(item) {
  const isSaved = savedIds.includes(item.id);
  return `
    <article class="product-card">
      <p class="card-category">${item.category}</p>
      <h3>${item.name}</h3>
      <p class="card-finish">Finish: ${item.finish}</p>
      <p class="card-price">${formatUGX(item.price)}</p>
      <div class="card-actions">
        <button type="button" class="btn-secondary details-btn" data-id="${item.id}">Details</button>
        <button type="button" class="btn-save save-btn" data-id="${item.id}" aria-pressed="${isSaved}">
          ${isSaved ? "Saved" : "Save"}
        </button>
      </div>
    </article>
  `;
}

function renderList(container, items) {
  if (!container) return;
  container.innerHTML = items.map(renderCardMarkup).join("");
}

function openProductModal(productId) {
  const item = allProducts.find((entry) => entry.id === productId);
  if (!item || !dialog || !dialogContent) return;

  dialogContent.innerHTML = `
    <p class="eyebrow">${item.category}</p>
    <h2 id="dialog-title">${item.name}</h2>
    <p><strong>Price:</strong> ${formatUGX(item.price)}</p>
    <p><strong>Finish:</strong> ${item.finish}</p>
    <p>${item.description}</p>
  `;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  }
}

function toggleFavorite(productId) {
  savedIds = savedIds.includes(productId)
    ? savedIds.filter((id) => id !== productId)
    : [...savedIds, productId];
  saveFavorites(savedIds);
  applyFilterAndRender();
}

function applyFilterAndRender() {
  const filtered =
    activeCategory === "all"
      ? allProducts
      : allProducts.filter((item) => item.category === activeCategory);

  renderList(productList, filtered);
  renderList(
    featuredProducts,
    allProducts.filter((item) => item.featured)
  );
}

function bindCardEvents(container) {
  container?.addEventListener("click", (event) => {
    const detailsBtn = event.target.closest(".details-btn");
    const saveBtn = event.target.closest(".save-btn");

    if (detailsBtn) {
      openProductModal(detailsBtn.dataset.id);
    } else if (saveBtn) {
      toggleFavorite(saveBtn.dataset.id);
    }
  });
}

filterGroup?.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-btn");
  if (!button) return;

  activeCategory = button.dataset.category;
  filterGroup.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.toggle("is-selected", btn === button);
  });
  applyFilterAndRender();
});

dialogClose?.addEventListener("click", () => {
  dialog?.close();
});

async function init() {
  saveFavorites(savedIds);
  bindCardEvents(productList);
  bindCardEvents(featuredProducts);

  try {
    allProducts = await fetchProducts();
    applyFilterAndRender();
  } catch (error) {
    if (errorEl) {
      errorEl.textContent = `Could not load products right now. ${error.message}`;
    }
  }
}

init();