(function() {
  var url = new URL(window.location.href);
  var hasPagination = false;

  url.searchParams.forEach((value, key) => {
    if (key.endsWith('_page')) {
      hasPagination = true;
    }
  });

  if (hasPagination) {
    var canonical = document.querySelector("link[rel='canonical']");
    if (canonical) {
      canonical.setAttribute("href", url.origin + url.pathname);
    }
  }
})();