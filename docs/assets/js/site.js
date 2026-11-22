// Static GitHub Pages interactions.
(function () {
    var menuToggle = document.getElementById("menuToggle");
    var mainNav = document.getElementById("mainNav");
    var header = document.querySelector(".site-header");

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
            link.addEventListener("click", function () {
                setMenuOpen(false);
            });
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
            if (window.innerWidth > 850) setMenuOpen(false);
        });
    }

    function updateHeader() {
        if (header) header.classList.toggle("scrolled", window.scrollY > 20);
    }
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    var search = document.getElementById("catalogSearch");
    var searchButton = document.getElementById("catalogSearchButton");
    var resultCount = document.getElementById("filteredCount");
    var emptyState = document.getElementById("catalogEmpty");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".food-card[data-category]"));
    var filters = Array.prototype.slice.call(document.querySelectorAll(".pill-btn[data-cat]"));
    var activeCategory = "all";

    function applyFilters() {
        var term = search.value.trim().toLocaleLowerCase("id");
        var visibleCount = 0;

        cards.forEach(function (card) {
            var text = [
                card.dataset.name,
                card.dataset.restaurant,
                card.dataset.city,
                card.dataset.category
            ].join(" ").toLocaleLowerCase("id");
            var matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
            var matchesSearch = !term || text.includes(term);
            card.hidden = !(matchesCategory && matchesSearch);
            if (!card.hidden) visibleCount++;
        });

        resultCount.textContent = visibleCount + " menu contoh ditampilkan";
        emptyState.style.display = visibleCount ? "none" : "block";
    }

    filters.forEach(function (button) {
        button.addEventListener("click", function () {
            activeCategory = button.dataset.cat;
            filters.forEach(function (item) {
                var active = item === button;
                item.classList.toggle("active", active);
                item.setAttribute("aria-pressed", active ? "true" : "false");
            });
            applyFilters();
        });
    });

    if (search) search.addEventListener("input", applyFilters);
    if (searchButton) searchButton.addEventListener("click", applyFilters);
})();
