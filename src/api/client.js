export const API_BASE_URL = 'https://ecommerce.fedegonzalez.com';
export const API_TOKEN = '922';

export async function apiFetch(endpoint) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error en API (${response.status}): ${response.statusText}`);
  }

  return response.json();
}