import '../themes.js';
import { toggleTheme } from '../themes.js';

import '../components/infinite-ticker.js';
import '../components/app-sidebar.js';
import '../components/my-button.js';
import '../components/cart-drawer.js';

import { getProductById, getProductImageUrl } from '../api/products.js';
import { addToCart, initCartBadge } from '../utils/cart.js';

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  toggleTheme();
});

initCartBadge('cart-counter');

async function loadProductDetail() {
  const loadingState = document.getElementById('loading-state');
  const fichaContent = document.getElementById('ficha-content');
  if (!fichaContent) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('producto') || urlParams.get('id') || '1803';

  try {
    const product = await getProductById(productId);

    if (!product || !product.id) {
      throw new Error('Producto no encontrado');
    }

    document.title = `${product.title} - URBAN STORE`;

    const priceNumber = Number(product.price || 0);
    const formattedPrice = `$ ${priceNumber.toLocaleString('es-AR')}`;
    const quotaPrice = `$ ${(priceNumber / 3).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
    const taxFreePrice = `$ ${(priceNumber * 0.79).toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
    const mainImage = getProductImageUrl(product);

    loadingState?.classList.add('hidden');
    fichaContent.classList.remove('hidden');

    let selectedColor = 'Negro';
    const selectedSize = 'Talle Único';

    fichaContent.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-start">
        <div class="space-y-4">
          <div class="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm group">
            <img 
              id="main-product-img"
              src="${mainImage}" 
              alt="${product.title}" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            <span class="absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md bg-slate-900/80 text-white dark:bg-white/90 dark:text-slate-900 backdrop-blur-xs">
              ${product.category?.title || 'Prenda Exclusiva'}
            </span>
          </div>

          ${Array.isArray(product.pictures) && product.pictures.length > 1 ? `
            <div class="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              ${product.pictures.map((pic, idx) => {
                const url = pic.startsWith('http') ? pic : `https://ecommerce.fedegonzalez.com${pic}`;
                return `
                  <button 
                    onclick="document.getElementById('main-product-img').src = '${url}'"
                    class="w-16 h-20 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white transition-all shrink-0 cursor-pointer"
                  >
                    <img src="${url}" class="w-full h-full object-cover" alt="Miniatura ${idx + 1}" />
                  </button>
                `;
              }).join('')}
            </div>
          ` : ''}
        </div>

        <div class="space-y-6">
          <div class="border-b border-slate-200 dark:border-slate-800 pb-5">
            <div class="flex items-start justify-between gap-4">
              <h1 class="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-tight">
                ${product.title}
              </h1>
              <div class="text-right shrink-0">
                <span class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block">
                  ${formattedPrice}
                </span>
              </div>
            </div>
            
            <p class="text-xs text-slate-400 mt-1">
              Precio sin impuestos nacionales: ${taxFreePrice}
            </p>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <span>COLOR: <strong id="color-label" class="text-slate-900 dark:text-white ml-1">Negro</strong></span>
            </div>
            
            <div class="flex items-center gap-3">
              <button 
                type="button"
                id="color-negro"
                data-color="Negro"
                class="color-btn relative w-9 h-9 rounded-full bg-slate-950 border-2 border-slate-300 dark:border-slate-600 transition-all cursor-pointer ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-900"
                title="Color Negro"
              ></button>

              <button 
                type="button"
                id="color-blanco"
                data-color="Blanco"
                class="color-btn relative w-9 h-9 rounded-full bg-white border-2 border-slate-300 dark:border-slate-600 transition-all cursor-pointer ring-offset-2 hover:scale-105"
                title="Color Blanco"
              ></button>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <span>TALLE: <strong class="text-slate-900 dark:text-white ml-1">Talle Único</strong></span>
              <a href="#guia-talles" class="text-[11px] underline hover:opacity-75 transition-opacity cursor-pointer">
                GUÍA DE TALLES
              </a>
            </div>

            <div class="flex items-center gap-2">
              <span class="px-5 py-2 rounded-full text-xs font-black tracking-wider uppercase bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs">
                Único
              </span>
            </div>
          </div>

          <div class="pt-2 space-y-3">
            <button 
              id="btn-add-to-cart"
              type="button"
              class="w-full py-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 shadow-md active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span id="btn-text">AGREGAR AL CARRITO</span>
            </button>

            <div class="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1.5">
              <div class="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
                <span>💳</span>
                <span>Hasta 3 cuotas sin interés de <strong>${quotaPrice}</strong></span>
              </div>
              <div class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                <span>🏷️</span>
                <span>15% OFF pagando con transferencia bancaria</span>
              </div>
            </div>
          </div>

          <div class="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-3">
            <button 
              type="button"
              id="toggle-description"
              class="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white cursor-pointer py-1"
            >
              <span>DESCRIPCIÓN</span>
              <span id="desc-icon" class="text-base font-normal">−</span>
            </button>

            <div id="description-body" class="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>${product.description || 'Prenda de moda urbana confeccionada con telas de primera calidad.'}</p>
              
              <ul class="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400 pt-1 text-xs">
                <li><strong>Composición:</strong> 85% algodón peinado – 15% elastano de alta resistencia.</li>
                <li><strong>Cuidados:</strong> Lavado a máquina con agua fría y del revés. No usar blanqueador.</li>
                <li><strong>Calce:</strong> Regular confort con caída relajada.</li>
              </ul>
            </div>
          </div>

          <div class="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
            <button 
              type="button"
              id="toggle-returns"
              class="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white cursor-pointer py-1"
            >
              <span>CAMBIOS Y DEVOLUCIONES</span>
              <span id="returns-icon" class="text-base font-normal">+</span>
            </button>

            <div id="returns-body" class="hidden text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
              Tenés hasta 30 días corridos a partir de la fecha de recepción de tu pedido para solicitar cambios o devoluciones sin cargo en cualquiera de nuestras sucursales o por correo.
            </div>
          </div>

          <div class="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center space-y-1">
            <p class="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              ENVÍO EXPRESS DISPONIBLE 🚀 CABA Y GBA
            </p>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              Recibilo dentro de las 24 a 48 hs hábiles en tu domicilio.
            </p>
          </div>

        </div>

      </div>
    `;

    const colorNegroBtn = document.getElementById('color-negro');
    const colorBlancoBtn = document.getElementById('color-blanco');
    const colorLabel = document.getElementById('color-label');

    function setActiveColor(color) {
      selectedColor = color;
      if (colorLabel) colorLabel.textContent = color;

      if (color === 'Negro') {
        colorNegroBtn?.classList.add('ring-2', 'ring-slate-900', 'dark:ring-white');
        colorBlancoBtn?.classList.remove('ring-2', 'ring-slate-900', 'dark:ring-white');
      } else {
        colorBlancoBtn?.classList.add('ring-2', 'ring-slate-900', 'dark:ring-white');
        colorNegroBtn?.classList.remove('ring-2', 'ring-slate-900', 'dark:ring-white');
      }
    }

    colorNegroBtn?.addEventListener('click', () => setActiveColor('Negro'));
    colorBlancoBtn?.addEventListener('click', () => setActiveColor('Blanco'));

    const btnAddToCart = document.getElementById('btn-add-to-cart');
    const btnText = document.getElementById('btn-text');

    btnAddToCart?.addEventListener('click', () => {
      addToCart({
        id: product.id,
        title: product.title,
        price: formattedPrice,
        image: mainImage,
        color: selectedColor,
        size: selectedSize,
        quantity: 1
      });

      if (btnText) {
        btnText.textContent = '¡AGREGADO AL CARRITO! ✓';
        btnAddToCart.classList.remove('bg-slate-900', 'hover:bg-black', 'dark:bg-white', 'dark:hover:bg-slate-100', 'dark:text-slate-900');
        btnAddToCart.classList.add('bg-emerald-600', 'hover:bg-emerald-700', 'text-white');

        setTimeout(() => {
          btnText.textContent = 'AGREGAR AL CARRITO';
          btnAddToCart.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
          btnAddToCart.classList.add('bg-slate-900', 'hover:bg-black', 'text-white', 'dark:bg-white', 'dark:hover:bg-slate-100', 'dark:text-slate-900');
        }, 2200);
      }
    });

    const toggleDescBtn = document.getElementById('toggle-description');
    const descBody = document.getElementById('description-body');
    const descIcon = document.getElementById('desc-icon');
    toggleDescBtn?.addEventListener('click', () => {
      const isHidden = descBody.classList.toggle('hidden');
      if (descIcon) descIcon.textContent = isHidden ? '+' : '−';
    });

    const toggleReturnsBtn = document.getElementById('toggle-returns');
    const returnsBody = document.getElementById('returns-body');
    const returnsIcon = document.getElementById('returns-icon');
    toggleReturnsBtn?.addEventListener('click', () => {
      const isHidden = returnsBody.classList.toggle('hidden');
      if (returnsIcon) returnsIcon.textContent = isHidden ? '+' : '−';
    });

  } catch (error) {
    console.error('Error al cargar la ficha del producto:', error);
    loadingState?.classList.add('hidden');
    fichaContent.classList.remove('hidden');
    fichaContent.innerHTML = `
      <div class="py-16 text-center space-y-4 max-w-md mx-auto">
        <span class="text-4xl">🛍️</span>
        <h2 class="text-xl font-black text-slate-900 dark:text-white">Prenda no encontrada</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          No pudimos encontrar la prenda solicitada en la API. Pudo haber sido modificada o eliminada.
        </p>
        <div class="pt-2">
          <a 
            href="index.html" 
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-85 transition"
          >
            ← Volver al catálogo
          </a>
        </div>
      </div>
    `;
  }
}

loadProductDetail();
