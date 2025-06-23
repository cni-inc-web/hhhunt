document.querySelectorAll('.blog-article p').forEach(function(p) {
  // Clone p and remove all children (like <a>, <strong>, <em>, etc.) to get just the text
  const textOnly = p.cloneNode(true);
  textOnly.querySelectorAll('*').forEach(el => el.remove());
  const trimmedText = textOnly.textContent.trim();

  // If trimmed text is empty, p contains *only* tags
  const link = p.querySelector('a');
  if (link && trimmedText === '') {
    link.classList.add('blog-solo-p-link');
    // Append " »" as a text node to preserve inner HTML tags
    link.appendChild(document.createTextNode(' »'));
  }
});