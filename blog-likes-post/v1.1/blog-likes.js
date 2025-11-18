/* Version for Post page with LIKE/LIKES + Finsweet Load More support */

(function () {
  const API_BASE = 'https://corp-blog-likes.lively-darkness-6eb8.workers.dev';

  // --- helpers ---

  // Find slug for a button: on itself (pill) or on a parent [data-post-slug]
  function getSlugForButton(b) {
    return (
      b.dataset.postSlug ||
      b.closest('[data-post-slug]')?.dataset.postSlug ||
      ''
    );
  }

  // Find the count element for a button:
  // - stacked:  .like-number inside .like-stack
  // - pill:     .like-count on/inside the button
  function getCountEl(b) {
    const wrap = b.closest('.like-stack') || b;
    return (
      wrap.querySelector('.like-number') ||
      wrap.querySelector('.like-count') ||
      null
    );
  }

  // For stacked layout, find the LIKE/LIKES label element
  function getLabelEl(b) {
    const stack = b.closest('.like-stack');
    return stack ? stack.querySelector('.like-label') : null;
  }

  // Update LIKE vs LIKES for stacked layout
  function updateLikeLabel(b, count) {
    const labelEl = getLabelEl(b);
    if (!labelEl) return; // pill version has no label
    if (count === 1) {
      labelEl.textContent = 'LIKE';
    } else {
      labelEl.textContent = 'LIKES';
    }
  }

  // --- load counts helpers ---

  // Load counts for a specific list of buttons
  function loadCountsForButtons(btns) {
    if (!btns.length) return;

    const slugs = [...new Set(btns.map(getSlugForButton).filter(Boolean))];
    if (!slugs.length) return;

    fetch(`${API_BASE}/likes?slugs=${encodeURIComponent(slugs.join(','))}`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((map) => {
        btns.forEach((b) => {
          const slug = getSlugForButton(b);
          if (!slug) return;
          const el = getCountEl(b);
          const v = typeof map[slug] === 'number' ? map[slug] : 0;
          if (el) {
            el.textContent = v;
            updateLikeLabel(b, v);
          }
        });
      })
      .catch(() => {
        // fail silently; counts will just stay at their default
      });
  }

  // Load counts for all like buttons currently on the page
  function loadCountsAll() {
    const allBtns = Array.from(document.querySelectorAll('.like-btn'));
    loadCountsForButtons(allBtns);
  }

  // Initial load
  loadCountsAll();

  // --- click handling: event delegation, works with Finsweet load more ---

  document.addEventListener('click', (e) => {
    const b = e.target.closest('.like-btn');
    if (!b) return;

    const slug = getSlugForButton(b);
    if (!slug) return; // don’t hijack other buttons without slugs

    // Block parent link block navigation
    e.preventDefault();
    e.stopPropagation();

    // per-button busy flag to prevent spam during animation
    if (b.dataset.busy === '1') return;
    b.dataset.busy = '1';

    const el = getCountEl(b);
    const cur = parseInt((el && el.textContent) || '0', 10) || 0;
    const optimistic = cur + 1;

    // Optimistic UI: bump count and fire the heart animation
    if (el) {
      el.textContent = optimistic;
      updateLikeLabel(b, optimistic);
    }
    b.classList.add('liked');
    b.setAttribute('aria-pressed', 'true');

    // Send like to Worker
    fetch(`${API_BASE}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug })
    })
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))
      )
      .then((data) => {
        // Use authoritative count from server if we get one
        if (typeof data.count === 'number' && el) {
          el.textContent = data.count;
          updateLikeLabel(b, data.count);
        }
      })
      .catch((err) => {
        console.error('Like failed:', err);
        // Roll back count + label if the network call failed
        if (el) {
          el.textContent = cur;
          updateLikeLabel(b, cur);
        }
      })
      .finally(() => {
        // After 1s, let the heart go back to outline; count stays where it is.
        setTimeout(() => {
          b.classList.remove('liked');
          b.setAttribute('aria-pressed', 'false');
          b.dataset.busy = '0';
        }, 1000);
      });
  });

  // --- Finsweet CMS Load hook: refresh counts for newly rendered items ---

  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmsload',
    (listInstances) => {
      const [listInstance] = listInstances;
      listInstance.on('renderitems', (renderedItems) => {
        const newButtons = renderedItems
          .map((item) => Array.from(item.querySelectorAll('.like-btn')))
          .flat();
        loadCountsForButtons(newButtons);
      });
    },
  ]);
})();