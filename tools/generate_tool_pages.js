const fs = require('fs');
const path = require('path');

const formats = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff', 'avif', 'heic'];

function toDisplayName(value) {
  return value.toUpperCase();
}

function buildPage({ slug, title, description, tool, inputAccept, actionLabel, selectLabel, selectOptions }) {
  const normalizedSlug = slug.replace(/[^a-z0-9-]/g, '-');
  const filePath = path.join(__dirname, `${normalizedSlug}.html`);
  const formDataTool = tool;
  const selectMarkup = selectOptions && selectOptions.length
    ? `
          <label>
            ${selectLabel}
            <select>
              ${selectOptions.map((option) => `<option value="${option.value}">${option.label}</option>`).join('')}
            </select>
          </label>`
    : '';

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} | Talksyra PDF Studio</title>
    <meta name="description" content="${description}" />
    <link rel="stylesheet" href="../styles.css" />
  </head>
  <body>
    <header class="topbar">
      <div class="container nav">
        <a href="../index.html" class="brand">Talksyra <span>PDF Studio</span></a>
        <nav>
          <a href="../index.html">Home</a>
          <a href="../index.html#tools">All Tools</a>
        </nav>
      </div>
    </header>

    <main class="container tool-page">
      <a class="back-link" href="../index.html">← Back to All Tools</a>
      <h1>${title}</h1>
      <p>${description}</p>

      <section class="tool-panel">
        <form data-tool="${formDataTool}" data-target="${slug}">
          <label class="upload-box">
            <span class="upload-title">Drop your file here</span>
            <span class="upload-subtitle">Click to choose your ${inputAccept.replace(/\./g, '').replace(/,/g, ' / ')} file</span>
            <input type="file" ${inputAccept ? `accept="${inputAccept}"` : ''} />
          </label>
          <div class="selected-file-name">No file selected</div>
          ${selectMarkup}
          <button type="submit">${actionLabel}</button>
        </form>
        <div class="status"></div>
        <div class="tool-actions">
          <button type="button" class="download-result-btn" hidden>Download Result</button>
          <button type="button" class="reset-result-btn">Reset</button>
        </div>
      </section>
    </main>

    <script src="../script.js"></script>
  </body>
