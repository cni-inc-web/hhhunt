  window.addEventListener('load', function () {
    setTimeout(function () {
      const tabLink = document.querySelectorAll('.w-tab-link')[5]; // or use data-w-tab if known
      if (tabLink) tabLink.click();
    }, 100); // Delay in ms, tweak if needed
  });