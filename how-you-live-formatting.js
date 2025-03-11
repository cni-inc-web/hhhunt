document.addEventListener("DOMContentLoaded", () => {
  const selector = "h1, h2, h3, h4, p, li"; // Separate HTML, Class, or ID Selectors with commas
  const identifier = "how you live"; // String you want to find and wrap
  const replacementString = ""; // Leave blank if you want to keep the original string
  const addClassToIdentifier = "how-you-live-underline"; // Class that gets added to the span for styling

  // Regular expression to find the identifier string
  const pattern = new RegExp(`\\b(${identifier})`, "gi");

  // Replacement logic
  const replacement = !replacementString
    ? `<span class="${addClassToIdentifier}">$1</span>`
    : `<span class="${addClassToIdentifier}">${replacementString}</span>`;

  // Loop through all selected elements
  Array.from(document.querySelectorAll(selector)).forEach((element) => {
    // Skip processing if the element already contains the class
    if (element.innerHTML.includes(`class="${addClassToIdentifier}"`)) {
      return;
    }
    // Replace the identifier string with the wrapped version
    element.innerHTML = element.innerHTML.replace(pattern, replacement);
  });
});
