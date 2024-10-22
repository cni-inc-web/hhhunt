var Webflow = Webflow || [];
Webflow.push(function() {
  var l = $('#flowbaseSlider .w-slider-arrow-left');
  var r = $('#flowbaseSlider .w-slider-arrow-right');
  $('#flowbaseSlider')
    .on('click', '.corp-testimonial-slider-left', function() {
      l.trigger('tap');
    })
    .on('click', '.corp-testimonial-slider-right', function() {
      r.trigger('tap');
    });
});