  $(document).ready(function () {
    let counter = 1;
    const time_to_scroll = 5000;
    const animationSpeed = 1000;
    const $wrapper = $(".recent-posts-collection-list-wrapper");
    const $items = $(".recent-posts_feed-wrapper .recent-posts_item");
    const elementCount = $items.length;

    // Assign IDs to each item for reference
    $items.each(function (index) {
      $(this).attr("id", "row_" + (index + 1));
    });

    // Start the interval
    let moveInterval = setInterval(moveDiv, time_to_scroll);

    // Pause on hover
    $wrapper.hover(
      function () {
        clearInterval(moveInterval);
      },
      function () {
        moveInterval = setInterval(moveDiv, time_to_scroll);
      }
    );

    // Scroll to the top on resize
    $(window).resize(function () {
      counter = 1;
      $wrapper.scrollTop(0);
    });

    // Mouse wheel interaction overrides scroll
    $wrapper.on("mousewheel", function (e) {
      clearInterval(moveInterval);
      // Match scroll position to nearest item
      const offset = $("#row_1").position().top - $wrapper.position().top;
      $wrapper.scrollTop(Math.abs(offset));
    });

    // Move to the next item in the list
    function moveDiv() {
      if (counter > elementCount) {
        counter = 1;
      }

      const $target = $("#row_" + counter);
      $wrapper.animate(
        {
          scrollTop: $target.position().top
        },
        animationSpeed,
        function () {
          counter++;
        }
      );
    }
  });