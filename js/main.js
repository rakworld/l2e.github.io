const sanitizeValue = (value) =>
  value.replace(/[<>]/g, "").replace(/javascript:/gi, "").trim();

const initNavigation = () => {
  const navShell = document.querySelector(".nav-shell");
  const mobileToggle = document.querySelector(".mobile-toggle");
  const megaParents = document.querySelectorAll(".has-mega");

  if (mobileToggle && navShell) {
    mobileToggle.addEventListener("click", () => {
      navShell.classList.toggle("open");
      mobileToggle.setAttribute("aria-expanded", String(navShell.classList.contains("open")));
    });
  }

  megaParents.forEach((item) => {
    item.querySelector(".nav-toggle")?.addEventListener("click", (event) => {
      if (window.innerWidth > 860) {
        return;
      }

      event.preventDefault();
      item.classList.toggle("open");
    });
  });
};

const initSlider = () => {
  const track = document.querySelector("[data-slider-track]");
  if (!track) {
    return;
  }

  const cards = Array.from(track.children);
  const previous = document.querySelector("[data-slider-prev]");
  const next = document.querySelector("[data-slider-next]");
  let index = 0;

  const update = () => {
    const visible = window.innerWidth <= 860 ? 1 : window.innerWidth <= 1100 ? 2 : 3;
    const width = cards[0]?.getBoundingClientRect().width || 0;
    const gap = window.innerWidth <= 860 ? 0 : 24;
    const maxIndex = Math.max(cards.length - visible, 0);

    index = Math.min(index, maxIndex);
    track.style.transform = `translateX(-${index * (width + gap)}px)`;
  };

  previous?.addEventListener("click", () => {
    index = Math.max(index - 1, 0);
    update();
  });

  next?.addEventListener("click", () => {
    const visible = window.innerWidth <= 860 ? 1 : window.innerWidth <= 1100 ? 2 : 3;
    index = Math.min(index + 1, Math.max(cards.length - visible, 0));
    update();
  });

  window.addEventListener("resize", update);
  update();
};

const initForms = () => {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(form);
      let valid = true;

      for (const [key, rawValue] of data.entries()) {
        const value = sanitizeValue(String(rawValue));
        const field = form.querySelector(`[name="${key}"]`);

        if (field) {
          field.value = value;
        }

        if (field?.hasAttribute("required") && !value) {
          valid = false;
        }

        if (field?.type === "email" && value) {
          const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          valid = valid && emailValid;
        }
      }

      const status = form.querySelector("[data-form-status]");
      if (status) {
        status.textContent = valid
          ? "Request captured. A secure follow-up workflow should be wired to your backend endpoint."
          : "Check the required fields and email format, then submit again.";
      }
    });
  });
};

const initActiveYear = () => {
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initSlider();
  initForms();
  initActiveYear();
});
