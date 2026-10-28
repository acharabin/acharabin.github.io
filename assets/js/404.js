(() => {
  const menu = document.getElementById("menu");
  const navigation = document.getElementById("site-navigation");
  menu?.addEventListener("click", () => {
    const open = navigation?.classList.toggle("nav-toggle") ?? false;
    menu.classList.toggle("fa-times", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    navigation.classList.remove("nav-toggle");
    menu?.classList.remove("fa-times");
    menu?.setAttribute("aria-expanded", "false");
  }));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      navigation?.classList.remove("nav-toggle");
      menu?.classList.remove("fa-times");
      menu?.setAttribute("aria-expanded", "false");
      menu?.setAttribute("aria-label", "Open navigation");
    }
  });
})();
