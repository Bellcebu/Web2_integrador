import { LitElement, html } from 'lit';

export class InfiniteTicker extends LitElement {
  static properties = {
    text: { type: String },
    speed: { type: String },
    variant: { type: String }
  };

  constructor() {
    super();
    this.text = '🔥 ENVÍO GRATIS EN COMPRAS MAYORES A $50.000 • 💳 12 CUOTAS SIN INTERÉS • 🚚 DESPACHO EN 24HS • 🏷️ 15% OFF PAGANDO CON TRANSFERENCIA •';
    this.speed = '20s';
    this.variant = 'indigo';
  }

  createRenderRoot() {
    return this;
  }

  shouldUpdate(changedProperties) {
    if (!this._hasRenderedOnce) {
      this._hasRenderedOnce = true;
      if (this.querySelector('.animate-marquee')) {
        return false;
      }
    }
    return true;
  }

  render() {
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

customElements.define('infinite-ticker', InfiniteTicker);
