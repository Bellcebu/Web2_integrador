// Importamos todos nuestros componentes web Lit
import '../components/my-button.js';
import '../components/infinite-ticker.js';
import '../components/hero-carousel.js';
import '../components/app-sidebar.js';
import '../components/product-card.js';

// Escuchamos los eventos de agregar al carrito desde las tarjetas de producto
document.addEventListener('add-to-cart', (e) => {
  const { title, price } = e.detail;
  console.log(`🛒 Producto agregado al carrito: ${title} (${price})`);
  
  // Puedes lanzar una alerta o toast en pantalla si lo deseas
});

console.log('Página Home cargada con todos los componentes Lit.');
