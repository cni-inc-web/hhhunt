function waitForOneTrust() {
    if (typeof OneTrust !== 'undefined' && typeof OneTrust.ToggleInfoDisplay === 'function') {
        document.getElementById('cookie-settings-link').addEventListener('click', function (e) {
            e.preventDefault();
            OneTrust.ToggleInfoDisplay();
        });
    } else {
        setTimeout(waitForOneTrust, 250);
    }
}
waitForOneTrust();