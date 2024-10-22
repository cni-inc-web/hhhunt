const videoButtons = Array.from(document.querySelectorAll(".play-video-button"));  
const iframe = document.getElementById("vPlayer");
let vimeoWrapper = document.getElementById("vPlayer");

// Load first video 
let firstVideoId = videoButtons[0].getAttribute("videoid")
const options = {
  id: firstVideoId, //first video
};

// Set iframe style attributes
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(attr => {
    element.setAttribute(attr, attributes[attr]);
  });
}

const attributes = {
  style: "display: block; aspect-ratio: 16/9; width: 100%; height: 100%",
};
//

const player = new Vimeo.Player(iframe, options);

player.on('loaded', function() {
	setAttributes(vimeoWrapper.firstChild, attributes);
});

const playVideo = async (id, time) => {
  try {
    await player.loadVideo(id);
    await player.setCurrentTime(time);
    await player.play();
  } catch (err) {
    console.log(err);
  }
};

videoButtons.forEach((button) => {
  let videoId = button.getAttribute("videoId");
  let startMarker = button.getAttribute("startMarker");
  button.addEventListener("click", () => {
    playVideo(videoId, startMarker);
  });
});

// Video Stop on Close
$(function(){
    $('.custom-lightbox-benefits_close-modal').click(function(){     
        $('iframe').attr('src', $('iframe').attr('src'));
    });
});