</html>
`;

  fs.writeFileSync(filePath, html);
}

const pages = [];

const extraTools = [
  {
    slug: 'image-rotate',
    title: 'Image Rotate',
    description: 'Rotate JPG, PNG, and other image files with a clean, professional workflow.',
    tool: 'image-rotate',
    inputAccept: 'image/*',
    actionLabel: 'Rotate Image',
    selectLabel: 'Rotation angle',
    selectOptions: [
      { value: '90', label: '90° clockwise' },
      { value: '180', label: '180°' },
      { value: '270', label: '270° clockwise' },
    ],
  },
  {
    slug: 'image-crop',
    title: 'Image Crop',
    description: 'Crop image files into a focused preview area for web, product, or document use.',
    tool: 'image-crop',
    inputAccept: 'image/*',
    actionLabel: 'Crop Image',
    selectLabel: 'Crop mode',
    selectOptions: [
      { value: 'center', label: 'Center crop' },
      { value: 'square', label: 'Square crop' },
      { value: 'portrait', label: 'Portrait crop' },
    ],
  },
  {
    slug: 'image-watermark',
    title: 'Image Watermark',
    description: 'Add a clean brand, draft, or confidential watermark to image files.',
    tool: 'image-watermark',
    inputAccept: 'image/*',
    actionLabel: 'Add Watermark',
    selectLabel: 'Watermark type',
    selectOptions: [
      { value: 'text', label: 'Text' },
      { value: 'brand', label: 'Brand' },
    ],
  },
  {
    slug: 'image-metadata',
    title: 'Image Metadata Viewer',
    description: 'View image metadata and file details professionally in one screen.',
    tool: 'image-metadata',
    inputAccept: 'image/*',
    actionLabel: 'View Metadata',
    selectLabel: 'Details',
    selectOptions: [{ value: 'all', label: 'All' }],
  },
  {
    slug: 'file-name-cleaner',
    title: 'File Name Cleaner',
    description: 'Clean and standardize image or document filenames for professional uploads.',
    tool: 'file-name-cleaner',
    inputAccept: '*',
    actionLabel: 'Clean Name',
    selectLabel: 'Output style',
    selectOptions: [
      { value: 'lowercase', label: 'Lowercase' },
      { value: 'slug', label: 'Slug' },
      { value: 'title', label: 'Title case' },
    ],
  },
  {
    slug: 'jpg-to-png',
    title: 'JPG to PNG',
    description: 'Convert JPG files to PNG format with clean output and easy sharing.',
    tool: 'image-convert',
    inputAccept: '.jpg,.jpeg',
    actionLabel: 'Convert to PNG',
    selectLabel: 'Output format',
    selectOptions: [{ value: 'png', label: 'PNG' }],
  },
  {
    slug: 'png-to-jpg',
    title: 'PNG to JPG',
    description: 'Convert PNG files to JPG format for fast and lightweight image sharing.',
    tool: 'image-convert',
    inputAccept: '.png',
    actionLabel: 'Convert to JPG',
    selectLabel: 'Output format',
    selectOptions: [{ value: 'jpg', label: 'JPG' }],
  },
  {
    slug: 'png-to-webp',
    title: 'PNG to WebP',
    description: 'Convert PNG image files into WebP for modern, optimized web delivery.',
    tool: 'image-convert',
    inputAccept: '.png',
    actionLabel: 'Convert to WebP',
    selectLabel: 'Output format',
    selectOptions: [{ value: 'webp', label: 'WebP' }],
  },
  {
    slug: 'jpg-to-webp',
    title: 'JPG to WebP',
    description: 'Convert JPG files to WebP for faster, more optimized image delivery.',
    tool: 'image-convert',
    inputAccept: '.jpg,.jpeg',
    actionLabel: 'Convert to WebP',
    selectLabel: 'Output format',
    selectOptions: [{ value: 'webp', label: 'WebP' }],
  },
  {
    slug: 'png-to-bmp',
    title: 'PNG to BMP',
    description: 'Convert PNG image files into BMP output for legacy or high-fidelity workflows.',
    tool: 'image-convert',
    inputAccept: '.png',
    actionLabel: 'Convert to BMP',
    selectLabel: 'Output format',
    selectOptions: [{ value: 'bmp', label: 'BMP' }],
  },
  {
    slug: 'jpg-to-bmp',
    title: 'JPG to BMP',
    description: 'Convert JPG files into BMP output for compatibility-focused workflows.',
    tool: 'image-convert',
    inputAccept: '.jpg,.jpeg',
    actionLabel: 'Convert to BMP',
    selectLabel: 'Output format',
    selectOptions: [{ value: 'bmp', label: 'BMP' }],
  },
];

pages.push(...extraTools);

formats.forEach((format) => {
  pages.push({
    slug: `pdf-to-${format}`,
    title: `PDF to ${toDisplayName(format)}`,
    description: `Convert PDF pages into ${toDisplayName(format)} images with a fast, professional workflow.`,
    tool: 'pdf-to-image',
    inputAccept: '.pdf',
    actionLabel: `Convert to ${toDisplayName(format)}`,
    selectLabel: 'Output format',
    selectOptions: [{ value: format, label: toDisplayName(format) }],
  });

  pages.push({
    slug: `${format}-to-pdf`,
    title: `${toDisplayName(format)} to PDF`,
    description: `Convert ${toDisplayName(format)} image files into a clean PDF document instantly.`,
    tool: 'image-to-pdf',
    inputAccept: format === 'jpeg' ? '.jpeg,.jpg' : `.${format}`,
    actionLabel: 'Create PDF',
    selectLabel: 'Page size',
    selectOptions: [
      { value: 'A4', label: 'A4' },
      { value: 'Letter', label: 'Letter' },
      { value: 'Auto', label: 'Auto' },
    ],
  });
});

formats.forEach((fromFormat) => {
  formats.forEach((toFormat) => {
    if (fromFormat === toFormat) {
      return;
    }

    pages.push({
      slug: `${fromFormat}-to-${toFormat}`,
      title: `${toDisplayName(fromFormat)} to ${toDisplayName(toFormat)}`,
      description: `Convert ${toDisplayName(fromFormat)} images into ${toDisplayName(toFormat)} format quickly and professionally.`,
      tool: 'image-convert',
      inputAccept: fromFormat === 'jpeg' ? '.jpeg,.jpg' : `.${fromFormat}`,
      actionLabel: `Convert to ${toDisplayName(toFormat)}`,
      selectLabel: 'Output format',
      selectOptions: [{ value: toFormat, label: toDisplayName(toFormat) }],
    });
  });
});

pages.push(
  {
    slug: 'pdf-page-counter',
    title: 'PDF Page Counter',
    description: 'Count the total number of pages in a PDF document instantly.',
    tool: 'pdf-page-counter',
    inputAccept: '.pdf',
    actionLabel: 'Count Pages',
    selectLabel: 'Calculation',
    selectOptions: [{ value: 'pages', label: 'PDF page count' }],
  },
  {
    slug: 'pdf-size-checker',
    title: 'PDF Size Checker',
    description: 'Check how large your PDF file is and understand the document size quickly.',
    tool: 'pdf-size-checker',
    inputAccept: '.pdf',
    actionLabel: 'Check Size',
    selectLabel: 'Display',
    selectOptions: [{ value: 'size', label: 'File size' }],
  },
  {
    slug: 'pdf-to-text',
    title: 'PDF to Text',
    description: 'Extract readable text from a PDF file into a clean text document.',
    tool: 'pdf-to-text',
    inputAccept: '.pdf',
    actionLabel: 'Extract Text',
    selectLabel: 'Output',
    selectOptions: [{ value: 'txt', label: 'TXT' }],
  },
  {
    slug: 'image-compressor',
    title: 'Image Compressor',
    description: 'Reduce image file size professionally while keeping quality as high as possible.',
    tool: 'image-compress',
    inputAccept: 'image/*',
    actionLabel: 'Compress Image',
    selectLabel: 'Output quality',
    selectOptions: [
      { value: '0.6', label: 'Balanced' },
      { value: '0.4', label: 'Smaller size' },
      { value: '0.8', label: 'High quality' },
    ],
  },
  {
    slug: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize image dimensions quickly for web, social, or print-ready output.',
    tool: 'image-resize',
    inputAccept: 'image/*',
    actionLabel: 'Resize Image',
    selectLabel: 'Target size',
    selectOptions: [
      { value: '1200', label: '1200 px' },
      { value: '1600', label: '1600 px' },
      { value: '900', label: '900 px' },
    ],
  }
);

pages.forEach((page) => buildPage(page));

console.log(`Generated ${pages.length} tool pages in ${__dirname}`);
