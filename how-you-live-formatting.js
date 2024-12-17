document.addEventListener("DOMContentLoaded", () => {
  const selector = "h1, h2, h3, h4, p, li"; // Separate HTML, Class or ID Selectors with commas
  const identifier = "how you live"; // String you want to find and wrap
  const replacementString = ""; // Leave blank if you want to keep original string
  const addClassToIdentifier = "how-you-live-underline"; // Class that gets added to the span for styling
  //console.log(addClassToIdentifier);

  // No need to touch anything below
  const pattern = new RegExp(`\\b(${identifier})`, "gi");
  //console.log(pattern);
  const replacement = !replacementString
    ? `<span class="${addClassToIdentifier}">$1</span>`
    : `<span class="${addClassToIdentifier}">${replacementString}</span>`;
  console.log(replacement);
  Array.from(document.querySelectorAll(selector)).forEach((element) => {
    //console.log(element);
    element.innerHTML = element.innerHTML.replace(pattern, replacement);
    //   console.log("success");
  });
});  