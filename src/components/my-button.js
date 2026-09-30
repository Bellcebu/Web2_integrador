import { LitElement, html } from 'lit';

/**
 * Componente Botón reutilizable creado con Lit y estilizado con Tailwind CSS.
 */
export class MyButton extends LitElement {
  // 1. Definimos las propiedades (atributos) que el botón puede recibir desde fuera
  static properties = {
    label: { type: String },
    variant: { type: String }, // 'primary' | 'secondary' | 'danger'
    type: { type: String },    // 'button' | 'submit' | 'reset'
    disabled: { type: Boolean }
  };

  constructor() {
    super();
    // Valores por defecto
    this.label = 'Boton';
    this.variant = 'primary';
    this.type = 'button';
    this.disabled = false;
  }

  // 2. Desactivamos Shadow DOM para que Tailwind CSS funcione directamente en el componente
  createRenderRoot() {
    return this;
  }

  // 3. Método render: retorna el HTML dinamico del componente
  render() {
    // Estilos base de Tailwind CSS
    const baseStyles = "px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    // Variantes de color según la propiedad `variant`
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
        <!-- <slot> permite poner texto o HTML adentro del componente: <my-button>Texto</my-button> -->
        <slot>${this.label}</slot>
      </button>
    `;
  }
}

// 4. Registramos nuestra etiqueta personalizada en el navegador
customElements.define('my-button', MyButton);
