const menuButton = document.querySelector("#menu-button");
const primaryNav = document.querySelector("#primary-nav");
const yearEl = document.querySelector("#current-year");
const modifiedEl = document.querySelector("#last-modified");

if (menuButton && primaryNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });
}

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

if (modifiedEl) {
  modifiedEl.textContent = `Last Modified: ${document.lastModified}`;
}