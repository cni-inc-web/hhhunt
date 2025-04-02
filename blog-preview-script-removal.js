document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        console.log("Script started: Checking .features_list, .related_list, and .highlight_list elements.");

        // Function to process CMS lists
        function processCMSList(listSelector, itemSelector) {
            document.querySelectorAll(listSelector).forEach((cmsList, listIndex) => {
                console.log(`Processing ${listSelector} #${listIndex + 1}`);

                cmsList.querySelectorAll(itemSelector).forEach((item, itemIndex) => {
                    const previewState = item.querySelector("#preview-state");

                    if (previewState) {
                        const stateText = previewState.textContent.trim().toLowerCase();
                        console.log(`${itemSelector} #${itemIndex + 1} - Preview State:`, stateText);

                        if (stateText === "true") {
                            item.style.display = "none";
                            console.log(`${itemSelector} #${itemIndex + 1} hidden.`);
                        }
                    } else {
                        console.warn(`${itemSelector} #${itemIndex + 1} does not have #preview-state.`);
                    }
                });
            });
        }

        // Process .features_list, .related_list, and .highlight_list
        processCMSList(".features_list", ".features_item");
        processCMSList(".related_list", ".related_item");
        processCMSList(".highlight_list", ".highlight_item");

        console.log("Script completed.");
    }, 250); // Delay for Webflow CMS content to load
});
