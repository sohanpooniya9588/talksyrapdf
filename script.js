const form = document.querySelector('form');
const statusBox = document.querySelector('.status');

if (form && statusBox) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const toolName = document.querySelector('h1')?.textContent || 'PDF tool';
    statusBox.textContent = `${toolName} form received. Connect your Worker/API endpoint here to process uploads.`;
  });
}
