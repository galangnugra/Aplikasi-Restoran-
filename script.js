// Data Makanan
const menuData = [
  { id: 1, name: 'Nasi Goreng Special', category: 'makanan', price: 25000, img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400' },
  { id: 2, name: 'Mie Ayam Bakso', category: 'makanan', price: 20000, img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400' },
  { id: 3, name: 'Ayam Bakar Madu', category: 'makanan', price: 30000, img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400' },
  { id: 4, name: 'Es Teh Manis', category: 'minuman', price: 5000, img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' },
  { id: 5, name: 'Jus Alpukat', category: 'minuman', price: 12000, img: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400' },
  { id: 6, name: 'Kentang Goreng', category: 'camilan', price: 15000, img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400' }
];

let cart = [];

// Format angka ke Rupiah
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

// Render Menu berdasarkan Kategori
function renderMenu(category = 'semua') {
  const container = document.getElementById('menu-container');
  container.innerHTML = '';

  const filteredMenu = category === 'semua' 
    ? menuData 
    : menuData.filter(item => item.category === category);

  filteredMenu.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="menu-img">
      <div class="menu-info">
        <div class="menu-title">${item.name}</div>
        <div class="menu-price">${formatRupiah(item.price)}</div>
        <button class="btn-add" onclick="addToCart(${item.id})">+ Tambah</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Filter Kategori
function filterCategory(category, event) {
  document.querySelectorAll('.btn-category').forEach(btn => btn.classList.remove('active'));
  if (event) {
    event.target.classList.add('active');
  }
  renderMenu(category);
}

// Tambah Ke Keranjang
function addToCart(id) {
  const item = menuData.find(m => m.id === id);
  const existingItem = cart.find(c => c.id === id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCartUI();
}

// Update Tampilan Keranjang & Hitung Total
function updateCartUI() {
  const cartList = document.getElementById('cart-items-list');
  const totalPriceElement = document.getElementById('total-price');

  if (cart.length === 0) {
    cartList.innerHTML = '<li class="empty-cart-text">Keranjang masih kosong.</li>';
    totalPriceElement.innerText = 'Rp 0';
    return;
  }

  cartList.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-title">${item.name}</span>
        <span class="cart-item-qty">${item.qty} x ${formatRupiah(item.price)}</span>
      </div>
      <strong>${formatRupiah(subtotal)}</strong>
    `;
    cartList.appendChild(li);
  });

  totalPriceElement.innerText = formatRupiah(total);
}

// Tampilan Pesanan Selesai / Struk
function processOrder() {
  const customerName = document.getElementById('customer-name').value.trim();
  const tableNumber = document.getElementById('table-number').value.trim();
  const orderNote = document.getElementById('order-note').value.trim();
  const receiptPanel = document.getElementById('receipt-panel');
  const receiptContent = document.getElementById('receipt-content');

  if (!customerName) {
    alert('Mohon masukkan nama pelanggan terlebih dahulu!');
    return;
  }

  if (!tableNumber) {
    alert('Mohon masukkan nomor meja terlebih dahulu!');
    return;
  }

  if (cart.length === 0) {
    alert('Keranjang belanja Anda masih kosong!');
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let itemsSummary = cart.map(item => `${item.name} (${item.qty}x)`).join(', ');

  receiptContent.innerHTML = `
    <p><strong>Nama:</strong> ${customerName}</p>
    <p><strong>Nomor Meja:</strong> ${tableNumber}</p>
    <p><strong>Pesanan:</strong> ${itemsSummary}</p>
    <p><strong>Catatan:</strong> ${orderNote ? orderNote : '-'}</p>
    <p><strong>Total Bayar:</strong> ${formatRupiah(total)}</p>
    <p style="margin-top: 0.5rem; color: #059669; font-weight: 600;">✓ Pesanan berhasil diproses!</p>
  `;

  receiptPanel.classList.add('active');

  // Reset Form & Keranjang
  cart = [];
  document.getElementById('customer-name').value = '';
  document.getElementById('table-number').value = '';
  document.getElementById('order-note').value = '';
  updateCartUI();
}

// Inisialisasi awal saat halaman dibuka
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
});
