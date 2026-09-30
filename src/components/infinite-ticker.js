import { LitElement, html } from 'lit';

/**
 * Componente de Cinta Infinita de Texto (Marquee/Ticker) creado con Lit y Tailwind CSS.
 */
export class InfiniteTicker extends LitElement {
  static properties = {
    text: { type: String },
    speed: { type: String },     // Ej: '15s', '20s', '30s'
    variant: { type: String }   // 'indigo' | 'amber' | 'emerald' | 'dark'
  };

  constructor() {
    super();
    // Valores por defecto
    this.text = '🔥 ENVÍO GRATIS EN COMPRAS MAYORES A $50.000 • 💳 12 CUOTAS SIN INTERÉS • 🚚 DESPACHO EN 24HS • 🏷️ 15% OFF PAGANDO CON TRANSFERENCIA •';
    this.speed = '20s';
    this.variant = 'indigo';
  }

  // Desactivamos Shadow DOM para integrarlo fácilmente con Tailwind CSS
  createRenderRoot() {
    return this;
  }

  render() {
    // Definimos estilos de fondo y texto según la variante elegida
    const variantStyles = {
      indigo: "bg-indigo-600 text-indigo-100 border-indigo-500",
      amber: "bg-amber-500 text-amber-950 font-bold border-amber-400",
      emerald: "bg-emerald-600 text-emerald-100 border-emerald-500",
      dark: "bg-slate-800 text-slate-200 border-slate-700"
    };

    const currentVariant = variantStyles[this.variant] || variantStyles.indigo;

    return html`
      <div class="overflow-hidden whitespace-nowrap w-full border-y py-3 shadow-inner ${currentVariant}">
        <div 
          class="animate-marquee flex items-center gap-8 font-semibold tracking-wide text-sm uppercase select-none"
          style="--marquee-duration: ${this.speed};"
        >
          <!-- Duplicamos el texto exactamente igual dos veces para lograr el bucle sin interrupciones -->
          <span class="inline-flex items-center gap-8">
            <slot>${this.text}</slot>
          </span>
          <span class="inline-flex items-center gap-8" aria-hidden="true">
            <slot>${this.text}</slot>
          </span>
        </div>
      </div>
    `;
  }
}

// Registramos el Custom Element <infinite-ticker>
customElements.define('infinite-ticker', InfiniteTicker);
