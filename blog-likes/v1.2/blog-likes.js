(function () {
  // 🔧 EDIT THIS if your Worker URL changes
  const API_BASE = 'https://corp-blog-likes.lively-darkness-6eb8.workers.dev';

  // Any button with this class is a like button (pill or stacked)
  const btns = Array.from(document.querySelectorAll('.like-btn'));
  if (!btns.length) return;

  // --- helpers ---

  // Find slug for a button: on itself (pill) or on a parent .like-stack
  function getSlugForButton(b) {
    return (
      b.dataset.postSlug ||
      (b.closest('[data-post-slug]') &&
        b.closest('[data-post-slug]').dataset.postSlug) ||
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

  // --- initial load: batch fetch counts for all slugs on the page ---

  const slugs = [...new Set(btns.map(getSlugForButton).filter(Boolean))];

  if (slugs.length) {
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

  // --- click handler: optimistic +1, animate heart, then sync with server ---

  btns.forEach((b) => {
    let busy = false; // prevent spam during animation

    b.addEventListener('click', () => {
      if (busy) return;

      const slug = getSlugForButton(b);
      if (!slug) return;

      const el = getCountEl(b);
      const cur = parseInt((el && el.textContent) || '0', 10) || 0;
      const optimistic = cur + 1;

      busy = true;

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
          // After 1s, let the heart go back to outline;
          // count stays where it is.
          setTimeout(() => {
            b.classList.remove('liked');
            b.setAttribute('aria-pressed', 'false');
            busy = false;
          }, 1000);
        });
    });
  });
})();