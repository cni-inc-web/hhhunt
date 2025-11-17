(function() {
  // Wait until OneTrust is loaded
  function initLikes() {
    if (typeof OneTrust !== "undefined" && OneTrust.ActiveGroups) {
      const allowed = OneTrust.ActiveGroups.includes("C0003"); // C0003 = functionality_storage
      if (!allowed) return; // exit if consent not given

      const API_BASE = 'https://corp-blog-likes.lively-darkness-6eb8.workers.dev';
      const DID_KEY = 'likes_device_id';
      let deviceId = localStorage.getItem(DID_KEY);
      if (!deviceId) {
        deviceId = crypto.randomUUID?.() || (Date.now() + '-' + Math.random().toString(36).slice(2));
        localStorage.setItem(DID_KEY, deviceId);
      }

      const LS_KEY = 'liked_posts_v2';
      const liked = new Set(JSON.parse(localStorage.getItem(LS_KEY) || '[]'));
      const save = () => localStorage.setItem(LS_KEY, JSON.stringify([...liked]));

      const btns = Array.from(document.querySelectorAll('.like-btn'));

      function getSlugForButton(b){
        return b.dataset.postSlug || b.closest('[data-post-slug]')?.dataset.postSlug || '';
      }

      function getCountEl(b){
        const wrap = b.closest('.like-stack') || b;
        return wrap.querySelector('.like-number') || wrap.querySelector('.like-count');
      }

      btns.forEach(b => {
        const slug = getSlugForButton(b);
        if (!slug) return;
        const isLiked = liked.has(slug);
        b.classList.toggle('liked', isLiked);
        b.setAttribute('aria-pressed', String(isLiked));
      });

      const slugs = [...new Set(btns.map(getSlugForButton).filter(Boolean))];
      if (slugs.length) {
        fetch(`${API_BASE}/likes?slugs=${encodeURIComponent(slugs.join(','))}`)
          .then(r => r.ok ? r.json() : {})
          .then(map => btns.forEach(b => {
            const slug = getSlugForButton(b);
            if (!slug) return;
            const el = getCountEl(b);
            const v = typeof map[slug] === 'number' ? map[slug] : 0;
            if (el) el.textContent = v;
          }))
          .catch(() => {});
      }

      btns.forEach(b => {
        b.addEventListener('click', () => {
          const slug = getSlugForButton(b);
          if (!slug) return;

          const el = getCountEl(b);
          const cur = parseInt(el?.textContent || '0', 10) || 0;
          const isLiked = liked.has(slug);
          const nextLike = !isLiked;

          if (el) el.textContent = Math.max(0, cur + (nextLike ? 1 : -1));
          b.classList.toggle('liked', nextLike);
          b.setAttribute('aria-pressed', String(nextLike));
          if (nextLike) liked.add(slug); else liked.delete(slug);
          save();

          b.disabled = true;
          fetch(`${API_BASE}/toggle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug, deviceId, like: nextLike })
          })
          .then(r => r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)))
          .then(data => {
            const finalLiked = !!data.liked;
            b.classList.toggle('liked', finalLiked);
            b.setAttribute('aria-pressed', String(finalLiked));
            if (typeof data.count === 'number' && el) el.textContent = data.count;
            if (finalLiked) liked.add(slug); else liked.delete(slug);
            save();
          })
          .catch(err => {
            console.error('Toggle failed:', err);
            b.classList.toggle('liked', isLiked);
            b.setAttribute('aria-pressed', String(isLiked));
            if (el) el.textContent = cur;
            if (isLiked) liked.add(slug); else liked.delete(slug);
            save();
          })
          .finally(() => { b.disabled = false; });
        });
      });

    }
  }

  if (window.OneTrust) {
    initLikes();
  } else {
    window.addEventListener('OneTrustGroupsUpdated', initLikes);
  }
})();
