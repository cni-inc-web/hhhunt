document.addEventListener("DOMContentLoaded", function () {
    const smsCheckbox = document.querySelector('.sms-opt-in');
    const phoneFieldContainer = document.querySelector('.sms-dynamic-phone-field');

    if (!smsCheckbox) {
        console.error('Checkbox with class .sms-opt-in not found.');
        return;
    }
    if (!phoneFieldContainer) {
        console.error('Container with class .sms-dynamic-phone-field not found.');
        return;
    }

    const phoneInput = phoneFieldContainer.querySelector('input');
    if (!phoneInput) {
        console.error('No <input> found inside .sms-dynamic-phone-field.');
        return;
    }

    function updatePhoneFieldVisibility() {
        const isChecked = smsCheckbox.classList.contains('w--redirected-checked') || smsCheckbox.classList.contains('checked');
        console.log('Checkbox has class .checked:', isChecked);

        if (isChecked) {
            phoneFieldContainer.style.display = 'block';
            phoneInput.setAttribute('required', 'required');
            console.log('Phone field shown and set to required');
        } else {
            phoneFieldContainer.style.display = 'none';
            phoneInput.removeAttribute('required');
            console.log('Phone field hidden and required removed');
        }
    }

    // Initial check
    updatePhoneFieldVisibility();

    // Watch for changes using a MutationObserver (since Webflow doesn't trigger JS events on class change)
    const observer = new MutationObserver(updatePhoneFieldVisibility);
    observer.observe(smsCheckbox, { attributes: true, attributeFilter: ['class'] });

    console.log('MutationObserver set up to monitor checkbox class changes.');
});