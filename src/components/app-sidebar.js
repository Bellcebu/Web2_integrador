import { LitElement, html } from 'lit';

/**
 * Componente Barra Lateral (Sidebar / Drawer) deslizable creado con Lit y Tailwind CSS.
 */
export class AppSidebar extends LitElement {
  static properties = {
    // Propiedad reactiva: controla si el sidebar está abierto (true) o cerrado (false)
    isOpen: { type: Boolean }
  };

  constructor() {
    super();
    this.isOpen = false;

    // Enlaces de navegación con iconos
    this.navItems = [
      { label: 'Inicio', icon: '🏠', badge: null, active: true },
      { label: 'Catálogo de Productos', icon: '🛍️', badge: 'Nuevo', active: false },
      { label: 'Ofertas relámpago', icon: '⚡', badge: '15% OFF', active: false },
      { label: 'Mi Carrito', icon: '🛒', badge: '3', active: false },
      { label: 'Favoritos', icon: '❤️', badge: null, active: false },
      { label: 'Configuración', icon: '⚙️', badge: null, active: false }
    ];
  }

  // Desactivamos Shadow DOM para que Tailwind CSS controle las clases
  createRenderRoot() {
    return this;
  }

  // Métodos para cambiar el estado abierto/cerrado
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
      <!-- 1. BOTÓN DISPARADOR (Hamburguesa) PARA ABRIR LA BARRA LATERAL -->
      <button 
        @click="${this.toggle}"
        class="fixed top-4 left-4 z-40 p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl shadow-lg border border-slate-700 transition-all active:scale-95 flex items-center gap-2 cursor-pointer group"
        aria-label="Abrir menú de navegación"
      >
        <span class="text-xl transition-transform group-hover:scale-110">☰</span>
        <span class="text-xs font-semibold tracking-wider uppercase text-slate-300 hidden sm:inline">Menú</span>
      </button>

      <!-- 2. FONDO OSCURO (OVERLAY / BACKDROP) CON EFECTO DE DESENFOQUE -->
      <div 
        class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          this.isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }"
        @click="${this.close}"
      ></div>

      <!-- 3. CONTENEDOR DE LA BARRA LATERAL (SIDEBAR DRAWER) -->
      <aside 
        class="fixed top-0 left-0 h-full w-80 bg-slate-900 border-r border-slate-800 text-slate-100 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out transform ${
          this.isOpen ? 'translate-x-0' : '-translate-x-full'
        }"
      >
        <!-- CABECERA DEL SIDEBAR -->
        <div class="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-md">
              E
            </div>
            <div>
              <h2 class="font-bold text-lg text-white leading-none">E-Commerce</h2>
              <span class="text-xs text-slate-400">Panel de Navegación</span>
            </div>
          </div>

          <!-- BOTÓN CERRAR (X) -->
          <button 
            @click="${this.close}"
            class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <!-- CUERPO DE NAVEGACIÓN (LISTA DE ENLACES) -->
        <nav class="flex-1 p-4 space-y-1.5 overflow-y-auto">
          ${this.navItems.map(item => html`
            <a 
              href="#" 
              class="flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${
                item.active 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }"
            >
              <div class="flex items-center gap-3">
                <span class="text-xl">${item.icon}</span>
                <span>${item.label}</span>
              </div>

              ${item.badge ? html`
                <span class="text-xs font-bold px-2 py-0.5 rounded-full ${
                  item.badge === 'Nuevo' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  item.badge === '15% OFF' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  'bg-blue-600 text-white'
                }">
                  ${item.badge}
                </span>
              ` : ''}
            </a>
          `)}
        </nav>

        <!-- PIE DEL SIDEBAR (PERFIL DE USUARIO) -->
        <div class="p-4 border-t border-slate-800 bg-slate-950/40">
          <div class="flex items-center gap-3 p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg">
              👤
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-white truncate">Usuario Demo</p>
              <p class="text-xs text-slate-400 truncate">admin@tienda.com</p>
            </div>
          </div>
        </div>
      </aside>
    `;
  }
}

// Registramos el Custom Element <app-sidebar>
customElements.define('app-sidebar', AppSidebar);
