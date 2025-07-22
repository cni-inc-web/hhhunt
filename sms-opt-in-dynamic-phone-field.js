// sms-optin.js

function setupSMSOptIn(checkboxSelector = '.sms-opt-in', fieldSelector = '.sms-dynamic-phone-field') {
  const smsCheckbox = document.querySelector(checkboxSelector);
  const phoneFieldContainer = document.querySelector(fieldSelector);
  if (!smsCheckbox || !phoneFieldContainer) {
    console.log('SMS opt-in elements not found — skipping.');
    return;
  }

  const phoneInput = phoneFieldContainer.querySelector('input');
  if (!phoneInput) {
    console.log('Phone input not found inside container — skipping.');
    return;
  }

  function updatePhoneFieldVisibility() {
    const isChecked = smsCheckbox.classList.contains('w--redirected-checked') || smsCheckbox.classList.contains('checked');
    if (isChecked) {
      phoneFieldContainer.style.display = 'block';
      phoneInput.setAttribute('required', 'required');
    } else {
      phoneFieldContainer.style.display = 'none';
      phoneInput.removeAttribute('required');
    }
  }

  updatePhoneFieldVisibility();

  const observer = new MutationObserver(updatePhoneFieldVisibility);
  observer.observe(smsCheckbox, { attributes: true, attributeFilter: ['class'] });

  console.log('setupSMSOptIn initialized.');
}

// Automatically run when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  setupSMSOptIn();
});
