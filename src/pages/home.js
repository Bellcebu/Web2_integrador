import '../themes.js';
import { toggleTheme } from '../themes.js';

import '../components/my-button.js';
import '../components/infinite-ticker.js';
import '../components/hero-carousel.js';
import '../components/app-sidebar.js';
import '../components/product-card.js';
import '../components/cart-drawer.js';

import { getProducts, getProductImageUrl } from '../api/products.js';
import { getCategories } from '../api/categories.js';

import { addToCart, initCartBadge } from '../utils/cart.js';

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  toggleTheme();
});

initCartBadge('cart-counter');

document.addEventListener('add-to-cart', (e) => {
  const { id, title, price, image } = e.detail;
  addToCart({ id, title, price, image });
});

async function loadCategories() {
  const container = document.getElementById('categories-container');
  if (!container) return;

  try {
    const categories = await getCategories();
    if (categories && categories.length > 0) {
      const realCategories = categories.filter(cat => {
        const title = (cat.title || '').trim().toUpperCase();
        return title && title !== 'ROPA';
      });

      const displayList = realCategories.length > 0 ? realCategories : categories;

      container.innerHTML = displayList.map(cat => `
        <a 
          href="listado.html?categoria=${cat.id}" 
          class="px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all shadow-xs whitespace-nowrap"
        >
          ${cat.title}
        </a>
      `).join('');
    }
  } catch (error) {
    console.warn('No se pudieron cargar categorías desde la API:', error);
  }
}

async function loadProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  try {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400 animate-pulse font-medium">
        Cargando catálogo de ropa desde la API...
      </div>
    `;

    const products = await getProducts();

    if (products && products.length > 0) {
      const carousel = document.querySelector('hero-carousel');
      if (carousel && typeof carousel.setProducts === 'function') {
        const recentFeatured = products.slice(0, 3);
        carousel.setProducts(recentFeatured);
      }

      const seenCategories = new Set();
      const onePerCategory = [];

      for (const prod of products) {
        const catId = prod.category_id || prod.category?.id;
        if (catId && !seenCategories.has(catId)) {
          seenCategories.add(catId);
          onePerCategory.push(prod);
        }
      }

      const gridProducts = onePerCategory.length > 0 ? onePerCategory : products;

      grid.innerHTML = gridProducts.map(prod => `
        <product-card 
          productId="${prod.id}"
          title="${prod.title}"
          description="${prod.description || 'Prenda de moda urbana.'}"
          price="$${Number(prod.price || 0).toLocaleString('es-AR')}"
          category="${prod.category?.title || 'Ropa'}"
          rating="4.8"
          badge="${prod.tags?.[0]?.name || 'Nuevo'}"
          image="${getProductImageUrl(prod)}"
        >
        </product-card>
      `).join('');
    } else {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-400">
          No hay productos cargados en la API para este token.
        </div>
      `;
    }
  } catch (error) {
    console.error('Error al conectar con la API de productos:', error);
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center text-red-500 font-semibold">
        Error al cargar los productos de la API.
      </div>
    `;
  }
}

loadCategories();
loadProducts();
