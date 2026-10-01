import '../themes.js';
import { toggleTheme } from '../themes.js';

import '../components/infinite-ticker.js';
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

let allProducts = [];
let categoriesList = [];
let activeCategoryId = 'all';

const titleEl = document.getElementById('page-category-title');
const countEl = document.getElementById('product-count-label');
const gridEl = document.getElementById('products-grid');
const pillsContainer = document.getElementById('category-pills');

function getActiveCategoryIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('categoria') || urlParams.get('category_id') || 'all';
}

function renderCategoryPills() {
  if (!pillsContainer) return;

  const validCategories = categoriesList.filter(c => {
    const t = (c.title || '').trim().toUpperCase();
    return t && t !== 'ROPA';
  });

  const activeAll = String(activeCategoryId) === 'all';

  pillsContainer.innerHTML = `
    <button 
      type="button"
      data-cat-id="all"
      class="cat-pill px-5 py-2 rounded-full text-xs font-black tracking-wider uppercase border transition-all whitespace-nowrap cursor-pointer ${
        activeAll 
          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs' 
          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-black dark:hover:border-white'
      }"
    >
      Todos
    </button>
    ${validCategories.map(cat => {
      const isActive = String(cat.id) === String(activeCategoryId);
      return `
        <button 
          type="button"
          data-cat-id="${cat.id}"
          class="cat-pill px-5 py-2 rounded-full text-xs font-black tracking-wider uppercase border transition-all whitespace-nowrap cursor-pointer ${
            isActive 
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs' 
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-black dark:hover:border-white'
          }"
        >
          ${cat.title}
        </button>
      `;
    }).join('')}
  `;
}

function applyCategoryFilter(catId, updateUrl = true) {
  activeCategoryId = String(catId);

  if (updateUrl) {
    const newUrl = activeCategoryId === 'all' 
      ? 'listado.html' 
      : `listado.html?categoria=${activeCategoryId}`;
    window.history.pushState({ categoryId: activeCategoryId }, '', newUrl);
  }

  renderCategoryPills();

  let displayProducts = allProducts;
  if (activeCategoryId !== 'all') {
    displayProducts = allProducts.filter(p => {
      const pCatId = p.category_id || p.category?.id;
      return String(pCatId) === String(activeCategoryId);
    });

    const matchedCat = categoriesList.find(c => String(c.id) === String(activeCategoryId));
    if (matchedCat && titleEl) {
      titleEl.textContent = matchedCat.title;
      document.title = `${matchedCat.title} - URBAN STORE`;
    }
  } else {
    if (titleEl) titleEl.textContent = 'Catálogo de Ropa';
    document.title = 'Catálogo de Ropa - URBAN STORE';
  }

  if (countEl) {
    countEl.textContent = `${displayProducts.length} ${displayProducts.length === 1 ? 'prenda' : 'prendas'}`;
  }

  if (!gridEl) return;

  if (displayProducts.length === 0) {
    gridEl.innerHTML = `
      <div class="col-span-full py-20 text-center space-y-3">
        <span class="text-4xl block">👕</span>
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200">No hay prendas en esta categoría</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">Pronto sumaremos nuevos ingresos a esta sección.</p>
        <div class="pt-2">
          <button 
            type="button" 
            id="btn-show-all"
            class="px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900 text-white dark:bg-white dark:text-slate-900 cursor-pointer"
          >
            Ver todas las prendas
          </button>
        </div>
      </div>
    `;
    document.getElementById('btn-show-all')?.addEventListener('click', () => {
      applyCategoryFilter('all');
    });
    return;
  }

  gridEl.innerHTML = displayProducts.map(prod => `
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
}

pillsContainer?.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-cat-id]');
  if (!btn) return;
  e.preventDefault();
  const catId = btn.getAttribute('data-cat-id');
  applyCategoryFilter(catId, true);
});

window.addEventListener('popstate', () => {
  const catId = getActiveCategoryIdFromUrl();
  applyCategoryFilter(catId, false);
});

async function initCatalog() {
  activeCategoryId = getActiveCategoryIdFromUrl();
  renderCategoryPills();

  try {
    const [fetchedCategories, fetchedProducts] = await Promise.all([
      getCategories().catch(() => []),
      getProducts().catch(() => [])
    ]);

    if (fetchedCategories && fetchedCategories.length > 0) {
      categoriesList = fetchedCategories;
      renderCategoryPills();
    }

    allProducts = fetchedProducts || [];
    applyCategoryFilter(activeCategoryId, false);

  } catch (error) {
    console.error('Error al inicializar catálogo:', error);
    if (gridEl) {
      gridEl.innerHTML = `
        <div class="col-span-full py-16 text-center text-red-500 font-semibold">
          Error al conectar con la API de productos.
        </div>
      `;
    }
  }
}

initCatalog();
