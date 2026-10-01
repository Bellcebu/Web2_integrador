import { LitElement, html } from 'lit';

export class MyButton extends LitElement {
  static properties = {
    label: { type: String },
    variant: { type: String },
    type: { type: String },
    disabled: { type: Boolean }
  };

  constructor() {
    super();
    this.label = 'Boton';
    this.variant = 'primary';
    this.type = 'button';
    this.disabled = false;
  }

  createRenderRoot() {
    return this;
  }

  render() {
    const baseStyles = "px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white active:scale-95",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 active:scale-95",
      danger: "bg-red-600 hover:bg-red-700 text-white active:scale-95"
    };

    const variantClass = variants[this.variant] || variants.primary;

    return html`
      <button 
        type="${this.type}" 
        ?disabled="${this.disabled}" 
        class="${baseStyles} ${variantClass}"
      >
        <slot>${this.label}</slot>
      </button>
    `;
  }
}

customElements.define('my-button', MyButton);
