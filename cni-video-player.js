 // Load YouTube API
 var tag = document.createElement('script');
 tag.src = "https://www.youtube.com/iframe_api";
 var firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 var player;
 function onYouTubeIframeAPIReady() {
   player = new YT.Player('youtube-video', {
     events: {
       'onReady': onPlayerReady
     }
   });
 }

 function onPlayerReady(event) {
   // Add event listeners to all divs with class 'time-button'
   var buttons = document.querySelectorAll('.play-video-button');
   buttons.forEach(function(button) {
     button.addEventListener('click', function() {
       // Get the timestamp from the data-timestamp attribute
       var timestamp = parseInt(this.getAttribute('startmarker'));
       player.seekTo(timestamp);
     });
   });
 }