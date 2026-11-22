(function () {
  var menuToggle = document.getElementById("menuToggle");
  var mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    function setMenuOpen(open) {
      mainNav.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    }

    menuToggle.addEventListener("click", function () {
      setMenuOpen(!mainNav.classList.contains("open"));
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenuOpen(false); });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && mainNav.classList.contains("open")) {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });
    document.addEventListener("click", function (event) {
      if (mainNav.classList.contains("open") &&
          !mainNav.contains(event.target) &&
          !menuToggle.contains(event.target)) {
        setMenuOpen(false);
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 680) setMenuOpen(false);
    });
  }

  var search = document.getElementById("catalogSearch");
  var resultCount = document.getElementById("filteredCount");
  var emptyState = document.getElementById("catalogEmpty");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".food-card[data-category]"));
  var filters = Array.prototype.slice.call(document.querySelectorAll(".filter-chip[data-cat]"));
  var activeCategory = "all";

  function applyFilters() {
    if (!search || !resultCount || !emptyState) return;
    var term = search.value.trim().toLocaleLowerCase("id");
    var visibleCount = 0;

    cards.forEach(function (card) {
      var searchableText = [
        card.dataset.name,
        card.dataset.restaurant,
        card.dataset.city,
        card.dataset.category
      ].join(" ").toLocaleLowerCase("id");
      var matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
      var matchesTerm = !term || searchableText.includes(term);
      card.hidden = !(matchesCategory && matchesTerm);
      if (!card.hidden) visibleCount++;
    });

    resultCount.textContent = visibleCount + " pilihan contoh";
    emptyState.hidden = visibleCount > 0;
  }

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      activeCategory = button.dataset.cat;
      filters.forEach(function (filter) {
        var active = filter === button;
        filter.classList.toggle("active", active);
        filter.setAttribute("aria-pressed", active ? "true" : "false");
      });
      applyFilters();
    });
  });
  if (search) search.addEventListener("input", applyFilters);

  var storageKeys = {
    orders: "joshis12-demo-orders",
    listings: "joshis12-demo-listings"
  };

  function readDemoData(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (error) {
      return [];
    }
  }

  function writeDemoData(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      return false;
    }
    return true;
  }

  function formatRupiah(value) {
    var number = Number(value);
    if (number === 0) return "Gratis";
    return "Rp " + number.toLocaleString("id-ID");
  }

  function escapeText(value) {
    var element = document.createElement("div");
    element.textContent = String(value);
    return element.innerHTML;
  }

  var orderList = document.getElementById("orderList");
  var listingList = document.getElementById("listingList");
  var foodGrid = document.querySelector(".food-grid");

  function renderActivity() {
    var orders = readDemoData(storageKeys.orders);
    var listings = readDemoData(storageKeys.listings);

    if (orderList) {
      orderList.innerHTML = orders.length ? "" : '<p class="empty-activity">Belum ada pesanan.</p>';
      orders.slice().reverse().forEach(function (order) {
        var item = document.createElement("div");
        item.className = "activity-item";
        item.innerHTML = "<div><strong>" + escapeText(order.food) + "</strong><br>" +
          escapeText(order.quantity) + " porsi · " + escapeText(order.name) + "</div>" +
          "<span>Reserved</span>";
        orderList.appendChild(item);
      });
    }

    if (listingList) {
      listingList.innerHTML = listings.length ? "" : '<p class="empty-activity">Belum ada listing demo.</p>';
      listings.slice().reverse().forEach(function (listing) {
        var item = document.createElement("div");
        item.className = "activity-item";
        item.innerHTML = "<div><strong>" + escapeText(listing.name) + "</strong><br>" +
          escapeText(listing.restaurant) + " · " + escapeText(listing.stock) + " porsi</div>" +
          "<span>" + formatRupiah(listing.price) + "</span>";
        listingList.appendChild(item);
      });
    }
  }

  function renderListingCards() {
    if (!foodGrid) return;
    Array.prototype.slice.call(foodGrid.querySelectorAll(".demo-listing-card")).forEach(function (card) {
      card.remove();
    });

    readDemoData(storageKeys.listings).forEach(function (listing, index) {
      var article = document.createElement("article");
      article.className = "food-card demo-listing-card";
      article.dataset.name = listing.name;
      article.dataset.restaurant = listing.restaurant;
      article.dataset.category = "makanan berat";
      article.dataset.city = "Listing demo";
      article.innerHTML =
        '<div class="food-image" style="background:#d8c5ad;display:grid;place-items:center">' +
          '<span style="font:700 48px Georgia,serif;color:#762638">j12</span>' +
          '<span class="food-tag">LISTING DEMO</span><span class="image-index">' + String(index + 4).padStart(2, "0") + '</span>' +
        '</div>' +
        '<div class="food-body"><div class="food-kicker">LISTING BARU · DEMO</div><h3>' + escapeText(listing.name) + '</h3>' +
          '<div class="food-bottom"><div><span>Harga demo</span><strong>' + formatRupiah(listing.price) + '</strong></div>' +
          '<div class="pickup"><span>Ambil sebelum</span><strong>' + escapeText(listing.pickup) + '</strong></div></div>' +
          '<p class="restaurant-name">' + escapeText(listing.restaurant) + ' <span>↗</span></p>' +
          '<button class="buy-button" type="button" data-food="' + escapeText(listing.name) + '" data-price="' +
          escapeText(listing.price) + '" data-stock="' + escapeText(listing.stock) + '">Pesan &amp; ambil</button></div>';
      foodGrid.appendChild(article);
    });

    cards = Array.prototype.slice.call(document.querySelectorAll(".food-card[data-category]"));
    applyFilters();
  }

  var sellForm = document.getElementById("sellForm");
  var sellMessage = document.getElementById("sellMessage");
  if (sellForm) {
    sellForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var listing = {
        name: document.getElementById("sellName").value.trim(),
        restaurant: document.getElementById("sellRestaurant").value.trim(),
        price: Number(document.getElementById("sellPrice").value),
        stock: Number(document.getElementById("sellStock").value),
        pickup: document.getElementById("sellPickup").value
      };
      if (!listing.name || !listing.restaurant) return;
      var listings = readDemoData(storageKeys.listings);
      listings.push(listing);
      var saved = writeDemoData(storageKeys.listings, listings);
      if (sellMessage) {
        sellMessage.textContent = saved ?
          "Listing berhasil ditambahkan ke pratinjau di bagian Beli." :
          "Browser tidak mengizinkan penyimpanan demo.";
      }
      sellForm.reset();
      renderListingCards();
      renderActivity();
      if (saved) document.getElementById("katalog").scrollIntoView({ behavior: "smooth" });
    });
  }

  var checkoutDialog = document.getElementById("checkoutDialog");
  var checkoutFood = document.getElementById("checkoutFood");
  var checkoutPrice = document.getElementById("checkoutPrice");
  var checkoutQuantity = document.getElementById("checkoutQuantity");
  var checkoutMessage = document.getElementById("checkoutMessage");
  var selectedFood = null;

  document.addEventListener("click", function (event) {
    var button = event.target.closest(".buy-button");
    if (!button) return;
    selectedFood = {
      food: button.dataset.food,
      price: Number(button.dataset.price || 0),
      stock: Number(button.dataset.stock || 1)
    };
    if (checkoutFood) checkoutFood.textContent = selectedFood.food;
    if (checkoutPrice) checkoutPrice.textContent = formatRupiah(selectedFood.price);
    if (checkoutQuantity) {
      checkoutQuantity.max = String(selectedFood.stock);
      checkoutQuantity.value = "1";
    }
    if (checkoutMessage) checkoutMessage.textContent = "";
    if (checkoutDialog && typeof checkoutDialog.showModal === "function") {
      checkoutDialog.showModal();
    }
  });

  var closeCheckout = document.getElementById("closeCheckout");
  if (closeCheckout && checkoutDialog) {
    closeCheckout.addEventListener("click", function () { checkoutDialog.close(); });
  }

  var checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!selectedFood) return;
      var quantity = Math.min(
        Number(checkoutQuantity.value),
        selectedFood.stock
      );
      var name = document.getElementById("checkoutName").value.trim();
      if (!name || quantity < 1) return;
      var orders = readDemoData(storageKeys.orders);
      orders.push({
        food: selectedFood.food,
        quantity: quantity,
        name: name,
        price: selectedFood.price,
        note: document.getElementById("checkoutNote").value.trim()
      });
      var saved = writeDemoData(storageKeys.orders, orders);
      if (checkoutMessage) {
        checkoutMessage.textContent = saved ?
          "Reservasi demo berhasil disimpan di browser." :
          "Browser tidak mengizinkan penyimpanan reservasi.";
      }
      renderActivity();
      if (saved) {
        setTimeout(function () {
          if (checkoutDialog) checkoutDialog.close();
          document.getElementById("pesanan").scrollIntoView({ behavior: "smooth" });
        }, 700);
      }
    });
  }

  var clearDemoData = document.getElementById("clearDemoData");
  if (clearDemoData) {
    clearDemoData.addEventListener("click", function () {
      localStorage.removeItem(storageKeys.orders);
      localStorage.removeItem(storageKeys.listings);
      renderActivity();
      renderListingCards();
    });
  }

  renderListingCards();
  renderActivity();

  var loginForm = document.getElementById("loginForm");
  var demoNotice = document.getElementById("demoNotice");
  var password = document.getElementById("password");
  var togglePassword = document.getElementById("togglePassword");

  function showDemoNotice(message) {
    if (!demoNotice) return;
    demoNotice.textContent = message;
    demoNotice.hidden = false;
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!loginForm.reportValidity()) return;
      showDemoNotice("Form pratinjau berhasil dicoba, tetapi belum ada autentikasi di GitHub Pages. Silakan gunakan aplikasi Joshis12 yang terhubung ke backend.");
    });
  }

  var signupLink = document.getElementById("signupLink");
  if (signupLink) {
    signupLink.addEventListener("click", function (event) {
      event.preventDefault();
      showDemoNotice("Pendaftaran akun belum tersedia di situs pratinjau ini. Gunakan aplikasi Joshis12 untuk membuat akun.");
      demoNotice.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  var forgotLink = document.querySelector(".forgot-link");
  if (forgotLink) {
    forgotLink.addEventListener("click", function (event) {
      event.preventDefault();
      showDemoNotice("Pemulihan kata sandi belum tersedia di situs pratinjau ini.");
      demoNotice.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  if (togglePassword && password) {
    togglePassword.addEventListener("click", function () {
      var visible = password.type === "password";
      password.type = visible ? "text" : "password";
      togglePassword.textContent = visible ? "Sembunyikan" : "Lihat";
      togglePassword.setAttribute("aria-label", visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
      togglePassword.setAttribute("aria-pressed", visible ? "true" : "false");
    });
  }
})();
