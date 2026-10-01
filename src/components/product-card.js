import { LitElement, html } from 'lit';

export class ProductCard extends LitElement {
  static properties = {
    productId: { type: String },
    title: { type: String },
    description: { type: String },
    price: { type: String },
    oldPrice: { type: String },
    image: { type: String },
    category: { type: String },
    rating: { type: Number },
    badge: { type: String },

    isFavorite: { type: Boolean },
    inCart: { type: Boolean }
  };

  constructor() {
    super();
    this.productId = '';
    this.title = 'Producto Demo';
    this.description = 'Descripción breve del producto de alta calidad.';
    this.price = '$29.999';
    this.oldPrice = '$35.000';
    this.image = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
    this.category = 'Electrónica';
    this.rating = 4.8;
    this.badge = '-15% OFF';

    this.isFavorite = false;
    this.inCart = false;
  }

  createRenderRoot() {
    return this;
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  addToCart() {
    this.inCart = true;

    this.dispatchEvent(new CustomEvent('add-to-cart', {
      detail: {
        id: this.productId,
        title: this.title,
        price: this.price,
        image: this.image
      },
      bubbles: true,
      composed: true
    }));

    setTimeout(() => {
      this.inCart = false;
    }, 2000);
  }

  render() {
    return html`
      <div class="group relative bg-white dark:bg-slate-800/90 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-full">
        
        <div class="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
          
          ${this.badge ? html`
            <span class="absolute top-2.5 left-2.5 z-10 text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-red-500 text-white shadow-xs">
              ${this.badge}
            </span>
          ` : ''}

          <button 
            @click="${(e) => { e.preventDefault(); e.stopPropagation(); this.toggleFavorite(); }}"
            class="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 backdrop-blur-xs flex items-center justify-center text-sm transition-transform active:scale-90 cursor-pointer shadow-xs"
            aria-label="Agregar a favoritos"
          >
            <span class="${this.isFavorite ? 'text-red-500 scale-110' : 'text-slate-400'} transition-all">
              ${this.isFavorite ? '❤️' : '🤍'}
            </span>
          </button>

          <a href="${this.productId ? `ficha.html?producto=${this.productId}` : '#'}" class="block w-full h-full" title="Ver detalle de la prenda">
            <img 
              src="${this.image}" 
              alt="${this.title}" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </a>
        </div>

        <div class="p-3 sm:p-3.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <a href="${this.productId ? `ficha.html?producto=${this.productId}` : '#'}" class="block group-hover:opacity-80 transition-opacity">
            ${this.oldPrice ? html`
              <span class="text-[10px] text-slate-400 line-through block leading-none">${this.oldPrice}</span>
            ` : ''}
            <span class="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
              ${this.price}
            </span>
          </a>

          <button 
            @click="${(e) => { e.preventDefault(); e.stopPropagation(); this.addToCart(); }}"
            class="p-2 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1 active:scale-95 border ${this.inCart
        ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-600/30'
        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 dark:border-slate-600'
      }"
            title="Agregar al carrito"
          >
            ${this.inCart ? html`
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ` : html`
              <span class="text-xs font-black">+</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            `}
          </button>
        </div>

      </div>
    `;
  }
}

customElements.define('product-card', ProductCard);