document.addEventListener('DOMContentLoaded', function () {
    // CREATE PLAYER
    let player = { current: null }
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
                // onReady: onPlayerReady
                onStateChange: onPlayerStateChange,
            },
        })
    }

    // LOAD YOUTUBE API
    let tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.defer = true
    let firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    // DOM ELEMENTS & CONFIG
    const rteElement = document.getElementById('rte')
    const aTags = rteElement.getElementsByTagName('a')
    const modalWrapper = document.querySelector('.modal-wrapper')
    const modalBackdrop = document.querySelector('.modal-backdrop')
    const toggleModalButton = document.querySelectorAll('.modal-button')
    const showYoutubeIcon = true // false or true
    const autoPlayVideo = false // false or true

    // MODAL FUNCTIONS
    function toggleModal(element) {
        if (element.classList.contains('show-modal')) {
            player.current.stopVideo()
            element.classList.remove('show-modal')
            document.body.style.setProperty('overflow', null)
        } else {
            element.classList.add('show-modal')
            document.body.style.setProperty('overflow', 'hidden')
        }
    }

    toggleModalButton.forEach((button) => {
        button.addEventListener('click', () => {
            toggleModal(modalWrapper)
        })
    })

    modalBackdrop.addEventListener('click', () => {
        toggleModal(modalWrapper)
    })

    document.addEventListener('keydown', function (event) {
        if (
            event.key === 'Escape' &&
            modalWrapper.classList.contains('show-modal')
        ) {
            toggleModal(modalWrapper)
        }
    })

    // GET ALL YOUTUBE LINKS
    const youtubeLinks = Array.from(aTags).filter((tag) => tag.href.startsWith('https://www.youtube.com/watch'),)

    // SET CURRENT VIDEO
    let currentVideo = youtubeLinks[0].href.split('v=')[1]

    youtubeLinks.forEach((videoLink) => {
        const style = window.getComputedStyle(videoLink)
        const lineHeight = parseFloat(style.lineHeight)
        const fontSize = parseFloat(style.fontSize)
        const getMargin = (lineHeight - fontSize) / 4
        const marginTop = `${getMargin}px`

        if (showYoutubeIcon) {
            const youtubeIcon = `<svg style="margin-bottom: -${marginTop}; margin-right: 5px" width=${fontSize} height=${fontSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.543 6.498C22 8.28 22 12 22 12C22 12 22 15.72 21.543 17.502C21.289 18.487 20.546 19.262 19.605 19.524C17.896 20 12 20 12 20C12 20 6.107 20 4.395 19.524C3.45 19.258 2.708 18.484 2.457 17.502C2 15.72 2 12 2 12C2 12 2 8.28 2.457 6.498C2.711 5.513 3.454 4.738 4.395 4.476C6.107 4 12 4 12 4C12 4 17.896 4 19.605 4.476C20.55 4.742 21.292 5.516 21.543 6.498ZM10 15.5L16 12L10 8.5V15.5Z" fill="red"/>
  </svg>`
            videoLink.insertAdjacentHTML('afterbegin', youtubeIcon)
        }

        // PARSE VIDEO URL
        function parseVideoUrl(url) {
            const urlParams = new URLSearchParams(new URL(url).search)
            const videoId = urlParams.get('v')
            let startTimeParam = urlParams.get('t')

            let startTime = startTimeParam ? parseInt(startTimeParam, 10) : 0
            console.log(startTime)

            return { videoId, startTime }
        }

        // OPEN VIDEO MODAL ON CLICK
        videoLink.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()

            const { videoId, startTime } = parseVideoUrl(videoLink.href)

            if (player && videoId) {
                player.current.cueVideoById({
                    videoId: videoId,
                    startSeconds: startTime,
                })
                toggleModal(modalWrapper)
            }
        })
    })

    // PLAYER EVENTS
    function onPlayerStateChange(event) {
        const loading = document.querySelector('#loading')
        if (
            (event.data === YT.PlayerState.CUED &&
                modalWrapper.classList.contains('show-modal')) ||
            ((event.data === YT.PlayerState.PLAYING ||
                event.data === YT.PlayerState.BUFFERING ||
                event.data === YT.PlayerState.ENDED) &&
                modalWrapper.classList.contains('show-modal'))
        ) {
            // Hide loading animation when video is cued.
            loading.style.display = 'none'
        } else if (
            event.data === YT.PlayerState.PAUSED &&
            modalWrapper.classList.contains('show-modal')
        ) {
            loading.style.display = 'none'
        } else {
            loading.style.display = 'flex'
        }

        if (
            event.data === YT.PlayerState.CUED &&
            autoPlayVideo &&
            modalWrapper.classList.contains('show-modal')
        ) {
            player.current.playVideo()
        }
    }
})