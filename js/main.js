const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeNavigation() {
  if (!nav || !navToggle) return;

  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "打开导航");
  document.body.style.overflow = "";
}

navToggle?.addEventListener("click", () => {
  const willOpen = navToggle.getAttribute("aria-expanded") !== "true";

  nav?.classList.toggle("is-open", willOpen);
  navToggle.setAttribute("aria-expanded", String(willOpen));
  navToggle.setAttribute("aria-label", willOpen ? "关闭导航" : "打开导航");
  document.body.style.overflow = willOpen ? "hidden" : "";
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeNavigation();
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealItems = document.querySelectorAll("[data-reveal]");

if (reduceMotion.matches || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.08,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const sections = document.querySelectorAll("main section[id]");
const navLinks = [...document.querySelectorAll(".primary-nav a[href^='#']")];

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === `#${visible.target.id}`,
        );
      });
    },
    {
      rootMargin: "-25% 0px -60% 0px",
      threshold: [0.02, 0.2, 0.45],
    },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const typewriter = document.querySelector("[data-typewriter]");

if (typewriter && !reduceMotion.matches) {
  window.setTimeout(() => typewriter.classList.add("is-typing"), 500);
  window.setTimeout(() => typewriter.classList.remove("is-typing"), 3000);
}

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});
