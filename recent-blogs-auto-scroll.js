
var counter = 1;
var totalHeight = 0;
var delta = 0;
$(document).ready(function () {

    var time_to_scroll = 5000;
    var animationSpeed = 1000;

    var elementCount = $(".recent-posts_feed-wrapper").children().length;
    var elementHeight = $(".recent-posts_feed-wrapper").height()
    $(".recent-posts_feed-wrapper .recent-posts_item").each(function () {

        $(this).attr('id', "row_" + counter)
        counter++;
    });


    var moveInterval = setInterval(moveDiv, time_to_scroll);

    // stops animation on hover
    $(".recent-posts-collection-list-wrapper").hover(
        function () {
            clearInterval(moveInterval);
            console.log("clearInterval");


        },
        function () {

            moveInterval = setInterval(moveDiv, time_to_scroll);
        }
    );

    counter = 1;


    function moveDiv() {

        if (counter > elementCount - 1) {
            counter = 1;
            totalHeight = 0;
        }
        if (totalHeight > elementHeight) {
            counter = 1;
            totalHeight = 0;
        }


        $('.recent-posts-collection-list-wrapper').animate({
            scrollTop: totalHeight
        }, animationSpeed, function () {
            totalHeight += $("#row_" + counter).outerHeight(true);   // true ➜ include margin
            counter++;

            console.log($('#row_1').position().top);
            console.log($('.recent-posts-collection-list-wrapper').position().top);

        });
        return false;


    }
    $(window).resize(function () {
        counter = 1;
        totalHeight = 0;
    });

    $('.recent-posts-collection-list-wrapper').bind('mousewheel', function (e) {
        clearInterval(moveInterval);

        var offset = ($('#row_1').position().top - $('.recent-posts-collection-list-wrapper').position().top) * -1.1
        console.log("offset: " + offset);

        totalHeight = offset;


    });

});