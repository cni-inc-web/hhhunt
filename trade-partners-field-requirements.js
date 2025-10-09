document.addEventListener("DOMContentLoaded", function () {
  // 1) Target your checkbox inputs (NOT the wrapper)
  const checkboxes = document.querySelectorAll(
    "input[type='checkbox'][data-validate-group='business-areas']"
  );
  if (!checkboxes.length) return;

  // 2) Get the form that contains this group
  const form = checkboxes[0].closest("form");
  if (!form) return;

  const first = checkboxes[0];
  const anyChecked = () => Array.from(checkboxes).some(cb => cb.checked);

  // Helper to block ALL submits (Webflow/Basin/Turnstile)
  function blockSubmit(e) {
    if (!e) return;
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function") {
      e.stopImmediatePropagation();
    }
    first.setCustomValidity("Please select at least one option.");
    // Show native bubble on the checkbox
    if (typeof first.reportValidity === "function") first.reportValidity();
    first.focus({ preventScroll: false });
    return false;
  }

  // 3) Intercept the form submit FIRST (capture phase)
  form.addEventListener("submit", function (e) {
    if (!anyChecked()) return blockSubmit(e);
    first.setCustomValidity("");
  }, true); // <-- capture = true runs before Webflow/Turnstile handlers

  // 4) Also guard submit button clicks (belt & suspenders)
  const submitButtons = form.querySelectorAll("[type='submit'], button[type='submit']");
  submitButtons.forEach(btn => {
    btn.addEventListener("click", function (e) {
      if (!anyChecked()) return blockSubmit(e);
      first.setCustomValidity("");
    }, true); // capture
  });

  // 5) Clear the message as soon as the user interacts
  checkboxes.forEach(cb => {
    cb.addEventListener("change", function () {
      first.setCustomValidity("");
    });
  });

  // 6) Defensive: prevent Enter key from auto-submitting if invalid
  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !anyChecked()) return blockSubmit(e);
  }, true);
});