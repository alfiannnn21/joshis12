(function () {
  "use strict";

  var ACCOUNT_KEY = "joshis12-demo-account";
  var SESSION_KEY = "joshis12-demo-session";
  var THEME = document.body.className;
  var CART_KEY = "joshis12-demo-cart-" + THEME.replace(/[^a-z0-9]/gi, "-");
  var LISTING_KEY = "joshis12-demo-listings-" + THEME.replace(/[^a-z0-9]/gi, "-");

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch (error) { return fallback; }
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
    var node = document.createElement("div");
    node.textContent = String(value);
    return node.innerHTML;
  }

  function toast(message) {
    var item = document.querySelector(".app-toast");
    if (!item) {
      item = document.createElement("div");
      item.className = "app-toast";
      item.setAttribute("role", "status");
      item.setAttribute("aria-live", "polite");
      document.body.appendChild(item);
    }
    item.textContent = message;
    item.classList.add("show");
    window.clearTimeout(item.hideTimer);
    item.hideTimer = window.setTimeout(function () { item.classList.remove("show"); }, 2600);
  }

  var sidebar = document.querySelector(".preview-sidebar");
  var topActions = document.querySelector(".preview-actions");

  if (topActions) {
    var tools = document.createElement("div");
    tools.className = "preview-tools";
    tools.innerHTML =
      '<button class="tool-button has-dot" type="button" data-open="notifications" aria-label="Notifikasi">◷</button>' +
      '<button class="tool-button" type="button" data-open="cart" aria-label="Keranjang dan reservasi">◫</button>' +
      '<button class="tool-button" type="button" data-open="profile" aria-label="Profil">◎</button>' +
      '<button class="tool-button" type="button" data-open="auth" aria-label="Masuk atau daftar">↗</button>';
    topActions.prepend(tools);
  }

  if (sidebar) {
    var account = document.createElement("div");
    account.className = "sidebar-account";
    sidebar.appendChild(account);
  }

  var mobileNav = document.createElement("nav");
  mobileNav.className = "mobile-main-nav";
  mobileNav.setAttribute("aria-label", "Navigasi utama aplikasi");
  mobileNav.innerHTML =
    '<a class="active" href="#beranda"><b>⌂</b><span>Beranda</span></a>' +
    '<a href="#katalog"><b>◫</b><span>Beli</span></a>' +
    '<a href="#jual"><b>＋</b><span>Jual</span></a>' +
    '<a href="#pesanan"><b>✓</b><span>Pesanan</span></a>' +
    '<a href="#akun" data-open="auth"><b>◎</b><span>Akun</span></a>';
  document.body.appendChild(mobileNav);

  var modal = document.createElement("div");
  modal.className = "app-modal";
  modal.id = "appAuthModal";
  modal.innerHTML =
    '<div class="app-modal-card" role="dialog" aria-modal="true" aria-labelledby="authTitle">' +
      '<button class="modal-close" type="button" data-close-modal aria-label="Tutup">×</button>' +
      '<h2 id="authTitle">Masuk ke Joshis12</h2>' +
      '<p>Kelola pesanan, listing, dan reservasi di satu akun.</p>' +
      '<div class="demo-alert">Pratinjau frontend: akun dan MySQL belum terhubung. Jangan masukkan kata sandi asli.</div>' +
      '<div class="auth-tabs"><button class="active" type="button" data-auth-tab="login">Masuk</button><button type="button" data-auth-tab="register">Daftar</button></div>' +
      '<form class="auth-form">' +
        '<div class="register-fields" hidden>' +
          '<label>Nama lengkap<input id="authName" type="text" autocomplete="name" placeholder="Nama Anda"></label>' +
          '<label>Saya ingin bergabung sebagai<select id="authRole"><option value="pembeli">Pembeli makanan</option><option value="penjual">Penjual / mitra</option></select></label>' +
        '</div>' +
        '<label>Email<input id="authIdentity" type="email" autocomplete="username" required placeholder="nama@email.com"></label>' +
        '<label>Kata sandi<input id="authPassword" type="password" autocomplete="current-password" minlength="6" required placeholder="Minimal 6 karakter"></label>' +
        '<label class="register-fields" hidden>Ulangi kata sandi<input id="authPasswordConfirm" type="password" autocomplete="new-password" minlength="6" placeholder="Ketik ulang kata sandi"></label>' +
        '<button type="submit" id="authSubmit">Masuk ke aplikasi</button>' +
      '</form>' +
      '<p class="auth-message" aria-live="polite"></p>' +
    '</div>';
  document.body.appendChild(modal);

  var drawer = document.createElement("aside");
  drawer.className = "drawer";
  drawer.id = "appDrawer";
  drawer.innerHTML =
    '<div class="drawer-head"><h2 id="drawerTitle">Aktivitas</h2><button class="drawer-close" type="button" aria-label="Tutup">×</button></div>' +
    '<div id="drawerContent"></div>';
  document.body.appendChild(drawer);

  function openModal() {
    modal.classList.add("open");
    var identity = document.getElementById("authIdentity");
    if (identity) identity.focus();
  }

  function closeModal() { modal.classList.remove("open"); }
  function closeDrawer() { drawer.classList.remove("open"); }

  function updateAccountUi() {
    var account = readSession();
    var holder = document.querySelector(".sidebar-account");
    if (!holder) return;
    if (account) {
      holder.innerHTML =
        '<div class="preview-user"><i>' + escapeHtml(account.name.charAt(0).toUpperCase()) +
        '</i><div><strong>' + escapeHtml(account.name) + '</strong><br>' + escapeHtml(account.role) + '</div></div>' +
        '<button class="account-link logged-in" type="button" data-open="profile"><span>Profil akun</span><b>↗</b></button>';
    } else {
      holder.innerHTML =
        '<div class="preview-user"><i>G</i><div><strong>Tamu Joshis12</strong><br>Belum masuk</div></div>' +
        '<button class="account-link" type="button" data-open="auth"><span>Masuk / Daftar</span><b>↗</b></button>';
    }
  }

  function hashPassword(password) {
    if (window.crypto && window.crypto.subtle) {
      return window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)).then(function (buffer) {
        return Array.from(new Uint8Array(buffer)).map(function (byte) {
          return byte.toString(16).padStart(2, "0");
        }).join("");
      });
    }
    return Promise.resolve("plain:" + password);
  }

  function logoutAccount() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (error) {}
    updateAccountUi();
    closeDrawer();
    toast("Anda sudah keluar dari akun demo.");
  }

  function renderCart(content) {
    var cart = readJson(CART_KEY, []);
    var html = '<div class="drawer-section"><h3>RESERVASI DEMO</h3>';
    if (!cart.length) {
      html += '<div class="drawer-item"><i>◫</i><div><strong>Keranjang masih kosong</strong><span>Pilih Pesan pada katalog.</span></div></div>';
    } else {
      cart.forEach(function (item, index) {
        html += '<div class="drawer-item"><i>' + (index + 1) + '</i><div><strong>' +
          escapeHtml(item.name) + '</strong><span>' + escapeHtml(item.price) +
          '</span></div><button type="button" class="drawer-remove" data-cart-remove="' + index +
          '" aria-label="Hapus ' + escapeHtml(item.name) + '">Hapus</button></div>';
      });
    }
    html += '</div>';
    content.innerHTML = html;
  }

  function openDrawer(kind) {
    var title = document.getElementById("drawerTitle");
    var content = document.getElementById("drawerContent");
    if (kind === "auth") {
      openModal();
      return;
    }
    if (kind === "notifications") {
      title.textContent = "Notifikasi";
      content.innerHTML =
        '<div class="drawer-section"><h3>HARI INI</h3>' +
        '<div class="drawer-item"><i>✓</i><div><strong>Pesanan siap diambil</strong><span>Pesanan demo sudah dikonfirmasi oleh mitra.</span></div></div>' +
        '<div class="drawer-item"><i>＋</i><div><strong>Listing aktif</strong><span>Menu tersisa tampil di katalog.</span></div></div>' +
        '<button type="button" class="drawer-action" data-clear-notifications>Tandai semua sudah dibaca</button></div>';
    } else if (kind === "cart") {
      title.textContent = "Keranjang & reservasi";
      renderCart(content);
    } else if (kind === "profile") {
      title.textContent = "Profil akun";
      var account = readSession();
      if (account) {
        content.innerHTML =
          '<div class="profile-row"><i>' + escapeHtml(account.name.charAt(0).toUpperCase()) +
          '</i><div><strong>' + escapeHtml(account.name) + '</strong><span>' + escapeHtml(account.email) +
          ' · ' + escapeHtml(account.role) + '</span></div></div>' +
          '<div class="drawer-menu">' +
          '<button type="button" data-open-section="orders">Riwayat pesanan <span>→</span></button>' +
          '<button type="button" data-open-section="listings">Listing saya <span>→</span></button>' +
          '<button type="button" data-open-section="settings">Pengaturan akun <span>→</span></button>' +
          '<button type="button" data-logout>Keluar dari akun <span>↗</span></button></div>';
      } else {
        content.innerHTML =
          '<div class="profile-row"><i>G</i><div><strong>Tamu Joshis12</strong><span>Belum masuk · akun demo</span></div></div>' +
          '<div class="drawer-menu"><button type="button" data-open="auth">Masuk / Daftar <span>↗</span></button>' +
          '<button type="button" data-open-section="orders">Riwayat pesanan <span>→</span></button>' +
          '<button type="button" data-open-section="settings">Pengaturan akun <span>→</span></button></div>';
      }
    }
    drawer.classList.add("open");
  }

  var authMode = "login";
  modal.querySelectorAll("[data-auth-tab]").forEach(function (tab) {
    tab.addEventListener("click", function () {
      authMode = tab.dataset.authTab;
      modal.querySelectorAll("[data-auth-tab]").forEach(function (item) {
        var active = item === tab;
        item.classList.toggle("active", active);
      });
      var register = authMode === "register";
      modal.querySelectorAll(".register-fields").forEach(function (field) { field.hidden = !register; });
      document.getElementById("authName").required = register;
      document.getElementById("authPasswordConfirm").required = register;
      document.getElementById("authTitle").textContent = register ? "Daftar Joshis12" : "Masuk ke Joshis12";
      document.getElementById("authSubmit").textContent = register ? "Buat akun demo" : "Masuk ke aplikasi";
      modal.querySelector(".auth-message").textContent = "";
    });
  });

  var authForm = modal.querySelector(".auth-form");
  authForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var email = document.getElementById("authIdentity").value.trim().toLowerCase();
    var password = document.getElementById("authPassword").value;
    var message = modal.querySelector(".auth-message");
    if (!email || password.length < 6) {
      message.textContent = "Lengkapi email dan kata sandi minimal 6 karakter.";
      message.className = "auth-message auth-error";
      return;
    }
    hashPassword(password).then(function (passwordHash) {
      if (authMode === "register") {
        var name = document.getElementById("authName").value.trim();
        var confirm = document.getElementById("authPasswordConfirm").value;
        var role = document.getElementById("authRole").value;
        if (!name) {
          message.textContent = "Masukkan nama lengkap untuk mendaftar.";
          message.className = "auth-message auth-error";
          return;
        }
        if (password !== confirm) {
          message.textContent = "Kata sandi dan pengulangannya belum sama.";
          message.className = "auth-message auth-error";
          return;
        }
        var account = { name: name, email: email, role: role, passwordHash: passwordHash };
        try { localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account)); }
        catch (error) {
          message.textContent = "Browser tidak mengizinkan penyimpanan akun demo.";
          message.className = "auth-message auth-error";
          return;
        }
        try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: name, email: email, role: role })); }
        catch (error) {}
        updateAccountUi();
        message.textContent = "Pendaftaran berhasil. Akun " + name + " sudah aktif di browser ini.";
        message.className = "auth-message auth-success";
        window.setTimeout(closeModal, 1000);
      } else {
        var stored = readJson(ACCOUNT_KEY, null);
        if (!stored || stored.email !== email || stored.passwordHash !== passwordHash) {
          message.textContent = "Email atau kata sandi tidak cocok dengan akun demo.";
          message.className = "auth-message auth-error";
          return;
        }
        try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: stored.name, email: stored.email, role: stored.role })); }
        catch (error) {}
        updateAccountUi();
        message.textContent = "Masuk berhasil. Selamat datang, " + stored.name + ".";
        message.className = "auth-message auth-success";
        window.setTimeout(closeModal, 700);
      }
    });
  });

  document.querySelectorAll(".catalog-toolbar input").forEach(function (input) {
    input.addEventListener("input", function () {
      var term = input.value.trim().toLowerCase();
      document.querySelectorAll(".food-panel").forEach(function (card) {
        card.hidden = term && !card.textContent.toLowerCase().includes(term);
      });
    });
  });

  var filterIndex = 0;
  var filterLabels = ["Semua", "Hidangan", "Minuman", "Roti"];
  document.querySelectorAll(".catalog-toolbar button").forEach(function (button) {
    button.addEventListener("click", function () {
      filterIndex = (filterIndex + 1) % filterLabels.length;
      var label = filterLabels[filterIndex];
      button.textContent = label;
      document.querySelectorAll(".food-panel").forEach(function (card) {
        card.hidden = label !== "Semua" && !card.textContent.toLowerCase().includes(label.toLowerCase());
      });
    });
  });

  document.querySelectorAll(".food-panel-row button").forEach(function (button) {
    button.addEventListener("click", function () {
      var card = button.closest(".food-panel");
      var name = card.querySelector("h3").textContent;
      var price = card.querySelector(".food-panel-row strong").textContent;
      var cart = readJson(CART_KEY, []);
      cart.push({ name: name, price: price });
      writeJson(CART_KEY, cart);
      button.textContent = "Ditambahkan";
      button.disabled = true;
      toast(name + " ditambahkan ke reservasi.");
    });
  });

  document.querySelectorAll(".seller-form").forEach(function (form) {
    var nameInput = form.querySelector('input[type="text"], input:not([type])');
    var numberInputs = form.querySelectorAll('input[type="number"]');
    var timeInput = form.querySelector('input[type="time"]');
    form.addEventListener("submit", function (event) { event.preventDefault(); });
    var button = form.querySelector("button");
    if (button) {
      button.addEventListener("click", function () {
        var name = nameInput ? nameInput.value.trim() : "";
        if (!name) {
          if (nameInput) nameInput.focus();
          toast("Masukkan nama menu terlebih dahulu.");
          return;
        }
        var price = numberInputs[0] ? numberInputs[0].value : "";
        var stock = numberInputs[1] ? numberInputs[1].value : "1";
        var listings = readJson(LISTING_KEY, []);
        listings.push({ name: name, price: price, stock: stock, pickup: timeInput ? timeInput.value : "" });
        writeJson(LISTING_KEY, listings);
        button.textContent = "Listing ditambahkan";
        toast(name + " berhasil ditambahkan sebagai listing demo.");
        window.setTimeout(function () { button.textContent = "Publikasikan"; }, 1800);
      });
    }
  });

  document.addEventListener("click", function (event) {
    var openTarget = event.target.closest("[data-open]");
    if (openTarget) {
      event.preventDefault();
      openDrawer(openTarget.dataset.open);
      return;
    }
    if (event.target.closest("[data-close-modal]")) closeModal();
    if (event.target.closest("[data-logout]")) logoutAccount();
    var removeButton = event.target.closest("[data-cart-remove]");
    if (removeButton) {
      var cart = readJson(CART_KEY, []);
      cart.splice(Number(removeButton.dataset.cartRemove), 1);
      writeJson(CART_KEY, cart);
      renderCart(document.getElementById("drawerContent"));
      toast("Item reservasi dihapus.");
    }
    var clearNotifications = event.target.closest("[data-clear-notifications]");
    if (clearNotifications) {
      document.querySelectorAll(".tool-button.has-dot").forEach(function (button) { button.classList.remove("has-dot"); });
      toast("Semua notifikasi sudah dibaca.");
    }
    var openSection = event.target.closest("[data-open-section]");
    if (openSection) {
      var section = openSection.dataset.openSection;
      closeDrawer();
      if (section === "orders") document.getElementById("pesanan").scrollIntoView({ behavior: "smooth" });
      else if (section === "listings") document.getElementById("jual").scrollIntoView({ behavior: "smooth" });
      else toast("Pengaturan akun tersedia sebagai opsi demo.");
    }
  });

  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
  });
  var drawerClose = drawer.querySelector(".drawer-close");
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);

  updateAccountUi();
})();
