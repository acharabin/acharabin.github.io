(() => {
  const menu = document.getElementById("menu");
  const navigation = document.getElementById("site-navigation");
  const scrollTop = document.getElementById("scroll-top");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const closeMenu = () => {
    menu?.classList.remove("fa-times");
    navigation?.classList.remove("nav-toggle");
    menu?.setAttribute("aria-expanded", "false");
    menu?.setAttribute("aria-label", "Open navigation");
  };

  menu?.addEventListener("click", () => {
    const isOpen = navigation?.classList.toggle("nav-toggle") ?? false;
    menu.classList.toggle("fa-times", isOpen);
    menu.setAttribute("aria-expanded", String(isOpen));
    menu.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  navigation?.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const updateScrollState = () => {
    scrollTop?.classList.toggle("active", window.scrollY > 60);
    const sections = [...document.querySelectorAll("main section[id], body > section[id]")];
    const active = sections.find((section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= 180 && bounds.bottom > 180;
    });
    if (active) {
      navigation?.querySelectorAll("a").forEach((link) => {
        link.classList.toggle("active", link.hash === `#${active.id}`);
      });
    }
  };
  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  if (window.Typed && document.querySelector(".typing-text") && !reduceMotion) {
    new Typed(".typing-text", {
      strings: ["Data Science", "Analytics", "Business Strategy", "Data Strategy", "Organizational Culture", "Leadership", "Continuous Improvement", "Bayesian Statistics", "Machine Learning", "Voice AI", "Data Visualization", "Data Architecture"],
      loop: true,
      typeSpeed: 50,
      backSpeed: 25,
      backDelay: 500,
    });
  } else if (document.querySelector(".typing-text")) {
    document.querySelector(".typing-text").textContent = "Data Science";
  }

  const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);

  const loadJSON = async (path) => {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Could not load ${path}: ${response.status}`);
    return response.json();
  };

  const renderSkills = (skills) => {
    const container = document.getElementById("skillsContainer");
    if (!container) return;
    container.innerHTML = skills.filter((skill) => skill.name).map((skill) => {
      const src = `${skill.iconprefix || ""}${skill.icon}`;
      return `<div class="bar"><div class="info"><img src="${escapeHTML(src)}" alt="" loading="lazy"><span>${escapeHTML(skill.name)}</span></div></div>`;
    }).join("");
  };

  const renderProjects = (projects) => {
    const container = document.querySelector("#work .box-container");
    if (!container) return;
    container.innerHTML = projects.slice(0, 10).filter((project) => project.category?.toLowerCase() !== "android").map((project) => {
      const image = project.imagePath || `./assets/images/projects/${project.image}.png`;
      const viewLink = project.links?.view
        ? `<a href="${escapeHTML(project.links.view)}" class="btn" target="_blank" rel="noopener noreferrer"><i class="fas fa-eye" aria-hidden="true"></i> View</a>`
        : "";
      const codeLink = project.links?.code
        ? `<a href="${escapeHTML(project.links.code)}" target="_blank" rel="noopener noreferrer" aria-label="View ${escapeHTML(project.name)} source code"><img class="code-icon" src="${escapeHTML(project.buttonimage || "/assets/images/projects/github2.png")}" alt="GitHub"></a>`
        : "";
      return `<article class="box tilt">
        <img class="project-image" src="${escapeHTML(image)}" alt="${escapeHTML(project.name)}" loading="lazy">
        <div class="content"><div class="tag"><h3>${escapeHTML(project.name)}</h3></div>
          <div class="desc"><p>${escapeHTML(project.desc)}</p><div class="btns">${viewLink}${codeLink}</div></div>
        </div>
      </article>`;
    }).join("");

    if (window.VanillaTilt && !reduceMotion) {
      VanillaTilt.init(container.querySelectorAll(".tilt"), { max: 8, speed: 400 });
    }
    if (window.ScrollReveal && !reduceMotion) {
      ScrollReveal().reveal(".work .box", { interval: 120, distance: "24px", duration: 500 });
    }
  };

  loadJSON("skills.json").then(renderSkills).catch((error) => console.error(error));
  loadJSON("./projects/projects.json").then(renderProjects).catch((error) => console.error(error));

  if (window.VanillaTilt && !reduceMotion) {
    VanillaTilt.init(document.querySelectorAll(".home .tilt, .about .tilt"), { max: 8, speed: 400 });
  }
  if (window.ScrollReveal && !reduceMotion) {
    ScrollReveal().reveal(".home .content, .about .content, .education .box, .experience .timeline", {
      distance: "24px", duration: 500, interval: 100, viewFactor: 0.15,
    });
  }
})();
