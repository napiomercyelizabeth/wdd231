export async function fetchProducts(url = "data/products.json") {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to load products (${response.status})`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid product catalog format");
  }
  return data;
}

export function formatUGX(amount) {
  return `UGX ${Number(amount).toLocaleString("en-UG")}`;
}