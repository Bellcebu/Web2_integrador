import { LitElement, html } from 'lit';

export class AppSidebar extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
    cartCount: { type: Number }
  };

  constructor() {
    super();
    this.isOpen = false;
    this.cartCount = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this.updateCartCount();

    this._onCartUpdate = () => {
      this.updateCartCount();
      this.requestUpdate();
    };
    window.addEventListener('add-to-cart', this._onCartUpdate);
    window.addEventListener('cart-updated', this._onCartUpdate);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._onCartUpdate) {
      window.removeEventListener('add-to-cart', this._onCartUpdate);
      window.removeEventListener('cart-updated', this._onCartUpdate);
    }
  }

  updateCartCount() {
    try {
      const stored = localStorage.getItem('urban_store_cart') || localStorage.getItem('cart');
      if (stored) {
        const items = JSON.parse(stored);
        this.cartCount = Array.isArray(items) 
          ? items.reduce((acc, it) => acc + (it.quantity || 1), 0) 
          : 0;
      } else {
        this.cartCount = 0;
      }
    } catch {
      this.cartCount = 0;
    }
  }

  getNavItems() {
    const path = window.location.pathname;
    const isHome = path === '/' || path.endsWith('/index.html') || path.endsWith('/') || !path.includes('.html');
    const isCategory = path.includes('listado.html');
    const isCart = window.location.hash === '#carrito';

    return [
      {
        label: 'Inicio',
        href: 'index.html',
        active: isHome
      },
      {
        label: 'Categoría',
        href: 'listado.html',
        active: isCategory
      },
      {
        label: 'Carrito de compras',
        href: '#carrito',
        active: isCart,
        badge: this.cartCount > 0 ? `(${this.cartCount})` : null
      }
    ];
  }

  createRenderRoot() {
    return this;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }

  open() {
    this.isOpen = true;
  }

  render() {
    return html`
      <button 
        @click="${this.toggle}"
        class="p-2 -ml-2 text-slate-900 dark:text-white hover:opacity-60 transition-opacity cursor-pointer flex items-center justify-center focus:outline-none"
        aria-label="Abrir menú"
        title="Abrir menú">
        <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <div 
        class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${this.isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }"
        @click="${this.close}"></div>
      <aside 
        class="fixed top-0 left-0 h-full w-72 sm:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-2xl z-50 flex flex-col justify-between transition-transform duration-300 ease-out transform ${this.isOpen ? 'translate-x-0' : '-translate-x-full'
      }">
        <div>
          <div class="p-6 flex items-center justify-end">
            <button 
              @click="${this.close}"
              class="p-2 -mr-2 text-slate-800 dark:text-slate-200 hover:opacity-60 transition-opacity cursor-pointer focus:outline-none"
              aria-label="Cerrar menú"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav class="px-8 pt-4 space-y-6">
            ${this.getNavItems().map(item => html`
              <a 
                href="${item.href}" 
                @click="${() => this.close()}"
                class="flex items-center justify-between text-base font-semibold tracking-wide transition-all ${item.active
          ? 'text-black dark:text-white underline underline-offset-8 decoration-2'
          : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
        }"
              >
                <span>${item.label}</span>
                ${item.badge ? html`
                  <span class="text-xs font-bold text-slate-400 dark:text-slate-500">
                    ${item.badge}
                  </span>
                ` : ''}
              </a>
            `)}
          </nav>
        </div>
        <div class="p-8 border-t border-slate-100 dark:border-slate-800/80">
          <p class="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            URBAN STORE
          </p>
        </div>
      </aside>
    `;
  }
}

customElements.define('app-sidebar', AppSidebar);
