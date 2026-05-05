window.addEventListener("DOMContentLoaded", () => {

  const section = document.querySelector("#social-section");

  if (!section) return;

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const pairs = [
        {
          textId: "social-percentage",
          targetSelector: ".source_bar-fill.is-social"
        },
        {
          textId: "direct-percentage",
          targetSelector: ".source_bar-fill.is-direct"
        },
        {
          textId: "paid-percentage",
          targetSelector: ".source_bar-fill.is-paid"
        },
        {
          textId: "referral-percentage",
          targetSelector: ".source_bar-fill.is-referral"
        },
        {
          textId: "organic-percentage",
          targetSelector: ".source_bar-fill.is-organic"
        },
        {
          textId: "email-percentage",
          targetSelector: ".source_bar-fill.is-email"
        }
      ];

      pairs.forEach(pair => {

        const textElement = document.getElementById(pair.textId);
        if (!textElement) return;

        const target = document.querySelector(pair.targetSelector);
        if (!target) return;

        target.style.width = textElement.textContent.trim();

      });

      observer.unobserve(section);

    });

  }, {
    threshold: 0.3
  });

  observer.observe(section);

});