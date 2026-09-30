import { apiFetch, API_BASE_URL } from './client.js';

export async function getCategories() {
  return apiFetch('/categories/');
}

export async function getCategoryById(id) {
  return apiFetch(`/categories/${id}`);
}

export function getCategoryImageUrl(category) {
  if (category && category.picture) {
    return category.picture.startsWith('http') ? category.picture : `${API_BASE_URL}${category.picture}`;
  }
  return null;
}
