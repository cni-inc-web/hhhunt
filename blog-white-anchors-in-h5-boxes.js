$(document).ready(function () {
    try {
        // Select the specific div element
        var targetDiv = $('div[fs-richtext-element="rich-text"].blog-article.w-richtext');

        if (targetDiv.length > 0) {
            // Select all h5 elements within the specific div element
            var h5Elements = targetDiv.find("h5");

            if (h5Elements.length > 0) {
                // Loop through each h5 element
                h5Elements.each(function () {
                    // Select all a elements within the current h5 element
                    var links = $(this).find("a");

                    if (links.length > 0) {
                        // Loop through each a element and change its color to white
                        links.each(function () {
                            $(this).css("color", "#0289e5");
                        });
                    }
                });
            }
        }
    } catch (error) {
        console.error("An error occurred while changing the link color:", error);
    }
});