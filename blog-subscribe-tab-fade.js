document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.querySelector('#subscribe-blog');
    const tab = document.querySelector('.home-side-tab_subscribe');
    if (!trigger || !tab) return;

    const observer = new IntersectionObserver(
        entries => {
            if (entries[0].isIntersecting) {
                tab.classList.add('fade-out');
                tab.addEventListener('transitionend', () => {
                    tab.style.display = 'none';
                }, { once: true });
                observer.disconnect();
            }
        },
        { threshold: 0.1 } // fire when ≥10 % visible
    );

    observer.observe(trigger);
});