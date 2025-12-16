/* Version for Post page with LIKE/LIKES + Finsweet Load More support (more robust) */

(function () {
  const API_BASE = 'https://corp-blog-likes.lively-darkness-6eb8.workers.dev';

  // --- helpers ---

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

  function getLabelEl(b) {
    const stack = b.closest('.like-stack');
    return stack ? stack.querySelector('.like-label') : null;
  }

  function updateLikeLabel(b, count) {
    const labelEl = getLabelEl(b);
    if (!labelEl) return;
    labelEl.textContent = count === 1 ? 'LIKE' : 'LIKES';
  }

  // --- load counts helpers ---

  function loadCountsForButtons(btns) {
    if (!btns || !btns.length) return;

    // IMPORTANT: only include buttons that actually have a slug *right now*
    const slugs = [...new Set(btns.map(getSlugForButton).filter(Boolean))];
    if (!slugs.length) return;

    // Avoid any chance of cached GETs returning stale/zero for late-rendered content
    const cacheBust = Date.now();

    fetch(`${API_BASE}/likes?slugs=${encodeURIComponent(slugs.join(','))}&_=${cacheBust}`, {
      cache: 'no-store'
    })
      .then((r) => (r.ok ? r.json() : {}))
      .then((map) => {
        btns.forEach((b) => {
          const slug = getSlugForButton(b);
          if (!slug) return;

          const el = getCountEl(b);
          const raw = map?.[slug];

          // accept either number or numeric string, just in case
          const v =
            typeof raw === 'number'
              ? raw
              : typeof raw === 'string'
              ? (parseInt(raw, 10) || 0)
              : 0;

          if (el) {
            el.textContent = v;
            updateLikeLabel(b, v);
          }
        });
      })
      .catch(() => {});
  }

  function loadCountsAll() {
    loadCountsForButtons(Array.from(document.querySelectorAll('.like-btn')));
  }

  // Initial load (also do a second pass after everything settles)
  loadCountsAll();
  window.addEventListener('load', () => setTimeout(loadCountsAll, 0));

  // --- click handling: event delegation ---
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.like-btn');
    if (!b) return;

    const slug = getSlugForButton(b);
    if (!slug) return;

    e.preventDefault();
    e.stopPropagation();

    if (b.dataset.busy === '1') return;
    b.dataset.busy = '1';

    const el = getCountEl(b);
    const cur = parseInt((el && el.textContent) || '0', 10) || 0;
    const optimistic = cur + 1;

    if (el) {
      el.textContent = optimistic;
      updateLikeLabel(b, optimistic);
    }
    b.classList.add('liked');
    b.setAttribute('aria-pressed', 'true');

    fetch(`${API_BASE}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug })
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => {
        if (el && (typeof data.count === 'number' || typeof data.count === 'string')) {
          const v = typeof data.count === 'number' ? data.count : (parseInt(data.count, 10) || 0);
          el.textContent = v;
          updateLikeLabel(b, v);
        }
      })
      .catch(() => {
        if (el) {
          el.textContent = cur;
          updateLikeLabel(b, cur);
        }
      })
      .finally(() => {
        setTimeout(() => {
          b.classList.remove('liked');
          b.setAttribute('aria-pressed', 'false');
          b.dataset.busy = '0';
        }, 1000);
      });
  });

  // --- Finsweet CMS Load hook: refresh counts for newly rendered items ---
  // Key change: defer by a tick so data bindings are present.
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmsload',
    (listInstances) => {
      listInstances.forEach((listInstance) => {
        listInstance.on('renderitems', (renderedItems) => {
          // Defer: let Webflow/Finsweet finish stamping attributes into the new nodes
          setTimeout(() => {
            const newButtons = renderedItems
              .map((item) => Array.from(item.querySelectorAll('.like-btn')))
              .flat();

            loadCountsForButtons(newButtons);
          }, 0);
        });
      });
    },
  ]);

  // --- MutationObserver fallback (catches anything inserted/revealed outside renderitems timing) ---
  const seen = new WeakSet();

  function collectNewButtonsFromNode(node) {
    const btns = [];
    if (node.nodeType !== 1) return btns;

    if (node.matches?.('.like-btn') && !seen.has(node)) {
      seen.add(node);
      btns.push(node);
    }
    node.querySelectorAll?.('.like-btn')?.forEach((b) => {
      if (!seen.has(b)) {
        seen.add(b);
        btns.push(b);
      }
    });
    return btns;
  }

  const mo = new MutationObserver((mutations) => {
    const btns = [];
    mutations.forEach((m) => {
      m.addedNodes.forEach((n) => {
        btns.push(...collectNewButtonsFromNode(n));
      });
    });
    if (btns.length) {
      // small defer for the same reason: ensure dataset slugs exist
      setTimeout(() => loadCountsForButtons(btns), 0);
    }
  });

  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
