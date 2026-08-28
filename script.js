(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const body = document.body;
  const header = $("#top");
  const burger = $("#burger");
  const nav = $("#nav");
  const progress = $("#topProgress");
  const toTop = $("#toTop");
  const year = $("#year");

  if (year) year.textContent = new Date().getFullYear();

  function updateScrollUI() {
    const y = window.scrollY;
    header?.classList.toggle("scrolled", y > 20);
    toTop?.classList.toggle("show", y > 500);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = max > 0 ? `${Math.min(100, (y / max) * 100)}%` : "0%";
    }
  }
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();
  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  function closeMenu() {
    nav?.classList.remove("open");
    burger?.setAttribute("aria-expanded", "false");
    burger?.setAttribute("aria-label", "Открыть меню");
  }
  burger?.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = nav?.classList.toggle("open") ?? false;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  });
  $$(".nav a").forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("click", e => {
    if (nav?.classList.contains("open") && !nav.contains(e.target) && !burger?.contains(e.target)) closeMenu();
  });

  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i % 4, 3) * 55}ms`; observer.observe(el); });
  } else {
    reveals.forEach(el => el.classList.add("is-visible"));
  }

  const faq = $$(".acc-head");
  faq.forEach(button => button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    faq.forEach(other => {
      other.setAttribute("aria-expanded", "false");
      if (other.nextElementSibling) other.nextElementSibling.style.maxHeight = "";
    });
    if (!expanded) {
      button.setAttribute("aria-expanded", "true");
      const panel = button.nextElementSibling;
      if (panel) panel.style.maxHeight = `${panel.scrollHeight}px`;
    }
  }));

  let activeModal = null;
  let lastFocused = null;
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    activeModal = modal;
    body.classList.add("locked");
    requestAnimationFrame(() => { modal.classList.add("open"); $(".modal-close", modal)?.focus(); });
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("open");
    body.classList.remove("locked");
    window.setTimeout(() => { modal.hidden = true; }, 350);
    activeModal = null;
    lastFocused?.focus?.();
  }
  $$('[data-modal]').forEach(trigger => trigger.addEventListener("click", () => openModal(trigger.getAttribute("data-modal"))));
  $$(".modal").forEach(modal => $$('[data-close]', modal).forEach(close => close.addEventListener("click", () => closeModal(modal))));
  document.addEventListener("keydown", e => { if (e.key === "Escape" && activeModal) closeModal(activeModal); });

  const cookie = $("#cookie");
  const cookieAccept = $("#cookieAccept");
  const cookieDecline = $("#cookieDecline");
  const cookieKey = "demo_cookie_choice";
  function hideCookie(choice) {
    try { localStorage.setItem(cookieKey, choice); } catch (_) {}
    cookie?.classList.remove("show");
  }
  cookieAccept?.addEventListener("click", () => hideCookie("accepted"));
  cookieDecline?.addEventListener("click", () => hideCookie("necessary"));
  if (cookie) {
    let choice = null;
    try { choice = localStorage.getItem(cookieKey); } catch (_) {}
    if (!choice) window.setTimeout(() => cookie.classList.add("show"), 700);
  }

  $$("a[href^='#']").forEach(link => link.addEventListener("click", e => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 0) - 10;
    window.scrollTo({ top, behavior: "smooth" });
  }));

  window.addEventListener("resize", () => {
    faq.forEach(button => {
      if (button.getAttribute("aria-expanded") === "true" && button.nextElementSibling) button.nextElementSibling.style.maxHeight = `${button.nextElementSibling.scrollHeight}px`;
    });
  });

  // If an image is missing, keep the card layout intact instead of showing a broken-image icon.
  $$(".service-icon-wrapper img, .step-media img").forEach(img => {
    img.addEventListener("error", () => { img.style.display = "none"; }, { once: true });
  });
})();
