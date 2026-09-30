import { LitElement, html } from 'lit';

/**
 * Componente Tarjeta de Producto (Product Card) creado con Lit y Tailwind CSS.
 */
export class ProductCard extends LitElement {
  static properties = {
    // Atributos recibidos desde el HTML
    title: { type: String },
    description: { type: String },
    price: { type: String },
    oldPrice: { type: String },
    image: { type: String },
    category: { type: String },
    rating: { type: Number },
    badge: { type: String },
    
    // Estados internos de cada tarjeta (aislados por componente)
    isFavorite: { type: Boolean },
    inCart: { type: Boolean }
  };

  constructor() {
    super();
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

  // Desactivamos Shadow DOM para trabajar directo con Tailwind CSS
  createRenderRoot() {
    return this;
  }

  // Cambia el estado de favorito de esta tarjeta
  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  // Agrega al carrito y dispara un CustomEvent nativo
  addToCart() {
    this.inCart = true;

    // 💡 CONCEPTO AVANZADO: Comunicación mediante CustomEvent
    // Disparamos un evento para que la página principal (o un carrito global) se entere
    this.dispatchEvent(new CustomEvent('add-to-cart', {
      detail: {
        title: this.title,
        price: this.price,
        image: this.image
      },
      bubbles: true,
      composed: true
    }));

    // Reseteamos el estado de "¡Agregado!" después de 2 segundos
    setTimeout(() => {
      this.inCart = false;
    }, 2000);
  }

  render() {
    return html`
      <div class="group relative bg-slate-800/80 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-700/60 shadow-xl hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 flex flex-col h-full">
        
        <!-- CONTENEDOR DE LA IMAGEN -->
        <div class="relative h-56 w-full overflow-hidden bg-slate-900">
          <!-- BADGE DE DESCUENTO O ETIQUETA -->
          ${this.badge ? html`
            <span class="absolute top-3 left-3 z-10 text-xs font-black tracking-wider uppercase px-2.5 py-1 rounded-lg bg-red-500 text-white shadow-md">
              ${this.badge}
            </span>
          ` : ''}

          <!-- BOTÓN FAVORITO (CORAZÓN) -->
          <button 
            @click="${this.toggleFavorite}"
            class="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-lg transition-transform active:scale-90 cursor-pointer"
            aria-label="Agregar a favoritos"
          >
            <span class="${this.isFavorite ? 'text-red-500 scale-110' : 'text-slate-400'} transition-all">
              ${this.isFavorite ? '❤️' : '🤍'}
            </span>
          </button>

          <!-- IMAGEN CON EFECTO ZOOM AL PASAR EL MOUSE -->
          <img 
            src="${this.image}" 
            alt="${this.title}" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <!-- CUERPO DE LA TARJETA -->
        <div class="p-5 flex flex-col flex-1 justify-between space-y-4">
          <div class="space-y-2">
            <!-- CATEGORÍA Y PUNTUACIÓN -->
            <div class="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span class="uppercase tracking-wider text-blue-400 font-semibold">${this.category}</span>
              <span class="flex items-center gap-1 text-amber-400 font-bold">
                ⭐ ${this.rating}
              </span>
            </div>

            <!-- TÍTULO Y DESCRIPCIÓN -->
            <h3 class="font-bold text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-1">
              ${this.title}
            </h3>

            <p class="text-slate-300 text-xs line-clamp-2 leading-relaxed">
              ${this.description}
            </p>
          </div>

          <!-- PRECIOS Y BOTÓN DE COMPRA -->
          <div class="pt-2 border-t border-slate-700/60 flex items-center justify-between">
            <div>
              ${this.oldPrice ? html`
                <span class="text-xs text-slate-400 line-through block leading-none">${this.oldPrice}</span>
              ` : ''}
              <span class="text-xl font-black text-white">${this.price}</span>
            </div>

            <!-- BOTÓN DE ACCIÓN -->
            <button 
              @click="${this.addToCart}"
              class="px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                this.inCart 
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
              }"
            >
              ${this.inCart ? html`✓ ¡Agregado!` : html`🛒 Agregar`}
            </button>
          </div>
        </div>

      </div>
    `;
  }
}

// Registramos el Custom Element <product-card>
customElements.define('product-card', ProductCard);
