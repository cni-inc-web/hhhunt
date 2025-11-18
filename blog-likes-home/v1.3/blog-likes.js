/* Version for Home page w/ Finsweet Load More support (no dynamic LIKE/LIKES text) */

(function () {
  const API_BASE = 'https://corp-blog-likes.lively-darkness-6eb8.workers.dev';

  // ---- helpers ----

  function getSlugForButton(b) {
    return (
      b.dataset.postSlug ||
      b.closest('[data-post-slug]')?.dataset.postSlug ||
      ''
    );
  }

  function getCountEl(b) {
    const wrap = b.closest('.like-stack') || b;
    return (
      wrap.querySelector('.like-number') ||
      wrap.querySelector('.like-count') ||
      null
    );
  }

  // Batch-load counts for all visible like buttons
  function loadCounts() {
    const btns = Array.from(document.querySelectorAll('.like-btn'));
    if (!btns.length) return;

    const slugs = [...new Set(btns.map(getSlugForButton).filter(Boolean))];
    if (!slugs.length) return;

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

  // Initial counts on first page load
  loadCounts();

  // ---- CLICK HANDLING (event delegation, supports load-more items) ----

  document.addEventListener('click', (e) => {
    const b = e.target.closest('.like-btn');
    if (!b) return; // not a like button

    const slug = getSlugForButton(b);
    if (!slug) return; // safety: don't hijack other buttons

    // 🔒 block parent link block navigation
    e.preventDefault();
    e.stopPropagation();

    // per-button "busy" flag
    if (b.dataset.busy === '1') return;
    b.dataset.busy = '1';

    const el = getCountEl(b);
    const cur = parseInt(el?.textContent || '0', 10) || 0;
    const optimistic = cur + 1;

    // Optimistic UI: bump count + trigger heart animation
    if (el) el.textContent = optimistic;
    b.classList.add('liked');
    b.setAttribute('aria-pressed', 'true');

    // Send like to Worker
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
        // roll back on hard failure
        if (el) el.textContent = cur;
      })
      .finally(() => {
        // After 1s, let the heart go back to outline; count stays
        setTimeout(() => {
          b.classList.remove('liked');
          b.setAttribute('aria-pressed', 'false');
          b.dataset.busy = '0';
        }, 1000);
      });
  });

  // ---- OPTIONAL: hook into Finsweet CMS Load to refresh counts for newly loaded items ----
  // This ensures items loaded by "Load more" get their real counts (instead of staying at 0).
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmsload',
    (listInstances) => {
      const [listInstance] = listInstances;
      // Whenever CMS Load renders items (load more / pagination), refresh counts
      listInstance.on('renderitems', (renderedItems) => {
        loadCounts();
      });
    },
  ]);

})();
