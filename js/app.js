const products = [
  { id: 'masala-dosa', category: 'Main plates', categoryId: 'main-plates', name: 'Bengaluru Masala Dosa', price: 240, note: 'Serves 1 · popular', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=700', description: 'Crisp rice-and-lentil dosa wrapped around our spiced potato masala, served with coconut chutney and sambar.', featured: true },
  { id: 'paneer-tikka', category: 'Main plates', categoryId: 'main-plates', name: 'Charred Paneer Tikka Bowl', price: 360, note: 'Serves 1', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=700', description: 'Smoky tandoori paneer, lemon rice, crunchy greens, pickled onions, and a cooling mint dressing.' },
  { id: 'radost-thali', category: 'Main plates', categoryId: 'main-plates', name: 'Radost Mini Thali', price: 420, note: 'Serves 1 · chef pick', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=700', description: 'A generous little thali with dal, seasonal sabzi, jeera rice, roti, raita, and something sweet to finish.' },
  { id: 'filter-coffee', category: 'Coffee & drinks', categoryId: 'coffee-drinks', name: 'South Indian Filter Coffee', price: 110, note: 'Hot · 180 ml', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=700', description: 'Strong, smooth filter coffee brewed with a house blend from Karnataka and served with silky steamed milk.', featured: true },
  { id: 'saffron-cold-brew', category: 'Coffee & drinks', categoryId: 'coffee-drinks', name: 'Saffron Cold Brew', price: 180, note: 'Cold · 300 ml', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=700', description: 'Slow-steeped cold brew with a delicate saffron foam and a gentle jaggery sweetness.' },
  { id: 'kokum-fizz', category: 'Coffee & drinks', categoryId: 'coffee-drinks', name: 'Kokum & Mint Fizz', price: 150, note: 'Cold · 300 ml', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=700', description: 'A bright house cooler with kokum, mint, lime, and a little sparkle. The perfect Bengaluru afternoon reset.' },
  { id: 'cardamom-bun', category: 'Sweet things', categoryId: 'sweet-things', name: 'Cardamom Milk Bun', price: 140, note: 'Freshly baked', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=700', description: 'Soft, buttery bread glazed with cardamom sugar and baked fresh each morning.', featured: true },
  { id: 'filter-tiramisu', category: 'Sweet things', categoryId: 'sweet-things', name: 'Filter Coffee Tiramisu', price: 260, note: 'Serves 1', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=700', description: 'A light, creamy tiramisu layered with our signature filter coffee and a dusting of cocoa.' },
  { id: 'mango-cheesecake', category: 'Sweet things', categoryId: 'sweet-things', name: 'Alphonso Mango Cheesecake', price: 280, note: 'Seasonal', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=700', description: 'Silky baked cheesecake topped with bright Alphonso mango and a toasted biscuit crumb.' }
];

const categories = [
  { id: 'main-plates', title: 'Main plates', description: 'From crisp dosas to comforting thalis, made for a proper café lunch.', image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&q=80&w=1000', badge: 'Most loved' },
  { id: 'coffee-drinks', title: 'Coffee & drinks', description: 'South Indian coffee, bright coolers, and slow afternoons in a glass.', image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1000' },
  { id: 'sweet-things', title: 'Sweet things', description: 'Small bakes and soft desserts from our oven to your table.', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=1000' }
];

const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
let cart = JSON.parse(localStorage.getItem('radost-cart') || '{}');
let activeProductId = null;
let toastTimer;

function saveCart() { localStorage.setItem('radost-cart', JSON.stringify(cart)); }
function getProduct(id) { return products.find((product) => product.id === id); }
function cartCount() { return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0); }
function cartSubtotal() { return Object.entries(cart).reduce((sum, [id, quantity]) => sum + ((getProduct(id)?.price || 0) * quantity), 0); }
function deliveryFee() { const subtotal = cartSubtotal(); return subtotal === 0 ? 0 : subtotal >= 800 ? 0 : 60; }

function renderCategories() {
  $('#category-cards').innerHTML = categories.map((category) => `
    <a href="#${category.id}" class="category-card group">
      <div class="category-image"><img src="${category.image}" alt="${category.title}" loading="lazy" />${category.badge ? `<span class="category-badge">${category.badge}</span>` : ''}</div>
      <div class="category-copy"><h3>${category.title}</h3><p>${category.description}</p><div class="category-footer"><span>Explore this section</span><iconify-icon icon="solar:arrow-right-up-linear" stroke-width="1.5"></iconify-icon></div></div>
    </a>`).join('');
}

function renderMenu() {
  $('#menu-sections').innerHTML = categories.map((category) => {
    const categoryProducts = products.filter((product) => product.categoryId === category.id);
    return `<section id="${category.id}" class="menu-group scroll-mt-8"><h3>${category.title}</h3><div class="product-grid">${categoryProducts.map(renderProductCard).join('')}</div></section>`;
  }).join('');
}

function renderProductCard(product) {
  return `<article class="product-card" data-product-id="${product.id}">
    <div class="product-card-image"><img src="${product.image}" alt="${product.name}" loading="lazy" /></div>
    <div class="product-card-copy"><h4>${product.name}</h4><p>${product.description}</p><div class="product-card-bottom"><span class="product-price">${formatINR(product.price)}</span><button type="button" class="product-details" data-open-product="${product.id}">View details</button></div></div>
    <button type="button" class="product-add" data-add-product="${product.id}" aria-label="Add ${product.name} to cart"><iconify-icon icon="solar:add-linear"></iconify-icon></button>
  </article>`;
}

function updateCartBadges() { $$('[data-cart-count]').forEach((node) => { node.textContent = cartCount(); }); }

function renderCart() {
  const entries = Object.entries(cart).filter(([id, quantity]) => quantity > 0 && getProduct(id));
  const itemsNode = $('[data-cart-items]');
  const emptyNode = $('[data-cart-empty]');
  if (!entries.length) {
    itemsNode.innerHTML = '';
    itemsNode.classList.add('hidden');
    emptyNode.classList.remove('hidden');
  } else {
    itemsNode.classList.remove('hidden');
    emptyNode.classList.add('hidden');
    itemsNode.innerHTML = entries.map(([id, quantity]) => {
      const product = getProduct(id);
      return `<div class="cart-item"><img src="${product.image}" alt="${product.name}" /><div><h3>${product.name}</h3><p>${formatINR(product.price)} each</p><div class="cart-item-actions"><button type="button" class="quantity-button" data-decrease="${id}" aria-label="Decrease quantity">−</button><span class="quantity-value">${quantity}</span><button type="button" class="quantity-button" data-increase="${id}" aria-label="Increase quantity">+</button></div><button type="button" class="remove-item" data-remove="${id}">Remove</button></div><strong class="cart-item-total">${formatINR(product.price * quantity)}</strong></div>`;
    }).join('');
  }
  const subtotal = cartSubtotal();
  $('[data-cart-subtotal]').textContent = formatINR(subtotal);
  $('[data-cart-delivery]').textContent = deliveryFee() ? formatINR(deliveryFee()) : (subtotal ? 'Free' : formatINR(0));
  $('[data-cart-total]').textContent = formatINR(subtotal + deliveryFee());
  updateCartBadges();
  saveCart();
}

function showToast(message) {
  $('[data-toast-text]').textContent = message;
  $('[data-toast]').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('[data-toast]').classList.remove('show'), 2300);
}

function addToCart(id, quantity = 1) {
  if (!getProduct(id)) return;
  cart[id] = (cart[id] || 0) + quantity;
  renderCart();
  showToast(`${getProduct(id).name} added to cart`);
}

function openProduct(id) {
  const product = getProduct(id);
  if (!product) return;
  activeProductId = id;
  $('[data-modal-image]').src = product.image;
  $('[data-modal-image]').alt = product.name;
  $('[data-modal-category]').textContent = product.category;
  $('[data-modal-title]').textContent = product.name;
  $('[data-modal-description]').textContent = product.description;
  $('[data-modal-price]').textContent = formatINR(product.price);
  $('[data-modal-note]').textContent = product.note;
  const related = products.filter((item) => item.id !== id && item.categoryId === product.categoryId).slice(0, 2);
  $('[data-related-products]').innerHTML = related.map((item) => `<button type="button" class="related-card" data-related-product="${item.id}"><img src="${item.image}" alt="${item.name}" /><span><strong>${item.name}</strong><span>${formatINR(item.price)}</span></span></button>`).join('');
  $('[data-product-modal]').classList.remove('hidden');
  $('[data-product-modal]').setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeProduct() {
  $('[data-product-modal]').classList.add('hidden');
  $('[data-product-modal]').setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function openCart() {
  renderCart();
  $('[data-cart-drawer]').classList.add('open');
  $('[data-cart-drawer]').setAttribute('aria-hidden', 'false');
  $('.drawer-backdrop').classList.add('open');
  document.body.classList.add('cart-open');
}
function closeCart() {
  $('[data-cart-drawer]').classList.remove('open');
  $('[data-cart-drawer]').setAttribute('aria-hidden', 'true');
  $('.drawer-backdrop').classList.remove('open');
  document.body.classList.remove('cart-open');
}

function openForm(mode) {
  const isCheckout = mode === 'checkout';
  $('[data-form-eyebrow]').textContent = isCheckout ? 'Ready when you are' : 'Radost India Café';
  $('[data-form-title]').textContent = isCheckout ? 'Complete your order' : 'Book a table';
  $('[data-form-description]').textContent = isCheckout ? 'A simple demo checkout for your selected café favourites.' : 'Tell us when you would like to visit and we will keep a table ready for you.';
  $('[data-booking-form]').classList.toggle('hidden', isCheckout);
  $('[data-checkout-form]').classList.toggle('hidden', !isCheckout);
  $('[data-form-success]').classList.add('hidden');
  $('[data-form-modal]').classList.remove('hidden');
  $('[data-form-modal]').setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  if (isCheckout) closeCart();
}
function closeForm() {
  $('[data-form-modal]').classList.add('hidden');
  $('[data-form-modal]').setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}
function showSuccess(title, copy) {
  $('[data-booking-form]').classList.add('hidden');
  $('[data-checkout-form]').classList.add('hidden');
  $('[data-success-title]').textContent = title;
  $('[data-success-copy]').textContent = copy;
  $('[data-form-success]').classList.remove('hidden');
}

function bindEvents() {
  document.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-add-product]');
    if (addButton) { event.stopPropagation(); addToCart(addButton.dataset.addProduct); return; }
    const relatedButton = event.target.closest('[data-related-product]');
    if (relatedButton) { openProduct(relatedButton.dataset.relatedProduct); return; }
    const detailButton = event.target.closest('[data-open-product]');
    if (detailButton) { openProduct(detailButton.dataset.openProduct); return; }
    const productCard = event.target.closest('[data-product-id]');
    if (productCard && !event.target.closest('button')) { openProduct(productCard.dataset.productId); return; }
    const increase = event.target.closest('[data-increase]');
    if (increase) { cart[increase.dataset.increase] = (cart[increase.dataset.increase] || 0) + 1; renderCart(); return; }
    const decrease = event.target.closest('[data-decrease]');
    if (decrease) { cart[decrease.dataset.decrease] = Math.max(0, (cart[decrease.dataset.decrease] || 0) - 1); renderCart(); return; }
    const remove = event.target.closest('[data-remove]');
    if (remove) { delete cart[remove.dataset.remove]; renderCart(); showToast('Item removed from cart'); return; }
    if (event.target.closest('[data-open-cart]')) { openCart(); return; }
    if (event.target.closest('[data-close-cart]')) { closeCart(); return; }
    if (event.target.closest('[data-close-modal]')) { closeProduct(); return; }
    if (event.target.closest('[data-open-booking]')) { openForm('booking'); return; }
    if (event.target.closest('[data-open-checkout]')) { if (cartCount()) openForm('checkout'); else showToast('Add something delicious first'); return; }
    if (event.target.closest('[data-close-form]')) { closeForm(); return; }
    if (event.target.closest('[data-toggle-mobile-nav]')) { $('[data-mobile-nav]').classList.toggle('open'); return; }
    if (event.target.closest('[data-mobile-nav] a')) { $('[data-mobile-nav]').classList.remove('open'); return; }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { closeProduct(); closeForm(); closeCart(); $('[data-mobile-nav]').classList.remove('open'); }
  });

  $('[data-modal-add]').addEventListener('click', () => { addToCart(activeProductId); });
  $('[data-booking-form]').addEventListener('submit', (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); showSuccess('Table held for you.', `Thanks ${data.get('name')}. We will see you on ${data.get('date')} at ${data.get('time')} for ${data.get('guests')}. A confirmation call will go to ${data.get('phone')}.`); event.currentTarget.reset(); });
  $('[data-checkout-form]').addEventListener('submit', (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const total = formatINR(cartSubtotal() + deliveryFee()); cart = {}; renderCart(); showSuccess('Order received.', `Thanks ${data.get('name')}. Your demo order for ${total} is ready to be prepared. We will contact you at ${data.get('phone')}.`); event.currentTarget.reset(); });
}

function init() {
  renderCategories();
  renderMenu();
  renderCart();
  const dateInput = $('[data-booking-form] input[type="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
  bindEvents();
}

document.addEventListener('DOMContentLoaded', init);
