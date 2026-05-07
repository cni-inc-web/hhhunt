document.addEventListener('DOMContentLoaded', function () {
    // === Inject CSS dynamically ===
    const style = document.createElement('style');
    style.textContent = `
      #rte a.yt-link {
        display: inline-flex;
        align-items: flex-start;
        gap: 0.4em;
        line-height: 1.4;
      }

      #rte a.yt-link > svg {
        flex: 0 0 auto;
        margin-top: 0.2em;
      }

      #rte a.yt-link {
        white-space: normal;
      }

      #rte a.yt-link svg + * {
        display: inline;
      }
    `;
    document.head.appendChild(style);

    // DOM ELEMENTS & CONFIG
    const rteElement = document.getElementById('rte');

    // Exit safely if #rte doesn't exist
    if (!rteElement) return;

    const aTags = rteElement.getElementsByTagName('a');
    const modalWrapper = document.querySelector('.modal-wrapper');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const toggleModalButton = document.querySelectorAll('.modal-button');

    const showYoutubeIcon = true;
    const autoPlayVideo = false;

    // GET ALL YOUTUBE LINKS
    const youtubeLinks = Array.from(aTags).filter((tag) => {
        return (
            tag.href &&
            tag.href.startsWith('https://www.youtube.com/watch')
        );
    });

    // Exit safely if no YouTube links exist
    if (!youtubeLinks.length) return;

    // SET CURRENT VIDEO
    let currentVideo = youtubeLinks[0].href.split('v=')[1] || '';

    // === CREATE PLAYER ===
    let player = { current: null };

    window.onYouTubeIframeAPIReady = () => {
        player.current = new YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: currentVideo,
            playerVars: {
                playsinline: 0,
                autoplay: 0,
                controls: 1,
            },
            events: {
                onStateChange: onPlayerStateChange,
            },
        });
    };

    // LOAD YOUTUBE API
    let tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.defer = true;

    let firstScriptTag = document.getElementsByTagName('script')[0];

    if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // MODAL FUNCTIONS
    function toggleModal(element) {
        if (!element) return;

        if (element.classList.contains('show-modal')) {
            if (player.current) {
                player.current.stopVideo();
            }

            element.classList.remove('show-modal');
            document.body.style.setProperty('overflow', null);
        } else {
            element.classList.add('show-modal');
            document.body.style.setProperty('overflow', 'hidden');
        }
    }

    // MODAL BUTTONS
    toggleModalButton.forEach((button) => {
        button.addEventListener('click', () => {
            toggleModal(modalWrapper);
        });
    });

    // BACKDROP CLICK
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', () => {
            toggleModal(modalWrapper);
        });
    }

    // ESC KEY
    document.addEventListener('keydown', function (event) {
        if (
            event.key === 'Escape' &&
            modalWrapper &&
            modalWrapper.classList.contains('show-modal')
        ) {
            toggleModal(modalWrapper);
        }
    });

    // PARSE VIDEO URL
    function parseVideoUrl(url) {
        const urlParams = new URLSearchParams(new URL(url).search);

        const videoId = urlParams.get('v');

        let startTimeParam = urlParams.get('t');

        // Handle values like 90 or 90s
        let startTime = 0;

        if (startTimeParam) {
            startTime = parseInt(startTimeParam.replace('s', ''), 10) || 0;
        }

        return { videoId, startTime };
    }

    // PROCESS EACH YOUTUBE LINK
    youtubeLinks.forEach((videoLink) => {
        videoLink.classList.add('yt-link');

        // ADD ICON
        if (showYoutubeIcon) {
            const youtubeIcon = `
              <svg aria-hidden="true" width="1em" height="1em" viewBox="0 0 24 24"
                   fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.543 6.498C22 8.28 22 12 22 12C22 12 22 15.72 21.543 17.502C21.289 18.487 20.546 19.262 19.605 19.524C17.896 20 12 20 12 20C12 20 6.107 20 4.395 19.524C3.45 19.258 2.708 18.484 2.457 17.502C2 15.72 2 12 2 12C2 12 2 8.28 2.457 6.498C2.711 5.513 3.454 4.738 4.395 4.476C6.107 4 12 4 12 4C12 4 17.896 4 19.605 4.476C20.55 4.742 21.292 5.516 21.543 6.498ZM10 15.5L16 12L10 8.5V15.5Z" fill="red"/>
              </svg>`;

            videoLink.insertAdjacentHTML('afterbegin', youtubeIcon);
        }

        // OPEN VIDEO MODAL ON CLICK
        videoLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const { videoId, startTime } = parseVideoUrl(videoLink.href);

            // Prevent null errors before player loads
            if (!player.current || !videoId) {
                console.warn('YouTube player not ready yet.');
                return;
            }

            player.current.cueVideoById({
                videoId: videoId,
                startSeconds: startTime,
            });

            toggleModal(modalWrapper);
        });
    });

    // PLAYER EVENTS
    function onPlayerStateChange(event) {
        const loading = document.querySelector('#loading');

        if (!loading || !modalWrapper) return;

        if (
            (event.data === YT.PlayerState.CUED &&
                modalWrapper.classList.contains('show-modal')) ||
            ((event.data === YT.PlayerState.PLAYING ||
                event.data === YT.PlayerState.BUFFERING ||
                event.data === YT.PlayerState.ENDED) &&
                modalWrapper.classList.contains('show-modal'))
        ) {
            loading.style.display = 'none';
        } else if (
            event.data === YT.PlayerState.PAUSED &&
            modalWrapper.classList.contains('show-modal')
        ) {
            loading.style.display = 'none';
        } else {
            loading.style.display = 'flex';
        }

        if (
            event.data === YT.PlayerState.CUED &&
            autoPlayVideo &&
            modalWrapper.classList.contains('show-modal')
        ) {
            if (player.current) {
                player.current.playVideo();
            }
        }
    }
});