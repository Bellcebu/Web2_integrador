import { LitElement, html } from 'lit';
import { 
  getCart, 
  getCartCount, 
  getCartTotal, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  FREE_SHIPPING_THRESHOLD 
} from '../utils/cart.js';

export class CartDrawer extends LitElement {
  static properties = {
    isOpen: { type: Boolean },
    cart: { type: Array },
    showSuccessModal: { type: Boolean },
    lastOrderNumber: { type: String }
  };

  constructor() {
    super();
    this.isOpen = false;
    this.cart = [];
    this.showSuccessModal = false;
    this.lastOrderNumber = '';
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.refreshCart();

    this._onCartUpdate = () => {
      this.refreshCart();
    };
    window.addEventListener('cart-updated', this._onCartUpdate);

    this._onGlobalClick = (e) => {
      const link = e.target.closest('a[href="#carrito"], [data-open-cart]');
      if (link) {
        e.preventDefault();
        this.open();
      }
    };
    document.addEventListener('click', this._onGlobalClick);

    this._onKeyDown = (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    };
    window.addEventListener('keydown', this._onKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._onCartUpdate) window.removeEventListener('cart-updated', this._onCartUpdate);
    if (this._onGlobalClick) document.removeEventListener('click', this._onGlobalClick);
    if (this._onKeyDown) window.removeEventListener('keydown', this._onKeyDown);
  }

  refreshCart() {
    this.cart = getCart();
    this.requestUpdate();
  }

  open() {
    this.refreshCart();
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    document.body.style.overflow = '';
  }

  handleRemoveItem(item) {
    removeFromCart(item.id, item.color, item.size);
  }

  handleQuantityChange(item, delta) {
    updateQuantity(item.id, item.color, item.size, delta);
  }

  handleClearCart() {
    if (confirm('¿Estás seguro de que querés vaciar todo el carrito?')) {
      clearCart();
    }
  }

  handleCheckout() {
    if (this.cart.length === 0) return;
    
    this.lastOrderNumber = `#AR-${Math.floor(100000 + Math.random() * 900000)}`;
    clearCart();
    this.showSuccessModal = true;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.close();
  }

  render() {
    const count = getCartCount();
    const total = getCartTotal();
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
    const progressPercent = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));

    return html`
      <div class="relative z-50 ${this.isOpen ? 'pointer-events-auto' : 'pointer-events-none'}">
        
        <div 
          class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ${
            this.isOpen ? 'opacity-100' : 'opacity-0'
          }"
          @click="${this.close}"
        ></div>

        <div 
          class="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out transform ${
            this.isOpen ? 'translate-x-0' : 'translate-x-full'
          }"
        >
          <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 class="text-lg font-black text-slate-900 dark:text-white tracking-wide">
              Mi carrito (${count})
            </h2>
            <button 
              @click="${this.close}"
              class="p-2 -mr-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer focus:outline-none"
              aria-label="Cerrar carrito"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar">
            ${this.cart.length === 0 ? html`
              <div class="py-20 text-center space-y-4">
                <span class="text-5xl block">🛍️</span>
                <h3 class="text-base font-bold text-slate-800 dark:text-slate-200">
                  Tu carrito está vacío
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Agregá prendas desde el catálogo para aprovechar cuotas sin interés y envíos a todo el país.
                </p>
                <div class="pt-2">
                  <a 
                    href="listado.html" 
                    @click="${this.close}"
                    class="inline-block px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-85 transition"
                  >
                    Explorar Catálogo
                  </a>
                </div>
              </div>
            ` : html`
              <div class="divide-y divide-slate-100 dark:divide-slate-800/80">
                ${this.cart.map(item => html`
                  <div class="py-4 first:pt-0 last:pb-0 flex items-start gap-4 group">
                    <div class="w-20 h-26 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700/60">
                      <img 
                        src="${item.image}" 
                        alt="${item.title}" 
                        class="w-full h-full object-cover"
                      />
                    </div>

                    <div class="flex-1 min-w-0 flex flex-col justify-between h-26">
                      <div class="flex items-start justify-between gap-2">
                        <div>
                          <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase truncate">
                            ${item.title}
                          </h4>
                          <span class="text-[11px] text-slate-400 block mt-0.5">
                            ${item.color || 'Negro'} • ${item.size || 'Único'}
                          </span>
                        </div>
                        
                        <button 
                          @click="${() => this.handleRemoveItem(item)}"
                          class="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Eliminar producto"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      <div class="flex items-end justify-between pt-2">
                        <span class="text-sm font-black text-slate-900 dark:text-white">
                          $ ${((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString('es-AR')}
                        </span>

                        <div class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                          <button 
                            @click="${() => this.handleQuantityChange(item, -1)}"
                            class="w-6 h-6 rounded flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
                            title="Quitar una unidad"
                          >
                            −
                          </button>
                          <span class="text-xs font-bold w-6 text-center text-slate-900 dark:text-white">
                            ${item.quantity}
                          </span>
                          <button 
                            @click="${() => this.handleQuantityChange(item, 1)}"
                            class="w-6 h-6 rounded flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition cursor-pointer"
                            title="Agregar una unidad"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                `)}
              </div>
            `}
          </div>

          ${this.cart.length > 0 ? html`
            <div class="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 space-y-4">
              
              <div class="space-y-2">
                <p class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  ${remaining > 0 ? html`
                    Te faltan <strong class="font-black">$ ${remaining.toLocaleString('es-AR')}</strong> para que tu <strong class="font-black">ENVIO</strong> sea <strong class="font-black">GRATIS! 😎</strong>
                  ` : html`
                    ¡Felicidades! Ya tenés <strong class="text-emerald-500 font-black">ENVIO GRATIS! 🎉</strong>
                  `}
                </p>

                <div class="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div 
                    class="bg-[#5eead4] h-full transition-all duration-500 rounded-full"
                    style="width: ${progressPercent}%"
                  ></div>
                </div>
              </div>

              <div class="flex items-center justify-between pt-1">
                <span class="text-base font-bold text-slate-900 dark:text-white">
                  Total
                </span>
                <span class="text-2xl font-black text-slate-900 dark:text-white">
                  $ ${total.toLocaleString('es-AR')}
                </span>
              </div>

              <button 
                @click="${this.handleCheckout}"
                class="w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider bg-[#5eead4] hover:bg-[#2dd4bf] text-slate-950 shadow-md active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                PAGAR
              </button>

              <button 
                @click="${this.handleClearCart}"
                class="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors cursor-pointer"
              >
                Vaciar el carrito
              </button>
            </div>
          ` : ''}

        </div>
      </div>

      ${this.showSuccessModal ? html`
        <div class="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" @click="${this.closeSuccessModal}"></div>
          <div class="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-5 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            
            <div class="space-y-2">
              <h3 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                ¡Gracias por su compra profe! 🎉
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Tu pedido <strong>${this.lastOrderNumber}</strong> ha sido simulado y procesado exitosamente. Se vació el carrito correctamente.
              </p>
            </div>

            <button 
              @click="${this.closeSuccessModal}"
              class="w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition cursor-pointer shadow-md"
            >
              Seguir explorando
            </button>
          </div>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('cart-drawer', CartDrawer);
