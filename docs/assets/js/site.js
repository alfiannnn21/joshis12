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
