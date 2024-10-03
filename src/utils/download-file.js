export function downloadStringAsHtmlFile(content, filename) {
  // Create a blob with the content of the string
  const blob = new Blob([content], { type: 'text/html' });

  // Create an object URL for the blob
  const url = URL.createObjectURL(blob);

  // Create an anchor element and simulate a click to start the download
  const a = document.createElement('a');
  a.href = url;
  a.download = replaceFileExtensionWithHTML(filename);
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function replaceFileExtensionWithHTML(filename) {
  return filename.replace(/\.[^/.]+$/, '.html');
}
