document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons(); // desenha os iconezinhos (usa a biblioteca Lucide)

  const cards = [...document.querySelectorAll(".org-card")];
  const toggles = [...document.querySelectorAll(".org-toggle")];
  const searchInput = document.getElementById("search-input");
  const emptyState = document.getElementById("empty-state");

  // Abre ou fecha um card específico
  function setOpen(card, open) {
    const toggle = card.querySelector(".org-toggle");
    if (!card.querySelector(".org-children")) return;
    card.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  toggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      const card = toggle.closest(".org-card");
      setOpen(card, !card.classList.contains("is-open"));
    });
  });

  // Botão "Expandir todas"
  document.getElementById("expand-all").addEventListener("click", () => {
    cards.filter(card => !card.classList.contains("hidden-by-search")).forEach(card => setOpen(card, true));
  });

  // Botão "Recolher todas"
  document.getElementById("collapse-all").addEventListener("click", () => {
    cards.forEach(card => setOpen(card, false));
  });

  // Busca: filtra os cards conforme a pessoa digita na caixinha de busca
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLocaleLowerCase("pt-BR");
    let visible = 0;

    cards.forEach(card => {
      const match = !query || card.dataset.search.toLocaleLowerCase("pt-BR").includes(query);
      card.classList.toggle("hidden-by-search", !match);
      if (match) {
        visible += 1;
        if (query) setOpen(card, true);
      }
    });

    document.querySelectorAll(".directorate").forEach(section => {
      const sectionHasVisible = [...section.querySelectorAll(".org-card")].some(card => !card.classList.contains("hidden-by-search"));
      section.classList.toggle("hidden-by-search", !sectionHasVisible);
    });

    emptyState.classList.toggle("show", visible === 0);
  });

  // Deixa destacado no menu do topo qual diretoria está aparecendo na tela
  const navLinks = [...document.querySelectorAll(".main-nav a")];
  const sections = [...document.querySelectorAll(".directorate")];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.dataset.section;
        navLinks.forEach(link => link.classList.toggle("is-active", link.getAttribute("href") === "#" + sectionId));
      }
    });
  }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });

  sections.forEach(section => observer.observe(section));
});
