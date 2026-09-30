import { LitElement, html } from 'lit';

/**
 * Componente Carrusel Hero Banner con Lit & Tailwind CSS.
 */
export class HeroCarousel extends LitElement {
  static properties = {
    // Estado reactivo: cuando currentIndex cambia, Lit vuelve a renderizar el componente de forma automática
    currentIndex: { type: Number },
    autoplay: { type: Boolean },
    interval: { type: Number }
  };

  constructor() {
    super();
    this.currentIndex = 0;
    this.autoplay = true;
    this.interval = 5000; // 5 segundos por diapositiva

    // Diapositivas de ejemplo por defecto con imágenes reales de alta calidad
    this.slides = [
      {
        badge: "NUEVA COLECCIÓN 2026",
        title: "Tecnología de Vanguardia",
        description: "Descubre los últimos dispositivos con hasta 30% de descuento y envío rápido.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
        ctaText: "Ver Ofertas",
        badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30"
      },
      {
        badge: "OFERTA POR TIEMPO LIMITADO",
        title: "Sonido Premium Inalámbrico",
        description: "Auriculares con cancelación de ruido activa y batería de 40 horas.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
        ctaText: "Comprar Ahora",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30"
      },
      {
        badge: "EXCLUSIVO WEB",
        title: "Hogar Inteligente & Ecosistemas",
        description: "Transforma tu casa con iluminación RGB y asistencia por voz inteligente.",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80",
        ctaText: "Explorar Más",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      }
    ];

    this._timer = null;
  }

  // Desactivamos Shadow DOM para aplicar clases globales de Tailwind CSS
  createRenderRoot() {
    return this;
  }

  // Ciclo de vida Lit: Se ejecuta cuando el componente se agrega al DOM de la página
  connectedCallback() {
    super.connectedCallback();
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  // Ciclo de vida Lit: Se ejecuta cuando el componente se quita de la página (limpieza)
  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopAutoplay();
  }

  startAutoplay() {
    this.stopAutoplay(); // Evitamos múltiples temporizadores acumulados
    this._timer = setInterval(() => {
      this.nextSlide();
    }, this.interval);
  }

  stopAutoplay() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index) {
    this.currentIndex = index;
  }

  render() {
    const slide = this.slides[this.currentIndex];

    return html`
      <div 
        class="relative w-full max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-2xl bg-slate-900 border border-slate-800 my-6 group"
        @mouseenter="${this.stopAutoplay}"
        @mouseleave="${this.startAutoplay}"
      >
        <!-- FOTO DE FONDO CON OVERLAY GRADIENTE -->
        <div class="relative h-[380px] md:h-[450px] w-full overflow-hidden">
          <img 
            src="${slide.image}" 
            alt="${slide.title}" 
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out transform group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        <!-- CONTENIDO TEXTUAL DE LA DIAPOSITIVA -->
        <div class="absolute inset-0 p-8 md:p-12 flex flex-col justify-center max-w-xl z-10 space-y-4">
          <span class="inline-block self-start text-xs font-bold tracking-widest px-3 py-1 rounded-full border backdrop-blur-md uppercase ${slide.badgeColor}">
            ${slide.badge}
          </span>
          
          <h2 class="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-md">
            ${slide.title}
          </h2>

          <p class="text-slate-300 text-sm md:text-base leading-relaxed">
            ${slide.description}
          </p>

          <div class="pt-2">
            <my-button label="${slide.ctaText}" variant="primary"></my-button>
          </div>
        </div>

        <!-- FLECHAS DE NAVEGACIÓN (ANTERIOR / SIGUIENTE) -->
        <button 
          @click="${this.prevSlide}" 
          class="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white border border-slate-700/50 backdrop-blur-sm flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Diapositiva Anterior"
        >
          ❮
        </button>

        <button 
          @click="${this.nextSlide}" 
          class="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white border border-slate-700/50 backdrop-blur-sm flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Siguiente Diapositiva"
        >
          ❯
        </button>

        <!-- PUNTOS DE NAVEGACIÓN (INDICADORES) -->
        <div class="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/40 backdrop-blur-md border border-slate-800">
          ${this.slides.map((_, index) => html`
            <button
              @click="${() => this.goToSlide(index)}"
              class="h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                this.currentIndex === index 
                  ? 'w-8 bg-blue-500 shadow-lg shadow-blue-500/50' 
                  : 'w-2.5 bg-slate-500/60 hover:bg-slate-400'
              }"
              aria-label="Ir a la diapositiva ${index + 1}"
            ></button>
          `)}
        </div>
      </div>
    `;
  }
}

// Registramos el Custom Element <hero-carousel>
customElements.define('hero-carousel', HeroCarousel);
