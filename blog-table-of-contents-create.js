$(document).ready(function () {

    // check to see if the blog list has been turned on
    if ($("div").hasClass("blog-content-links_component")) {
        var header = '';
        $(".blog-article h2").each(function () {
            // get each h2 text
            var t = $(this).html();
            // remove special characters from h2 text
            var cleanText = formatText(t);

            // create div above h2 and assign id
            $(this).before('<div id="' + cleanText + '" class="scroll-margin-top-50px"></div>');

            // create the <li> list
            header = header + '<li><a href="#' + cleanText + '">' + t + '</a></li>';

            $(".h2_list-toc").html(header);

        });
    }


    function formatText(t) {

        t = t.replace(/[^a-z0-9\s]/gi, '');
        t = t.replace(/[$@%]/g, '');
        t = t.replace(/\s+/g, '-');
        t = t.replace(/ *\([^)]*\) */g, "");
        t = t.replace(/ *\([^)]*\) */g, "").toLowerCase();

        console.log(t);
        return t;

    }

});