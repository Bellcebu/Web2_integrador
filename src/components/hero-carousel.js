import { LitElement, html } from 'lit';

export class HeroCarousel extends LitElement {
  static properties = {
    currentIndex: { type: Number },
    autoplay: { type: Boolean },
    interval: { type: Number },
    slides: { type: Array }
  };

  constructor() {
    super();
    this.currentIndex = 0;
    this.autoplay = true;
    this.interval = 5000;
    this.slides = [];
    this._timer = null;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopAutoplay();
  }

  startAutoplay() {
    this.stopAutoplay();
    if (!this.slides || this.slides.length <= 1) return;
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
    if (!this.slides || this.slides.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide() {
    if (!this.slides || this.slides.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index) {
    this.currentIndex = index;
  }

  setProducts(products) {
    if (!products || products.length === 0) return;

    this.slides = products.map((prod) => {
      let img = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80';
      if (prod.pictures && prod.pictures.length > 0 && prod.pictures[0]) {
        const pic = prod.pictures[0];
        img = pic.startsWith('http') ? pic : `https://ecommerce.fedegonzalez.com${pic}`;
      }

      return {
        title: prod.title,
        image: img,
        productId: prod.id
      };
    });

    this.currentIndex = 0;
    this.requestUpdate();
    if (this.autoplay) {
      this.startAutoplay();
    }
  }

  handleTouchStart(e) {
    this._touchStartX = e.changedTouches[0].clientX;
  }

  handleTouchEnd(e) {
    this._touchEndX = e.changedTouches[0].clientX;
    const diff = this._touchEndX - this._touchStartX;
    const threshold = 40;

    if (diff < -threshold) {
      this.nextSlide();
    } else if (diff > threshold) {
      this.prevSlide();
    }
  }

  render() {
    if (!this.slides || this.slides.length === 0) {
      return html`
        <div class="relative w-full h-[500px] sm:h-[580px] md:h-[640px] lg:h-[700px] bg-slate-900 animate-pulse flex flex-col justify-end overflow-hidden">
          <div class="max-w-6xl mx-auto px-6 sm:px-12 w-full pb-16 sm:pb-20">
            <div class="h-9 sm:h-12 w-56 sm:w-80 bg-slate-800 rounded-xl"></div>
          </div>
        </div>
      `;
    }

    const slide = this.slides[this.currentIndex];

    return html`
      <div 
        class="relative w-full overflow-hidden bg-slate-950 group select-none cursor-grab active:cursor-grabbing touch-pan-y"
        @mouseenter="${this.stopAutoplay}"
        @mouseleave="${this.startAutoplay}"
        @touchstart="${this.handleTouchStart}"
        @touchend="${this.handleTouchEnd}"
      >
        <a 
          href="${slide.productId ? `ficha.html?producto=${slide.productId}` : '#'}" 
          class="block relative h-[500px] sm:h-[580px] md:h-[640px] lg:h-[700px] w-full overflow-hidden"
          title="Ver ${slide.title}"
        >
          <img 
            src="${slide.image}" 
            alt="${slide.title}" 
            class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out transform group-hover:scale-105"
          />
          
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent"></div>

          <div class="absolute inset-0 max-w-6xl mx-auto px-6 sm:px-12 flex flex-col justify-end pb-16 sm:pb-20 z-10">
            <h2 class="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-wider leading-tight drop-shadow-md max-w-xl group-hover:underline decoration-white/40 underline-offset-4">
              ${slide.title}
            </h2>
          </div>
        </a>

        <div class="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/50 backdrop-blur-md border border-slate-800">
          ${this.slides.map((_, index) => html`
            <button
              @click="${(e) => { e.preventDefault(); e.stopPropagation(); this.goToSlide(index); }}"
              class="h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                this.currentIndex === index 
                  ? 'w-6 sm:w-7 bg-white shadow-md' 
                  : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
              }"
              aria-label="Ir a la diapositiva ${index + 1}"
            ></button>
          `)}
        </div>
      </div>
    `;
  }
}

customElements.define('hero-carousel', HeroCarousel);
