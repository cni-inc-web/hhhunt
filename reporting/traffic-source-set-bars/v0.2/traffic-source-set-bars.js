window.addEventListener("DOMContentLoaded", () => {

  const section = document.querySelector("#social-section");

  if (!section) return;

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const pairs = [
        {
          textId: "first-percentage",
          targetSelector: ".source_bar-fill.is-first"
        },
        {
          textId: "second-percentage",
          targetSelector: ".source_bar-fill.is-second"
        },
        {
          textId: "third-percentage",
          targetSelector: ".source_bar-fill.is-third"
        },
        {
          textId: "fourth-percentage",
          targetSelector: ".source_bar-fill.is-fourth"
        },
        {
          textId: "fifth-percentage",
          targetSelector: ".source_bar-fill.is-fifth"
        },
        {
          textId: "sixth-percentage",
          targetSelector: ".source_bar-fill.is-sixth"
        },
        {
          textId: "seventh-percentage",
          targetSelector: ".source_bar-fill.is-seventh"
        },
        {
          textId: "eighth-percentage",
          targetSelector: ".source_bar-fill.is-eighth"
        },
        {
          textId: "ninth-percentage",
          targetSelector: ".source_bar-fill.is-ninth"
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