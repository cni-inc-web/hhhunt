(function () {
  const API_BASE = 'https://corp-blog-likes.lively-darkness-6eb8.workers.dev';

  const btns = Array.from(document.querySelectorAll('.like-btn'));

  function getSlugForButton(b) {
    return b.dataset.postSlug || b.closest('[data-post-slug]')?.dataset.postSlug || '';
  }

  function getCountEl(b) {
    const wrap = b.closest('.like-stack') || b;
    return wrap.querySelector('.like-number') || wrap.querySelector('.like-count');
  }

  // Load counts for all visible buttons
  const slugs = [...new Set(btns.map(getSlugForButton).filter(Boolean))];
  if (slugs.length) {
    fetch(`${API_BASE}/likes?slugs=${encodeURIComponent(slugs.join(','))}`)
      .then(r => (r.ok ? r.json() : {}))
      .then(map => {
        btns.forEach(b => {
          const slug = getSlugForButton(b);
          if (!slug) return;
          const el = getCountEl(b);
          const v = typeof map[slug] === 'number' ? map[slug] : 0;
          if (el) el.textContent = v;
        });
      })
      .catch(() => {});
  }

  // Click: flash filled heart for 1s, permanently increase count
  btns.forEach(b => {
    let busy = false; // prevent spam while animation in progress

    b.addEventListener('click', (e) => {
      // 🔒 prevent the parent Link Block from firing
      e.preventDefault();
      e.stopPropagation();

      if (busy) return;

      const slug = getSlugForButton(b);
      if (!slug) return;

      const el = getCountEl(b);
      const cur = parseInt(el?.textContent || '0', 10) || 0;

      busy = true;

      // Optimistic UI: bump count + fill heart
      if (el) el.textContent = cur + 1;
      b.classList.add('liked');
      b.setAttribute('aria-pressed', 'true');

      // Fire-and-forget to server; count stays higher if successful
      fetch(`${API_BASE}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug })
      })
        .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
        .then(data => {
          if (typeof data.count === 'number' && el) {
            // authoritative count from server
            el.textContent = data.count;
          }
        })
        .catch(err => {
          console.error('Like failed:', err);
          // roll back count on hard failure
          if (el) el.textContent = cur;
        });

      // After 1s, go back to unfilled heart, but KEEP the new count
      setTimeout(() => {
        b.classList.remove('liked');
        b.setAttribute('aria-pressed', 'false');
        busy = false;
      }, 1000);
    });
  });
})();
