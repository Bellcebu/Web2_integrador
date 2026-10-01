import { apiFetch, API_BASE_URL } from './client.js';

export async function getProducts(categoryId = null) {
  const endpoint = categoryId ? `/products/?category_id=${categoryId}` : '/products/';
  return apiFetch(endpoint);
}

export async function getProductById(id) {
  return apiFetch(`/products/${id}`);
}

export function getProductImageUrl(product) {
  if (product && Array.isArray(product.pictures) && product.pictures.length > 0 && product.pictures[0]) {
    const pic = product.pictures[0];
    return pic.startsWith('http') ? pic : `${API_BASE_URL}${pic}`;
  }
  return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';
}