(function () {
  "use strict";

  var themeClass = Array.prototype.filter.call(document.body.classList, function (name) {
    return name.indexOf("theme-") === 0;
  })[0] || "theme-cafe";
  var theme = themeClass.replace("theme-", "");
  var storagePrefix = "joshis12-" + theme;
  var ACCOUNT_KEY = "joshis12-demo-account";
  var SESSION_KEY = "joshis12-demo-session";
  var KEYS = {
    cart: storagePrefix + "-cart",
    favorites: storagePrefix + "-favorites",
    listings: storagePrefix + "-listings",
    orders: storagePrefix + "-orders",
    settings: storagePrefix + "-settings"
  };
  var products = [
    { id: "ayam-bakar", name: "Nasi Ayam Bakar", category: "Hidangan", price: 18000, pickup: "19.30", shop: "Dapur Senja", area: "Tebet", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop", description: "Nasi hangat dengan ayam bakar bumbu rumahan." },
    { id: "kopi-aren", name: "Kopi Susu Aren", category: "Minuman", price: 12000, pickup: "18.45", shop: "Kopi Sudut", area: "Kuningan", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop", description: "Kopi susu creamy dengan gula aren lokal." },
    { id: "roti-sore", name: "Paket Roti Sore", category: "Roti", price: 10000, pickup: "20.00", shop: "Roti Pagi", area: "Setiabudi", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop", description: "Pilihan roti segar yang dibuat hari ini." },
    { id: "salad-musim", name: "Salad Musim", category: "Hidangan", price: 22000, pickup: "19.00", shop: "Kebun Kota", area: "Melawai", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop", description: "Sayuran segar dengan dressing ringan." },
    { id: "donat-kayu-manis", name: "Donat Kayu Manis", category: "Roti", price: 9000, pickup: "20.15", shop: "Roti Pagi", area: "Setiabudi", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&auto=format&fit=crop", description: "Empuk, harum, cocok untuk teman sore." },
    { id: "sup-sayur", name: "Sup Sayur Hangat", category: "Hidangan", price: 16000, pickup: "19.45", shop: "Kebun Kota", area: "Melawai", image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800&auto=format&fit=crop", description: "Semangkuk sup rumahan dengan sayuran pilihan." }
  ];
  var categories = [
    { name: "Semua", icon: "✦", note: "Jelajahi pilihan" },
    { name: "Hidangan", icon: "◉", note: "Menu mengenyangkan" },
    { name: "Minuman", icon: "♨", note: "Teman perjalanan" },
    { name: "Roti", icon: "❋", note: "Camilan dan pastry" }
  ];
  var views = {
    home: ["Beranda", "PILIHAN HARI INI", "Temukan menu baik, dekat denganmu."],
    buy: ["Beli", "JELAJAHI KATALOG", "Temukan makanan surplus dan pilihan mitra di sekitarmu."],
    sell: ["Jual", "UNTUK MITRA", "Bagikan menu berlebih dan jangkau lebih banyak pembeli."],
    orders: ["Pesanan", "AKTIVITASMU", "Lihat keranjang, reservasi, dan riwayat pesanan demo."],
    favorites: ["Favorit", "TERSIMPAN UNTUKMU", "Kumpulkan menu yang ingin kamu lihat lagi."],
    partners: ["Mitra", "TUMBUH BERSAMA", "Joshis12 membantu menghubungkan mitra dan komunitas."],
    help: ["Bantuan", "PUSAT BANTUAN", "Jawaban ringkas untuk menjelajah pratinjau ini."],
    account: ["Akun", "PREFERENSI", "Kelola profil lokal dan pengaturan pratinjau."]
  };

  function readJson(key, fallback) {
    try {
      var value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }
  function readSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); }
    catch (error) { return null; }
  }
  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (error) { return false; }
  }
  function escapeHtml(value) {
    var node = document.createElement("span");
    node.textContent = String(value == null ? "" : value);
    return node.innerHTML;
  }
  function formatPrice(value) {
    return "Rp" + Number(value || 0).toLocaleString("id-ID");
  }
  function getProduct(id) {
    return products.find(function (item) { return item.id === id; });
  }
  function toast(message) {
    var item = document.querySelector(".toast");
    item.textContent = message;
    item.classList.add("show");
    window.clearTimeout(item.timer);
    item.timer = window.setTimeout(function () { item.classList.remove("show"); }, 2600);
  }

  var themeNames = {
    cafe: "Kafe Minimal",
    botanic: "Botanic Fresh",
    retro: "Retro Pop",
    mono: "Porto Mono",
    wine: "Evening Wine"
  };
  document.title = (themeNames[theme] || "Joshis12") + " — Joshis12";

  document.body.innerHTML =
    '<div class="app-layout">' +
      '<aside class="app-sidebar">' +
        '<a class="brand" href="../index.html"><span class="brand-mark">J12</span><span class="brand-name">joshis<i>12</i></span></a>' +
        '<p class="nav-caption">Menu utama</p><nav class="app-nav" aria-label="Menu utama">' +
          navButton("home", "⌂", "Beranda") + navButton("buy", "◫", "Beli") + navButton("sell", "＋", "Jual") +
          navButton("orders", "✓", "Pesanan", '<span class="nav-count" data-order-count>0</span>') +
          navButton("favorites", "♡", "Favorit") + navButton("partners", "✳", "Mitra") +
          navButton("help", "?", "Bantuan") + navButton("account", "◎", "Akun") +
          '<button type="button" data-open-auth aria-label="Masuk atau daftar"><span class="nav-icon">↗</span><span class="nav-label">Masuk / Daftar</span></button>' +
        '</nav><div class="sidebar-spacer"></div>' +
        '<div class="sidebar-note"><strong>Lebih baik bersama.</strong><p>Temukan makanan, kurangi sisa, dukung usaha sekitar.</p></div>' +
        '<div class="sidebar-user" data-account-summary></div>' +
      '</aside>' +
      '<div class="main-column">' +
        '<header class="topbar"><label class="top-search"><span>⌕</span><input type="search" data-global-search placeholder="Cari menu atau mitra" aria-label="Cari menu atau mitra"></label>' +
          '<div class="top-actions"><button class="icon-button" type="button" data-open-cart aria-label="Buka keranjang">▱<span class="badge" data-cart-count>0</span></button>' +
          '<button class="icon-button" type="button" data-open-notifications aria-label="Notifikasi">◔</button>' +
          '<button class="sign-in-button" type="button" data-open-auth>Masuk / Daftar</button></div></header>' +
        '<main class="main-content">' +
          '<section class="view active" data-view="home">' +
            '<div class="hero"><div class="hero-copy"><p class="eyebrow">JOSHIS12 · FOOD WITH PURPOSE</p><h1>Menu baik,<br>pilihan bijak.</h1><p>Jelajahi makanan dari mitra sekitar, pesan sesuai kebutuhan, dan bantu kurangi makanan terbuang.</p><div class="hero-actions"><button class="primary-button" type="button" data-view-target="buy">Jelajahi menu <span>→</span></button><button class="secondary-button" type="button" data-view-target="sell">Mulai berjualan</button></div></div>' +
              '<div class="hero-art"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=900&auto=format&fit=crop" alt="Hidangan segar tersaji"><div class="hero-tag">Dekat, segar, bermanfaat<small>Pilihan dari mitra sekitar</small></div></div></div>' +
            '<div class="stats-row"><article class="stat-card"><span class="stat-icon">◫</span><div><small>Pilihan katalog</small><strong data-product-total>6 menu</strong></div></article><article class="stat-card"><span class="stat-icon">♧</span><div><small>Di keranjangmu</small><strong data-cart-total>0 item</strong></div></article><article class="stat-card"><span class="stat-icon">✳</span><div><small>Lokasi pratinjau</small><strong>Jakarta Selatan</strong></div></article></div>' +
            '<div class="section-head"><div><p class="eyebrow">JELAJAHI</p><h2>Pilih kategori</h2></div><button class="text-button" type="button" data-view-target="buy">Lihat semua menu →</button></div>' +
            '<div class="category-grid">' + categories.map(function (item) {
              return '<button class="category-card" type="button" data-category-target="' + escapeHtml(item.name) + '"><span class="category-icon">' + item.icon + '</span><span><strong>' + escapeHtml(item.name) + '</strong><small>' + escapeHtml(item.note) + '</small></span></button>';
            }).join("") + '</div>' +
            '<div class="section-head"><div><p class="eyebrow">DISEKITARMU</p><h2>Menu pilihan</h2></div><button class="text-button" type="button" data-view-target="buy">Buka katalog →</button></div>' +
            '<div class="product-grid" data-product-grid="home"></div>' +
          '</section>' +
          '<section class="view" data-view="buy"><div class="page-heading"><div><p class="eyebrow">JELAJAHI KATALOG</p><h1>Beli makanan</h1><p>Setiap menu di sini adalah contoh pratinjau. Pesanan tidak dikirim ke penjual sungguhan.</p></div></div>' +
            '<div class="filter-row" data-filters></div><div class="product-grid" data-product-grid="buy"></div><div class="empty-state" data-no-products hidden><strong>Belum ada menu yang cocok</strong>Coba kata kunci atau kategori lain.</div></section>' +
          '<section class="view" data-view="sell"><div class="page-heading"><div><p class="eyebrow">UNTUK MITRA</p><h1>Bagikan menu surplus</h1><p>Buat listing demo agar menu yang masih layak bisa ditemukan komunitas.</p></div></div>' +
            '<div class="seller-layout"><section class="panel"><div class="panel-heading"><div><h2>Tambah menu</h2><p>Data hanya disimpan di browser ini.</p></div></div>' +
              '<form class="form-grid" data-seller-form><label class="form-field">Nama menu<input class="field" name="name" required maxlength="70" placeholder="Contoh: Paket nasi sore"></label>' +
                '<label class="form-field">Kategori<select class="select-field" name="category"><option>Hidangan</option><option>Minuman</option><option>Roti</option></select></label>' +
                '<label class="form-field">Harga (Rp)<input class="field" name="price" type="number" min="0" step="500" required placeholder="15000"></label>' +
                '<label class="form-field">Jumlah porsi<input class="field" name="stock" type="number" min="1" max="500" required placeholder="5"></label>' +
                '<label class="form-field">Lokasi pengambilan<input class="field" name="area" maxlength="60" required placeholder="Contoh: Tebet"></label>' +
                '<label class="form-field">Batas pengambilan<input class="field" name="pickup" type="time" required value="20:00"></label>' +
                '<label class="form-field full">Deskripsi singkat<textarea class="textarea-field" name="description" maxlength="180" placeholder="Ceritakan menu dan kondisinya"></textarea></label>' +
                '<div class="form-foot"><small>Harga, stok, dan listing ini tidak dipublikasikan ke server.</small><button class="primary-button" type="submit">Terbitkan listing demo</button></div></form></section>' +
              '<aside class="panel seller-tips"><p class="eyebrow">LANGKAH MUDAH</p><h3>Jual dengan jelas</h3><ul><li>Tulis nama dan kondisi menu dengan jujur.</li><li>Tentukan harga dan jumlah porsi yang tersedia.</li><li>Pastikan lokasi serta waktu pengambilan mudah dipahami.</li><li>Koordinasikan transaksi langsung saat backend tersedia.</li></ul></aside></div>' +
            '<div class="section-head"><div><p class="eyebrow">TERSIMPAN DI PERANGKAT</p><h2>Listing saya</h2></div></div><div class="panel"><div class="listing-list" data-listing-list></div></div></section>' +
          '<section class="view" data-view="orders"><div class="page-heading"><div><p class="eyebrow">KERANJANG & RIWAYAT</p><h1>Pesananmu</h1><p>Kelola pilihan dan lihat pesanan yang kamu buat dalam pratinjau ini.</p></div></div>' +
            '<div class="checkout-layout"><section class="panel"><div class="panel-heading"><div><h2>Keranjang</h2><p data-cart-caption>Belum ada item</p></div><button class="text-button" type="button" data-view-target="buy">Tambah menu</button></div><div class="cart-list" data-cart-list></div></section>' +
              '<aside class="panel order-summary"><p class="eyebrow">RINGKASAN</p><div class="summary-line"><span>Jumlah item</span><strong data-summary-qty>0</strong></div><div class="summary-line total"><span>Subtotal demo</span><strong data-summary-price>Rp0</strong></div><button class="primary-button" type="button" data-checkout>Lanjutkan pesanan</button><p class="muted" style="font-size:10px">Ini pratinjau frontend; pembayaran dan reservasi sungguhan belum tersedia.</p></aside></div>' +
            '<div class="section-head"><div><p class="eyebrow">AKTIVITASMU</p><h2>Riwayat pesanan</h2></div></div><div class="panel"><div class="order-list" data-order-list></div></div></section>' +
          '<section class="view" data-view="favorites"><div class="page-heading"><div><p class="eyebrow">TERSIMPAN UNTUKMU</p><h1>Menu favorit</h1><p>Tekan ikon hati pada menu untuk menyimpan pilihan di browser ini.</p></div><button class="secondary-button" type="button" data-view-target="buy">Cari menu</button></div><div class="product-grid" data-favorites-grid></div><div class="empty-state" data-no-favorites hidden><strong>Belum ada menu favorit</strong>Simpan menu dari katalog untuk menemukannya lagi.</div></section>' +
          '<section class="view" data-view="partners"><div class="page-heading"><div><p class="eyebrow">BERSAMA MITRA</p><h1>Komunitas yang bertumbuh</h1><p>Joshis12 menghubungkan pembeli dengan usaha sekitar melalui pilihan makanan yang lebih bijak.</p></div></div>' +
            '<div class="feature-grid"><article class="feature-card"><span>♧</span><h3>Untuk penjual</h3><p>Tampilkan menu dan porsi yang tersedia agar lebih mudah ditemukan pelanggan sekitar.</p></article><article class="feature-card"><span>⌖</span><h3>Untuk komunitas</h3><p>Temukan pilihan makanan lokal dengan informasi pengambilan yang jelas.</p></article><article class="feature-card"><span>✳</span><h3>Untuk lingkungan</h3><p>Berikan kesempatan bagi makanan berlebih yang masih layak untuk dinikmati.</p></article></div>' +
            '<div class="section-head"><div><p class="eyebrow">TERTARIK BERGABUNG?</p><h2>Ceritakan tentang usahamu</h2></div></div><section class="panel"><form class="form-grid" data-partner-form><label class="form-field">Nama usaha<input class="field" name="business" required maxlength="70" placeholder="Nama kedai atau dapur"></label><label class="form-field">Nama kontak<input class="field" name="contact" required maxlength="70" placeholder="Nama kamu"></label><label class="form-field">Email<input class="field" name="email" type="email" required placeholder="nama@email.com"></label><label class="form-field">Jenis usaha<select class="select-field" name="type"><option>Kedai / restoran</option><option>Roti / pastry</option><option>Minuman</option><option>Dapur rumahan</option></select></label><div class="form-foot"><small>Form demo ini tidak mengirimkan data ke mana pun.</small><button class="primary-button" type="submit">Kirim minat demo</button></div></form></section></section>' +
          '<section class="view" data-view="help"><div class="page-heading"><div><p class="eyebrow">PUSAT BANTUAN</p><h1>Ada yang bisa dibantu?</h1><p>Panduan singkat untuk menggunakan semua bagian pratinjau Joshis12.</p></div></div>' +
            '<div class="faq-list"><details class="faq-item"><summary>Bagaimana cara menemukan makanan?</summary><p>Buka menu Beli, gunakan pencarian di bagian atas, lalu pilih kategori. Tombol Pesan akan menambahkan menu ke keranjang demo.</p></details><details class="faq-item"><summary>Apakah pembayaran atau pemesanan ini sungguhan?</summary><p>Tidak. Situs ini adalah pratinjau frontend statis tanpa backend pembayaran, reservasi, atau koneksi MySQL.</p></details><details class="faq-item"><summary>Bagaimana cara membuat listing?</summary><p>Buka Jual, isi formulir, lalu terbitkan listing demo. Listing tersimpan di browser yang sedang digunakan.</p></details><details class="faq-item"><summary>Apakah akun demo mengamankan data saya?</summary><p>Tidak. Akun hanya menyimpan nama dan email demo secara lokal. Jangan gunakan kata sandi asli atau informasi pribadi sensitif.</p></details><details class="faq-item"><summary>Bagaimana menghapus data demo?</summary><p>Data demo disimpan di penyimpanan browser. Hapus data situs dari pengaturan browser untuk membersihkan semuanya.</p></details></div>' +
            '<section class="panel" style="margin-top:18px"><div class="panel-heading"><div><h2>Masih butuh bantuan?</h2><p>Interaksi kontak ini hanya ditampilkan sebagai pratinjau.</p></div><button class="secondary-button" type="button" data-demo-contact>Hubungi tim demo</button></div></section></section>' +
          '<section class="view" data-view="account"><div class="page-heading"><div><p class="eyebrow">PROFIL LOKAL</p><h1>Akun & preferensi</h1><p>Informasi dan pengaturan di halaman ini hanya tersimpan pada browser ini.</p></div></div>' +
            '<div class="seller-layout"><section class="panel"><div class="panel-heading"><div><h2>Profil</h2><p data-profile-status>Belum masuk ke mode demo.</p></div></div><div class="order-summary" data-profile-card></div></section>' +
              '<section class="panel"><div class="panel-heading"><div><h2>Preferensi</h2><p>Pengaturan sederhana untuk pratinjau.</p></div></div><form class="form-grid" data-settings-form><label class="form-field full">Area pilihan<select class="select-field" name="area"><option>Jakarta Selatan</option><option>Jakarta Pusat</option><option>Jakarta Barat</option><option>Jakarta Timur</option><option>Jakarta Utara</option></select></label><label class="form-field full">Email informasi<input class="field" name="email" type="email" placeholder="nama@email.com"></label><div class="form-foot"><small>Preferensi disimpan lokal.</small><button class="secondary-button" type="submit">Simpan preferensi</button></div></form></section></div></section>' +
          '<footer class="site-footer"><span>© Joshis12 · Pratinjau frontend</span><span>Belum ada koneksi backend atau MySQL · <a href="../previews.html">Lima tema desain</a></span></footer>' +
        '</main><nav class="mobile-nav" aria-label="Navigasi cepat">' + navButton("home", "⌂", "Beranda") + navButton("buy", "◫", "Beli") + navButton("sell", "＋", "Jual") + navButton("orders", "✓", "Pesanan") + navButton("account", "◎", "Akun") + '<button type="button" data-open-more><span class="nav-icon">⋯</span><span class="nav-label">Lainnya</span></button>' + '</nav>' +
      '</div>' +
    '</div>' +
    '<div class="modal-backdrop" data-auth-modal><section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button class="modal-close" type="button" data-close-auth aria-label="Tutup">×</button><p class="eyebrow">AKUN PRATINJAU</p><h2 id="auth-title">Selamat datang</h2><p>Masuk untuk melihat profil demo di perangkat ini.</p><div class="demo-notice">Mode demo saja: email tidak diverifikasi, kata sandi tidak diperiksa atau disimpan. Jangan gunakan kata sandi asli; tidak ada autentikasi server.</div><div class="auth-tabs"><button type="button" class="active" data-auth-tab="login">Masuk demo</button><button type="button" data-auth-tab="register">Daftar demo</button></div><form class="auth-form" data-auth-form><label class="form-field" data-register-field hidden>Nama lengkap<input class="field" name="name" maxlength="70" autocomplete="name" placeholder="Nama kamu"></label><label class="form-field">Email<input class="field" name="email" type="email" required autocomplete="email" placeholder="nama@email.com"></label><label class="form-field">Kata sandi<input class="field" name="password" type="password" minlength="6" required autocomplete="off" placeholder="Apa saja, minimal 6 karakter"></label><label class="form-field" data-register-field hidden>Ulangi kata sandi<input class="field" name="confirm" type="password" minlength="6" autocomplete="off" placeholder="Ketik ulang kata sandi"></label><label class="form-field" data-register-field hidden>Jenis akun<select class="select-field" name="role"><option>Pembeli</option><option>Penjual / mitra</option></select></label><button class="primary-button" type="submit">Masuk ke mode demo</button></form><p class="auth-message" aria-live="polite"></p></section></div>' +
    '<div class="drawer-backdrop" data-drawer-backdrop></div><aside class="drawer" data-drawer aria-label="Panel samping"><div class="drawer-header"><h2 data-drawer-title>Keranjang</h2><button class="modal-close" type="button" data-close-drawer aria-label="Tutup">×</button></div><div class="drawer-body" data-drawer-content></div><div class="drawer-footer" data-drawer-footer></div></aside>' +
    '<div class="toast" role="status" aria-live="polite"></div>';

  function navButton(view, icon, label, extra) {
    return '<button type="button" data-view-target="' + view + '" aria-label="' + label + '"><span class="nav-icon">' + icon + '</span><span class="nav-label">' + label + '</span>' + (extra || "") + '</button>';
  }

  function currentView() {
    var hash = window.location.hash.replace("#", "");
    return Object.prototype.hasOwnProperty.call(views, hash) ? hash : "home";
  }
  function switchView(name) {
    if (!views[name]) return;
    document.querySelectorAll(".view").forEach(function (section) {
      section.classList.toggle("active", section.dataset.view === name);
    });
    document.querySelectorAll("[data-view-target]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.viewTarget === name);
    });
    if (window.location.hash !== "#" + name) history.replaceState(null, "", "#" + name);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (name === "orders") renderOrders();
    if (name === "sell") renderListings();
    if (name === "favorites") renderFavorites();
    if (name === "account") renderProfile();
  }
  function productCard(item) {
    var favorites = readJson(KEYS.favorites, []);
    var isFavorite = favorites.indexOf(item.id) !== -1;
    return '<article class="product-card"><div class="product-image"><img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.name) + '" loading="lazy">' +
      '<button class="favorite-button' + (isFavorite ? " is-favorite" : "") + '" type="button" data-favorite="' + escapeHtml(item.id) + '" aria-label="' + (isFavorite ? "Hapus dari" : "Tambah ke") + ' favorit">' + (isFavorite ? "♥" : "♡") + '</button></div>' +
      '<div class="product-body"><div class="product-meta"><span>' + escapeHtml(item.category.toUpperCase()) + '</span><span>' + escapeHtml(item.area) + '</span></div><h3>' + escapeHtml(item.name) + '</h3><p>' + escapeHtml(item.description || "Menu pilihan dari mitra sekitar.") + '</p>' +
      '<div class="product-footer"><span class="product-price">' + formatPrice(item.price) + '<small>Ambil sebelum ' + escapeHtml(item.pickup) + '</small></span><button class="primary-button" type="button" data-add-cart="' + escapeHtml(item.id) + '">Pesan</button></div></div></article>';
  }
  function allProducts() {
    return products.concat(readJson(KEYS.listings, []).map(function (item) {
      return {
        id: item.id, name: item.name, category: item.category, price: item.price,
        pickup: item.pickup, shop: item.shop, area: item.area, description: item.description,
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop"
      };
    }));
  }
  function renderProducts() {
    var items = allProducts();
    document.querySelector('[data-product-grid="home"]').innerHTML = items.slice(0, 3).map(productCard).join("");
    var search = document.querySelector("[data-global-search]").value.trim().toLowerCase();
    var filter = document.querySelector("[data-filters] .active");
    var category = filter ? filter.dataset.filter : "Semua";
    var filtered = items.filter(function (item) {
      var matchesSearch = !search || [item.name, item.category, item.shop, item.area].join(" ").toLowerCase().indexOf(search) !== -1;
      return matchesSearch && (category === "Semua" || item.category === category);
    });
    document.querySelector('[data-product-grid="buy"]').innerHTML = filtered.map(productCard).join("");
    document.querySelector("[data-no-products]").hidden = filtered.length !== 0;
    document.querySelector("[data-product-total]").textContent = items.length + " menu";
    renderFavorites();
    updateCounts();
  }
  function renderFilters(selected) {
    document.querySelector("[data-filters]").innerHTML =
      categories.map(function (item) {
        return '<button type="button" class="filter-chip' + (item.name === selected ? " active" : "") + '" data-filter="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</button>';
      }).join("") +
      '<div class="catalog-tools"><input class="field" type="search" data-catalog-search placeholder="Cari menu atau area" aria-label="Cari menu atau area"></div>';
  }
  function getCart() { return readJson(KEYS.cart, []); }
  function updateCounts() {
    var cart = getCart();
    var quantity = cart.reduce(function (sum, item) { return sum + Number(item.quantity || 1); }, 0);
    document.querySelectorAll("[data-cart-count]").forEach(function (node) { node.textContent = quantity; });
    document.querySelectorAll("[data-order-count]").forEach(function (node) { node.textContent = readJson(KEYS.orders, []).length; });
    document.querySelectorAll("[data-cart-total]").forEach(function (node) { node.textContent = quantity + (quantity === 1 ? " item" : " item"); });
    document.querySelectorAll("[data-summary-qty]").forEach(function (node) { node.textContent = quantity; });
    document.querySelectorAll("[data-summary-price]").forEach(function (node) {
      node.textContent = formatPrice(cart.reduce(function (sum, item) { return sum + Number(item.price || 0) * Number(item.quantity || 1); }, 0));
    });
  }
  function renderCart() {
    var cart = getCart();
    var list = document.querySelector("[data-cart-list]");
    var drawerContent = document.querySelector("[data-drawer-content]");
    var caption = document.querySelector("[data-cart-caption]");
    if (caption) caption.textContent = cart.length ? cart.length + " pilihan ada di keranjang" : "Belum ada item";
    var markup = cart.length ? cart.map(function (entry, index) {
      var item = getProduct(entry.id) || readJson(KEYS.listings, []).find(function (listing) { return listing.id === entry.id; });
      if (!item) return "";
      var image = item.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&auto=format&fit=crop";
      return '<div class="cart-row"><img class="row-thumb" src="' + escapeHtml(image) + '" alt=""><div class="row-details"><strong>' + escapeHtml(item.name) + '</strong><small>' + escapeHtml(item.area) + ' · ' + escapeHtml(entry.quantity || 1) + ' porsi</small></div><div class="row-end">' + formatPrice(item.price) + '<button class="text-button" type="button" data-remove-cart="' + index + '">Hapus</button></div></div>';
    }).join("") : '<div class="empty-state"><strong>Keranjang masih kosong</strong>Pilih menu dari katalog untuk memulai.</div>';
    if (list) list.innerHTML = markup;
    if (drawerContent) drawerContent.innerHTML = markup;
    updateCounts();
  }
  function renderOrders() {
    renderCart();
    var orders = readJson(KEYS.orders, []);
    var list = document.querySelector("[data-order-list]");
    list.innerHTML = orders.length ? orders.slice().reverse().map(function (order) {
      return '<div class="order-row"><span class="stat-icon">✓</span><div class="row-details"><strong>Pesanan demo · ' + escapeHtml(order.id) + '</strong><small>' + escapeHtml(order.items.join(", ")) + '<br>' + escapeHtml(order.name) + ' · ' + escapeHtml(order.pickup) + '</small></div><div class="row-end">' + formatPrice(order.total) + '<span class="status-pill">Demo lokal</span></div></div>';
    }).join("") : '<div class="empty-state"><strong>Belum ada riwayat pesanan</strong>Pesanan yang dibuat akan muncul di sini.</div>';
  }
  function renderListings() {
    var listings = readJson(KEYS.listings, []);
    var holder = document.querySelector("[data-listing-list]");
    holder.innerHTML = listings.length ? listings.slice().reverse().map(function (item) {
      return '<div class="listing-row"><span class="stat-icon">＋</span><div class="row-details"><strong>' + escapeHtml(item.name) + '</strong><small>' + escapeHtml(item.category) + ' · ' + escapeHtml(item.stock) + ' porsi · ' + escapeHtml(item.area) + ' · Ambil ' + escapeHtml(item.pickup) + '</small></div><div class="row-end">' + formatPrice(item.price) + '<button class="text-button" type="button" data-delete-listing="' + escapeHtml(item.id) + '">Hapus</button></div></div>';
    }).join("") : '<div class="empty-state"><strong>Belum ada listing</strong>Menu yang kamu tambahkan akan tersimpan di sini.</div>';
  }
  function renderFavorites() {
    var favorites = readJson(KEYS.favorites, []);
    var items = allProducts().filter(function (item) { return favorites.indexOf(item.id) !== -1; });
    var grid = document.querySelector("[data-favorites-grid]");
    if (!grid) return;
    grid.innerHTML = items.map(productCard).join("");
    document.querySelector("[data-no-favorites]").hidden = items.length !== 0;
  }
  function renderAccountSummary() {
    var holder = document.querySelector("[data-account-summary]");
    var account = readSession();
    holder.innerHTML = account
      ? '<span class="avatar">' + escapeHtml(account.name.charAt(0).toUpperCase()) + '</span><span><strong>' + escapeHtml(account.name) + '</strong><small>' + escapeHtml(account.role) + ' · mode demo</small></span>'
      : '<span class="avatar">J</span><span><strong>Tamu Joshis12</strong><small>Belum masuk · mode demo</small></span>';
    document.querySelector(".sign-in-button").textContent = account ? "Profil" : "Masuk / Daftar";
    renderProfile();
  }
  function renderProfile() {
    var account = readSession();
    var status = document.querySelector("[data-profile-status]");
    if (!status) return;
    var holder = document.querySelector("[data-profile-card]");
    status.textContent = account ? "Mode demo aktif di sesi browser ini." : "Belum masuk ke mode demo.";
    holder.innerHTML = account
      ? '<div class="profile-row"><span class="avatar">' + escapeHtml(account.name.charAt(0).toUpperCase()) + '</span><div><strong>' + escapeHtml(account.name) + '</strong><br><span class="muted">' + escapeHtml(account.email) + ' · ' + escapeHtml(account.role) + '</span></div></div><p class="demo-notice">Identitas demo lokal saja; fitur ini tidak memverifikasi akun di server.</p><button class="secondary-button" type="button" data-logout>Keluar dari mode demo</button>'
      : '<div class="empty-state"><strong>Jelajahi sebagai tamu</strong>Masuk atau daftar untuk melihat profil demo lokal.</div><button class="primary-button" type="button" data-open-auth>Buka Masuk / Daftar</button>';
    var settings = readJson(KEYS.settings, { area: "Jakarta Selatan", email: "" });
    var form = document.querySelector("[data-settings-form]");
    if (form) {
      form.elements.area.value = settings.area;
      form.elements.email.value = settings.email;
    }
  }
  function addToCart(id) {
    var item = getProduct(id) || readJson(KEYS.listings, []).find(function (listing) { return listing.id === id; });
    if (!item) return;
    var cart = getCart();
    var existing = cart.find(function (entry) { return entry.id === id; });
    if (existing) existing.quantity = Number(existing.quantity || 1) + 1;
    else cart.push({ id: id, quantity: 1, price: item.price });
    if (!writeJson(KEYS.cart, cart)) {
      toast("Penyimpanan browser tidak tersedia; keranjang tidak tersimpan.");
      return;
    }
    renderCart();
    toast(item.name + " ditambahkan ke keranjang demo.");
  }
  function openDrawer(title, content, footer) {
    document.querySelector("[data-drawer-title]").textContent = title;
    document.querySelector("[data-drawer-content]").innerHTML = content;
    document.querySelector("[data-drawer-footer]").innerHTML = footer || "";
    document.querySelector("[data-drawer]").classList.add("open");
    document.querySelector("[data-drawer-backdrop]").classList.add("open");
  }
  function closeDrawer() {
    document.querySelector("[data-drawer]").classList.remove("open");
    document.querySelector("[data-drawer-backdrop]").classList.remove("open");
  }
  function openAuth(mode) {
    var modal = document.querySelector("[data-auth-modal]");
    modal.classList.add("open");
    setAuthMode(mode || "login");
    var email = modal.querySelector('[name="email"]');
    window.setTimeout(function () { email.focus(); }, 30);
  }
  function closeAuth() { document.querySelector("[data-auth-modal]").classList.remove("open"); }
  function setAuthMode(mode) {
    var form = document.querySelector("[data-auth-form]");
    form.dataset.mode = mode;
    document.querySelectorAll("[data-auth-tab]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.authTab === mode);
    });
    document.querySelectorAll("[data-register-field]").forEach(function (field) {
      field.hidden = mode !== "register";
      var input = field.querySelector("input");
      if (input) input.required = mode === "register";
    });
    document.querySelectorAll("[data-login-field]").forEach(function (field) {
      field.hidden = mode === "register";
      var input = field.querySelector("input");
      if (input) input.required = mode !== "register";
    });
    form.querySelector('[name="password"]').autocomplete = "off";
    var confirm = form.querySelector('[name="confirm"]');
    if (confirm) confirm.required = mode === "register";
    form.querySelector('button[type="submit"]').textContent = mode === "register" ? "Buat profil demo" : "Masuk ke mode demo";
    document.querySelector("#auth-title").textContent = mode === "register" ? "Buat profil demo" : "Selamat datang";
    document.querySelector(".auth-message").textContent = "";
  }
  function onAuthSubmit(form) {
    var data = new FormData(form);
    var mode = form.dataset.mode;
    var email = String(data.get("email") || "").trim().toLowerCase();
    var password = String(data.get("password") || "");
    var message = document.querySelector(".auth-message");
    function showMessage(text, kind) {
      message.textContent = text;
      message.className = "auth-message " + kind;
    }
    if (password.length < 6) {
      showMessage("Gunakan minimal 6 karakter untuk melanjutkan pratinjau.", "error");
      return;
    }
    if (mode === "register") {
      var name = String(data.get("name") || "").trim();
      if (!name || password !== data.get("confirm")) {
        showMessage(name ? "Kata sandi demo belum sama." : "Masukkan nama lengkap.", "error");
        return;
      }
      var account = { name: name, email: email, role: String(data.get("role") || "Pembeli") };
      if (!writeJson(ACCOUNT_KEY, account)) {
        showMessage("Browser tidak mengizinkan penyimpanan profil demo.", "error");
        return;
      }
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(account)); }
      catch (error) {
        showMessage("Sesi demo tidak dapat disimpan di browser ini.", "error");
        return;
      }
      renderAccountSummary();
      showMessage("Profil demo dibuat di browser ini. Tidak ada akun server.", "success");
      window.setTimeout(closeAuth, 1000);
      return;
    }
    var saved = readJson(ACCOUNT_KEY, null);
    var session = saved && saved.email === email
      ? { name: saved.name, email: saved.email, role: saved.role }
      : { name: email.split("@")[0].replace(/[._-]+/g, " "), email: email, role: "Pembeli" };
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
    catch (error) {
      showMessage("Sesi demo tidak dapat disimpan di browser ini.", "error");
      return;
    }
    renderAccountSummary();
    showMessage("Berhasil masuk ke mode demo. Data ini tidak diverifikasi oleh server.", "success");
    window.setTimeout(closeAuth, 1000);
  }

  renderFilters("Semua");
  document.querySelectorAll("[data-view]").forEach(function (section) {
    var name = section.dataset.view;
    var heading = views[name];
    if (name !== "home") {
      var title = section.querySelector(".page-heading h1");
      if (title && heading) title.textContent = heading[0];
    }
  });
  renderProducts();
  renderCart();
  renderOrders();
  renderListings();
  renderAccountSummary();
  switchView(currentView());

  document.addEventListener("click", function (event) {
    var viewTarget = event.target.closest("[data-view-target]");
    if (viewTarget) { closeDrawer(); switchView(viewTarget.dataset.viewTarget); return; }
    var categoryTarget = event.target.closest("[data-category-target]");
    if (categoryTarget) {
      switchView("buy");
      document.querySelectorAll("[data-filter]").forEach(function (button) {
        button.classList.toggle("active", button.dataset.filter === categoryTarget.dataset.categoryTarget);
      });
      renderProducts();
      return;
    }
    var filter = event.target.closest("[data-filter]");
    if (filter) {
      document.querySelectorAll("[data-filter]").forEach(function (button) { button.classList.toggle("active", button === filter); });
      renderProducts();
      return;
    }
    var add = event.target.closest("[data-add-cart]");
    if (add) { addToCart(add.dataset.addCart); return; }
    var favorite = event.target.closest("[data-favorite]");
    if (favorite) {
      var favorites = readJson(KEYS.favorites, []);
      var index = favorites.indexOf(favorite.dataset.favorite);
      if (index === -1) favorites.push(favorite.dataset.favorite);
      else favorites.splice(index, 1);
      if (!writeJson(KEYS.favorites, favorites)) toast("Browser tidak mengizinkan penyimpanan favorit.");
      else { renderProducts(); toast(index === -1 ? "Menu disimpan ke favorit." : "Menu dihapus dari favorit."); }
      return;
    }
    if (event.target.closest("[data-open-auth]")) {
      if (readSession()) switchView("account");
      else openAuth("login");
      return;
    }
    if (event.target.closest("[data-open-more]")) {
      openDrawer("Menu Joshis12",
        '<div class="drawer-menu">' +
          '<button type="button" data-view-target="favorites">Favorit <span>♡</span></button>' +
          '<button type="button" data-view-target="partners">Mitra <span>✳</span></button>' +
          '<button type="button" data-view-target="help">Bantuan <span>?</span></button>' +
          '<button type="button" data-view-target="account">Akun & pengaturan <span>◎</span></button>' +
          '<button type="button" data-open-auth>Masuk / Daftar <span>↗</span></button>' +
        '</div>');
      return;
    }
    if (event.target.closest("[data-open-cart]")) {
      var cart = getCart();
      var cartHtml = cart.length ? cart.map(function (entry, itemIndex) {
        var item = getProduct(entry.id) || readJson(KEYS.listings, []).find(function (listing) { return listing.id === entry.id; });
        return item ? '<div class="cart-row"><span class="stat-icon">◫</span><div class="row-details"><strong>' + escapeHtml(item.name) + '</strong><small>' + escapeHtml(entry.quantity || 1) + ' porsi · ' + escapeHtml(item.area) + '</small></div><div class="row-end">' + formatPrice(item.price) + '<button class="text-button" type="button" data-remove-cart="' + itemIndex + '">Hapus</button></div></div>' : "";
      }).join("") : '<div class="empty-state"><strong>Keranjangmu masih kosong</strong>Pilih menu dari katalog untuk menambahkannya.</div>';
      openDrawer("Keranjang demo", cartHtml, cart.length ? '<button class="primary-button" type="button" data-view-target="orders">Lihat pesanan →</button>' : "");
      return;
    }
    if (event.target.closest("[data-open-notifications]")) {
      var notices = readJson(KEYS.orders, []);
      var noticeHtml = notices.length
        ? notices.slice(-4).reverse().map(function (order) { return '<div class="order-row"><span class="stat-icon">✓</span><div class="row-details"><strong>Pesanan demo dibuat</strong><small>' + escapeHtml(order.id) + ' · ' + escapeHtml(order.name) + '</small></div><span class="status-pill">Lokal</span></div>'; }).join("")
        : '<div class="empty-state"><strong>Belum ada aktivitas</strong>Aktivitas pesanan demo akan muncul di sini.</div>';
      openDrawer("Aktivitas", noticeHtml);
      return;
    }
    if (event.target.closest("[data-close-drawer]") || event.target.matches("[data-drawer-backdrop]")) { closeDrawer(); return; }
    if (event.target.closest("[data-close-auth]") || event.target.matches("[data-auth-modal]")) { closeAuth(); return; }
    var tab = event.target.closest("[data-auth-tab]");
    if (tab) { setAuthMode(tab.dataset.authTab); return; }
    var remove = event.target.closest("[data-remove-cart]");
    if (remove) {
      var items = getCart();
      items.splice(Number(remove.dataset.removeCart), 1);
      writeJson(KEYS.cart, items);
      renderCart();
      toast("Item dihapus dari keranjang.");
      return;
    }
    var removeListing = event.target.closest("[data-delete-listing]");
    if (removeListing) {
      var listingItems = readJson(KEYS.listings, []).filter(function (item) { return item.id !== removeListing.dataset.deleteListing; });
      writeJson(KEYS.listings, listingItems);
      var remaining = getCart().filter(function (item) { return item.id !== removeListing.dataset.deleteListing; });
      writeJson(KEYS.cart, remaining);
      renderListings();
      renderProducts();
      renderCart();
      toast("Listing demo dihapus.");
      return;
    }
    if (event.target.closest("[data-checkout]")) {
      if (!getCart().length) { toast("Tambahkan menu terlebih dahulu."); return; }
      switchView("orders");
      openDrawer("Konfirmasi pesanan demo", '<p class="muted">Keranjangmu berisi pilihan menu demo.</p><label class="form-field">Nama pemesan<input class="field" data-checkout-name maxlength="70" placeholder="Nama kamu"></label><label class="form-field" style="margin-top:12px">Waktu pengambilan<input class="field" data-checkout-pickup type="time" value="19:30"></label><p class="demo-notice" style="margin-top:14px">Tidak ada pembayaran atau reservasi yang dikirim ke server.</p>', '<button class="primary-button" type="button" data-confirm-checkout>Buat pesanan demo</button>');
      return;
    }
    if (event.target.closest("[data-confirm-checkout]")) {
      var name = document.querySelector("[data-checkout-name]").value.trim();
      var pickup = document.querySelector("[data-checkout-pickup]").value;
      if (!name || !pickup) { toast("Lengkapi nama dan waktu pengambilan."); return; }
      var cartItems = getCart();
      var productsInCart = cartItems.map(function (entry) { return getProduct(entry.id) || readJson(KEYS.listings, []).find(function (listing) { return listing.id === entry.id; }); }).filter(Boolean);
      var total = cartItems.reduce(function (sum, entry) { return sum + Number(entry.price || 0) * Number(entry.quantity || 1); }, 0);
      var order = { id: "D" + Date.now().toString().slice(-7), name: name, pickup: pickup, total: total, items: productsInCart.map(function (item) { return item.name; }) };
      var orders = readJson(KEYS.orders, []);
      orders.push(order);
      if (!writeJson(KEYS.orders, orders) || !writeJson(KEYS.cart, [])) {
        toast("Pesanan demo tidak dapat disimpan di browser.");
        return;
      }
      closeDrawer();
      renderOrders();
      renderProducts();
      toast("Pesanan demo dicatat di browser ini saja.");
      return;
    }
    if (event.target.closest("[data-logout]")) {
      try { sessionStorage.removeItem(SESSION_KEY); } catch (error) {}
      renderAccountSummary();
      toast("Keluar dari mode demo.");
      return;
    }
    if (event.target.closest("[data-demo-contact]")) toast("Kontak langsung belum tersedia di pratinjau.");
  });

  document.addEventListener("input", function (event) {
    if (event.target.matches("[data-global-search]")) {
      if (document.querySelector('[data-view="buy"]').classList.contains("active")) {
        document.querySelector("[data-catalog-search]").value = event.target.value;
        renderProducts();
      }
      if (event.target.value.trim()) {
        switchView("buy");
        document.querySelector("[data-catalog-search]").value = event.target.value;
        renderProducts();
      }
    } else if (event.target.matches("[data-catalog-search]")) {
      document.querySelector("[data-global-search]").value = event.target.value;
      renderProducts();
    }
  });
  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (form.matches("[data-auth-form]")) {
      event.preventDefault();
      onAuthSubmit(form);
    } else if (form.matches("[data-seller-form]")) {
      event.preventDefault();
      var data = new FormData(form);
      var item = {
        id: "listing-" + Date.now(),
        name: String(data.get("name") || "").trim(),
        category: String(data.get("category") || "Hidangan"),
        price: Number(data.get("price")),
        stock: Number(data.get("stock")),
        area: String(data.get("area") || "").trim(),
        pickup: String(data.get("pickup") || ""),
        description: String(data.get("description") || "").trim(),
        shop: "Listing demo"
      };
      var listings = readJson(KEYS.listings, []);
      listings.push(item);
      if (!item.name || !item.area || !Number.isFinite(item.price) || !item.stock || !writeJson(KEYS.listings, listings)) {
        toast("Lengkapi formulir dan pastikan browser mengizinkan penyimpanan.");
        return;
      }
      form.reset();
      form.elements.pickup.value = "20:00";
      renderListings();
      renderProducts();
      toast("Listing demo ditambahkan ke katalog browser ini.");
    } else if (form.matches("[data-partner-form]")) {
      event.preventDefault();
      form.reset();
      toast("Terima kasih. Form ini hanya pratinjau dan tidak mengirim data.");
    } else if (form.matches("[data-settings-form]")) {
      event.preventDefault();
      var settingsForm = new FormData(form);
      var savedSettings = { area: String(settingsForm.get("area")), email: String(settingsForm.get("email") || "") };
      toast(writeJson(KEYS.settings, savedSettings) ? "Preferensi demo disimpan di browser." : "Preferensi tidak dapat disimpan.");
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") { closeAuth(); closeDrawer(); }
  });
  window.addEventListener("hashchange", function () { switchView(currentView()); });
})();
