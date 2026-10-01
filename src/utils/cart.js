const CART_STORAGE_KEY = 'urban_store_cart';
export const FREE_SHIPPING_THRESHOLD = 200000;

export function parsePrice(price) {
  if (typeof price === 'number') {
    return price < 1000 ? Math.round(price * 1000) : price;
  }
  if (!price) return 0;
  const clean = String(price).replace(/[^0-9]/g, '');
  return Number(clean) || 0;
}

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error al leer el carrito de localStorage:', err);
    return [];
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart-updated', {
      detail: { cart, count: getCartCount(), total: getCartTotal() }
    }));
  } catch (err) {
    console.error('Error al guardar en el carrito:', err);
  }
}

export function addToCart(item) {
  const cart = getCart();
  const color = item.color || 'Negro';
  const size = item.size || 'Único';
  const qty = item.quantity || 1;
  const unitPrice = parsePrice(item.price);

  const existingIndex = cart.findIndex(
    p => String(p.id) === String(item.id) && p.color === color && p.size === size
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + qty;
  } else {
    cart.push({
      id: item.id,
      title: item.title,
      price: item.price,
      unitPrice,
      image: item.image,
      color,
      size,
      quantity: qty
    });
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(id, color = 'Negro', size = 'Único') {
  let cart = getCart();
  cart = cart.filter(
    p => !(String(p.id) === String(id) && p.color === color && p.size === size)
  );
  saveCart(cart);
  return cart;
}

export function updateQuantity(id, color, size, delta) {
  const cart = getCart();
  const index = cart.findIndex(
    p => String(p.id) === String(id) && p.color === color && p.size === size
  );

  if (index > -1) {
    cart[index].quantity = (cart[index].quantity || 1) + delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCart(cart);
  }
  return cart;
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount() {
  const cart = getCart();
  return cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
}

export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((acc, item) => {
    const price = item.unitPrice || parsePrice(item.price);
    return acc + (price * (item.quantity || 1));
  }, 0);
}

export function initCartBadge(badgeId = 'cart-counter') {
  const updateBadge = () => {
    const badge = document.getElementById(badgeId);
    if (badge) {
      const count = getCartCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  };

  updateBadge();

  window.addEventListener('cart-updated', () => {
    updateBadge();
    const badge = document.getElementById(badgeId);
    if (badge) {
      badge.classList.add('scale-125');
      setTimeout(() => badge.classList.remove('scale-125'), 200);
    }
  });

  window.addEventListener('storage', (e) => {
    if (e.key === CART_STORAGE_KEY) {
      updateBadge();
    }
  });
}
