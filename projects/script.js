(() => {
  const menu = document.getElementById("menu");
  const navigation = document.getElementById("site-navigation");
  const scrollTop = document.getElementById("scroll-top");
  const closeMenu = () => {
    navigation?.classList.remove("nav-toggle");
    menu?.classList.remove("fa-times");
    menu?.setAttribute("aria-expanded", "false");
    menu?.setAttribute("aria-label", "Open navigation");
  };

  menu?.addEventListener("click", () => {
    const open = navigation?.classList.toggle("nav-toggle") ?? false;
    menu.classList.toggle("fa-times", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  const updateScrollTop = () => scrollTop?.classList.toggle("active", window.scrollY > 60);
  window.addEventListener("scroll", updateScrollTop, { passive: true });
  updateScrollTop();

  const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);

  const container = document.querySelector(".work .box-container");
  const filters = document.querySelector(".button-group");
  fetch("projects.json")
    .then((response) => {
      if (!response.ok) throw new Error(`Could not load projects: ${response.status}`);
      return response.json();
    })
    .then((projects) => {
      const categories = [...new Set(projects.map((project) => project.category).filter(Boolean))];
      filters.innerHTML = ["All projects", ...categories].map((label, index) =>
        `<button class="btn${index === 0 ? " is-checked" : ""}" type="button" data-filter="${index === 0 ? "all" : escapeHTML(label)}" aria-pressed="${index === 0}">${escapeHTML(label)}</button>`
      ).join("");

      container.innerHTML = projects.map((project) => {
        const image = project.imagePath || `../assets/images/projects/${project.image}.png`;
        const view = project.links?.view
          ? `<a href="${escapeHTML(project.links.view)}" class="btn" target="_blank" rel="noopener noreferrer"><i class="fas fa-eye" aria-hidden="true"></i> View</a>`
          : "";
        const code = project.links?.code
          ? `<a href="${escapeHTML(project.links.code)}" class="btn" target="_blank" rel="noopener noreferrer">Code <i class="fas fa-code" aria-hidden="true"></i></a>`
          : "";
        return `<article class="grid-item box" data-category="${escapeHTML(project.category || "Other")}">
          <img class="project-image" src="${escapeHTML(image)}" alt="${escapeHTML(project.name)}" loading="lazy">
          <div class="content"><div class="tag"><h3>${escapeHTML(project.name)}</h3></div>
            <div class="desc"><p>${escapeHTML(project.desc)}</p><div class="btns">${view}${code}</div></div>
          </div>
        </article>`;
      }).join("");

      filters.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-filter]");
        if (!button) return;
        filters.querySelectorAll("button").forEach((item) => {
          const selected = item === button;
          item.classList.toggle("is-checked", selected);
          item.setAttribute("aria-pressed", String(selected));
        });
        container.querySelectorAll(".grid-item").forEach((card) => {
          card.hidden = button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter;
        });
      });
    })
    .catch((error) => {
      console.error(error);
      container.innerHTML = '<p class="load-error">Projects could not be loaded. Please return to the home page and try again.</p>';
    });
})();
