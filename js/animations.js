const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const initReveal = () => {
  const items = document.querySelectorAll("[data-reveal]");

  if (!items.length) {
    return;
  }

  if (prefersReducedMotion) {
    items.forEach((item) => item.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  items.forEach((item) => observer.observe(item));
};

const initGsapAccents = () => {
  if (prefersReducedMotion || !window.gsap) {
    return;
  }

  const { gsap } = window;
  gsap.utils.toArray(".orbital-float").forEach((node, index) => {
    gsap.to(node, {
      y: index % 2 === 0 ? -14 : 14,
      duration: 4.2 + index,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  gsap.utils.toArray(".beam").forEach((node, index) => {
    gsap.to(node, {
      x: index % 2 === 0 ? 24 : -24,
      y: index % 2 === 0 ? 14 : -12,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  initGsapAccents();
});
