(function () {
  const pageKey    = location.pathname.replace(/\/$/, '');
  const storageKey = `findUsLastTab_${pageKey}`;
  const isVirginia = pageKey.endsWith('/hhhunt-in-virginia');

  window.addEventListener('load', function () {
    setTimeout(function () {
      const tabLinks = document.querySelectorAll('.findusin_state_city-option-wrapper.w-tab-link');
      if (!tabLinks.length) return;

      // 1) Get last-saved tab
      const savedTabId = localStorage.getItem(storageKey);
      let targetTab = null;

      if (savedTabId) {
        // Look for a matching tab by data-w-tab or text
        targetTab = [...tabLinks].find(el =>
          (el.dataset.wTab || el.textContent.trim()) === savedTabId
        );
      } else if (isVirginia) {
        // No saved tab, and we're on the Virginia page → default to tab #5 (6th tab)
        targetTab = tabLinks[5] || null;
      }

      // Activate the target tab, if it's not already active
      if (targetTab && !targetTab.classList.contains('w--current')) {
        targetTab.click();
      }

      // 2) Add click listeners to store new tab choice
      tabLinks.forEach(el => {
        el.addEventListener('click', () => {
          const tabId = el.dataset.wTab || el.textContent.trim();
          localStorage.setItem(storageKey, tabId);
        });
      });
    }, 150); // Delay lets Webflow finish wiring tabs
  });
})();