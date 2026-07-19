const form = document.querySelector('form');
const statusBox = document.querySelector('.status');
let pendingDownload = null;

function setStatus(message) {
  if (statusBox) {
    statusBox.textContent = message;
  }
}

function getSelectedFileNames(fileInput) {
  const files = Array.from(fileInput.files || []);
  if (!files.length) {
    return 'No file selected';
  }

  return files.map((file) => file.name).join(', ');
}

function syncSelectedFileState(fileInput, selectedNameEl) {
  if (!fileInput || !selectedNameEl) {
    return;
  }

  const files = Array.from(fileInput.files || []);
  const names = getSelectedFileNames(fileInput);
  selectedNameEl.textContent = names;
  selectedNameEl.classList.toggle('is-active', files.length > 0);

  if (form) {
    form.classList.toggle('has-file', files.length > 0);
  }
}

function attachToolActionButtons() {
  if (!form) {
    return;
  }

  const downloadButton = form.parentElement?.querySelector('.download-result-btn');
  const resetButton = form.parentElement?.querySelector('.reset-result-btn');

  if (downloadButton) {
    downloadButton.addEventListener('click', () => openDownloadModal());
  }

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      form.reset();
      const fileInput = form.querySelector('input[type="file"]');
      const selectedNameEl = form.querySelector('.selected-file-name');
      syncSelectedFileState(fileInput, selectedNameEl);
      pendingDownload = null;

      if (downloadButton) {
        downloadButton.hidden = true;
        downloadButton.textContent = 'Download Result';
      }

      const modal = document.querySelector('.download-modal');
      if (modal) {
        modal.remove();
      }
    });
  }
}

function getDownloadFormats(toolName) {
  const allFormats = ['ZIP', 'PDF', 'DOC', 'DOCX', 'PNG', 'JPG', 'TXT'];
  const formatMap = {
    merge: ['ZIP', 'PDF'],
    split: ['ZIP', 'PDF'],
    compress: ['ZIP', 'PDF'],
    'pdf-to-word': ['DOCX', 'DOC', 'PDF', 'TXT', 'ZIP'],
    'word-to-pdf': ['PDF', 'DOCX', 'ZIP'],
    'pdf-to-image': ['PNG', 'JPG', 'ZIP'],
    'image-to-pdf': ['PDF', 'ZIP', 'PNG', 'JPG'],
    rotate: ['PDF', 'ZIP'],
    unlock: ['PDF', 'ZIP'],
    watermark: ['PDF', 'ZIP'],
  };

  return [...new Set([...(formatMap[toolName] || allFormats), ...allFormats])];
}

function openDownloadModal() {
  if (!pendingDownload || !form) {
    return;
  }

  const modal = document.querySelector('.download-modal');
  if (modal) {
    modal.remove();
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'download-modal';
  wrapper.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h3>Choose download format</h3>
        <button type="button" class="modal-close">×</button>
      </div>
      <div class="format-grid">
        ${getDownloadFormats(form.dataset.tool)
          .map((format) => `
            <label class="format-option">
              <input type="radio" name="download-format" value="${format}" ${format === 'PDF' ? 'checked' : ''} />
              <span>${format}</span>
            </label>
          `)
          .join('')}
      </div>
      <div class="modal-actions">
        <button type="button" class="modal-confirm">Confirm Download</button>
      </div>
    </div>
  `;

  const closeButton = wrapper.querySelector('.modal-close');
  closeButton.addEventListener('click', () => wrapper.remove());

  const confirmButton = wrapper.querySelector('.modal-confirm');
  confirmButton.addEventListener('click', () => {
    const selected = wrapper.querySelector('input[name="download-format"]:checked')?.value || 'PDF';
    const fileExt = selected.toLowerCase();
    const url = URL.createObjectURL(new Blob([pendingDownload.blob], { type: pendingDownload.blob.type || 'application/octet-stream' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = pendingDownload.filename.replace(/\.[^/.]+$/, '') + `.${fileExt}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    wrapper.remove();
  });

  document.body.appendChild(wrapper);
}

function prepareDownload(blob, filename, formats = ['PDF']) {
  pendingDownload = { blob, filename, formats };
  const button = form?.parentElement?.querySelector('.download-result-btn');
  if (button) {
    button.hidden = false;
    button.textContent = `Download ${filename}`;
  }
}

function parseRanges(input) {
  if (!input || !input.trim()) {
    return [];
  }

  return input
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .flatMap((part) => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        const pages = [];
        for (let i = start; i <= end; i += 1) pages.push(i);
        return pages;
      }

      return [Number(part)];
    });
}

function waitForLibraries() {
  const scripts = [
    'https://unpkg.com/pdf-lib/dist/pdf-lib.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://unpkg.com/mammoth/mammoth.browser.min.js',
    'https://unpkg.com/docx@8.5.0/build/index.umd.js',
  ];

  return Promise.all(
    scripts.map(
      (src) =>
        new Promise((resolve, reject) => {
          const existing = document.querySelector(`script[src="${src}"]`);
          if (existing) {
            if (existing.dataset.loaded === 'true') {
              resolve();
              return;
            }
            existing.addEventListener('load', () => resolve(), { once: true });
            existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
            return;
          }

          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.onload = () => {
            script.dataset.loaded = 'true';
            resolve();
          };
          script.onerror = () => reject(new Error(`Failed to load ${src}`));
          document.head.appendChild(script);
        })
    )
  );
}

async function loadPdfJsDocument(data, password = '') {
  if (!window['pdfjsLib']) {
    throw new Error('PDF.js is not available.');
  }

  const pdfjsLib = window['pdfjsLib'];
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  return pdfjsLib.getDocument({ data, password }).promise;
}

async function renderPageToImage(page, scale = 1.35) {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport }).promise;
  return canvas;
}

async function mergePdfFiles(files) {
  if (!window.PDFLib) {
    throw new Error('PDF.js library is not available.');
  }

  const mergedPdf = await window.PDFLib.PDFDocument.create();

  for (const file of files) {
    const srcBytes = await file.arrayBuffer();
    const srcPdf = await window.PDFLib.PDFDocument.load(srcBytes);
    const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const bytes = await mergedPdf.save();
  prepareDownload(new Blob([bytes], { type: 'application/pdf' }), 'merged.pdf');
}

async function splitPdfFile(file, rangesInput) {
  const ranges = parseRanges(rangesInput);
  const bytes = await file.arrayBuffer();
  const sourcePdf = await window.PDFLib.PDFDocument.load(bytes);
  const pageCount = sourcePdf.getPageCount();
  const selectedPages = ranges.length ? ranges : Array.from({ length: pageCount }, (_, i) => i + 1);

  for (const pageNumber of selectedPages) {
    const pageIndex = pageNumber - 1;
    if (pageIndex < 0 || pageIndex >= pageCount) {
      continue;
    }

    const newPdf = await window.PDFLib.PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageIndex]);
    newPdf.addPage(copiedPage);
    const outputBytes = await newPdf.save();
    prepareDownload(new Blob([outputBytes], { type: 'application/pdf' }), `split-page-${pageNumber}.pdf`);
  }
}

async function compressPdfFile(file) {
  const bytes = await file.arrayBuffer();
  const pdf = await loadPdfJsDocument(bytes);
  const compressed = await window.PDFLib.PDFDocument.create();

  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
    const page = await pdf.getPage(pageIndex);
    const canvas = await renderPageToImage(page, 0.9);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.65));
    const imageBytes = await blob.arrayBuffer();
    const jpgImage = await compressed.embedJpg(imageBytes);
    const pageWidth = canvas.width;
    const pageHeight = canvas.height;
    const newPage = compressed.addPage([pageWidth, pageHeight]);
    newPage.drawImage(jpgImage, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    });
  }

  const outputBytes = await compressed.save();
  prepareDownload(new Blob([outputBytes], { type: 'application/pdf' }), 'compressed.pdf');
}

async function pdfToWord(file) {
  if (!window['docx']) {
    throw new Error('docx library is not available.');
  }

  const bytes = await file.arrayBuffer();
  const pdf = await loadPdfJsDocument(bytes);
  const textParts = [];

  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
    const page = await pdf.getPage(pageIndex);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(' ');
    if (text.trim()) {
      textParts.push(text.trim());
    }
  }

  const { Document, Packer, Paragraph } = window.docx;
  const doc = new Document({
    sections: [{
      children: textParts.map((text) => new Paragraph(text)),
    }],
  });

  const blob = await Packer.toBlob(doc);
  prepareDownload(blob, 'converted.docx');
}

async function wordToPdf(file) {
  if (!window.mammoth || !window.PDFLib) {
    throw new Error('Mammoth or PDF library is not available.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({ arrayBuffer });
  const text = result.value || '';
  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const pdfDoc = await window.PDFLib.PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  let y = 760;
  const font = await pdfDoc.embedFont(window.PDFLib.StandardFonts.Helvetica);

  lines.slice(0, 35).forEach((line) => {
    page.drawText(line, {
      x: 40,
      y,
      size: 12,
      font,
      color: window.PDFLib.rgb(0, 0, 0),
    });
    y -= 18;
  });

  const pdfBytes = await pdfDoc.save();
  prepareDownload(new Blob([pdfBytes], { type: 'application/pdf' }), 'converted.pdf');
}

async function pdfToImage(file) {
  const bytes = await file.arrayBuffer();
  const pdf = await loadPdfJsDocument(bytes);

  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
    const page = await pdf.getPage(pageIndex);
    const canvas = await renderPageToImage(page, 1.4);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    prepareDownload(blob, `page-${pageIndex}.png`);
  }
}

async function imageToPdf(files) {
  const pdfDoc = await window.PDFLib.PDFDocument.create();

  for (const file of files) {
    const fileBytes = await file.arrayBuffer();
    const image = file.type === 'image/png'
      ? await pdfDoc.embedPng(fileBytes)
      : await pdfDoc.embedJpg(fileBytes);

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const bytes = await pdfDoc.save();
  prepareDownload(new Blob([bytes], { type: 'application/pdf' }), 'images.pdf');
}

async function rotatePdf(file, angleValue) {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await window.PDFLib.PDFDocument.load(bytes);
  const angleMap = {
    '90° clockwise': 90,
    '180°': 180,
    '90° anticlockwise': 270,
  };

  pdfDoc.getPages().forEach((page) => {
    page.setRotation(window.PDFLib.degrees(angleMap[angleValue] || 90));
  });

  const outputBytes = await pdfDoc.save();
  prepareDownload(new Blob([outputBytes], { type: 'application/pdf' }), 'rotated.pdf');
}

async function unlockPdf(file, password) {
  const bytes = await file.arrayBuffer();
  const pdf = await loadPdfJsDocument(bytes, password);
  const pdfDoc = await window.PDFLib.PDFDocument.create();

  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
    const page = await pdf.getPage(pageIndex);
    const canvas = await renderPageToImage(page, 1.1);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.75));
    const imageBytes = await blob.arrayBuffer();
    const image = await pdfDoc.embedJpg(imageBytes);
    const pageObj = pdfDoc.addPage([canvas.width, canvas.height]);
    pageObj.drawImage(image, {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    });
  }

  const outputBytes = await pdfDoc.save();
  prepareDownload(new Blob([outputBytes], { type: 'application/pdf' }), 'unlocked.pdf');
}

async function watermarkPdf(file, text, opacityValue) {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await window.PDFLib.PDFDocument.load(bytes);
  const opacityMap = {
    '25%': 0.25,
    '50%': 0.5,
    '75%': 0.75,
  };
  const font = await pdfDoc.embedFont(window.PDFLib.StandardFonts.Helvetica);

  pdfDoc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    page.drawText(text || 'CONFIDENTIAL', {
      x: width / 2 - 85,
      y: height / 2,
      size: 32,
      font,
      color: window.PDFLib.rgb(0.65, 0.65, 0.65),
      opacity: opacityMap[opacityValue] || 0.5,
      rotate: window.PDFLib.degrees(-45),
    });
  });

  const outputBytes = await pdfDoc.save();
  prepareDownload(new Blob([outputBytes], { type: 'application/pdf' }), 'watermarked.pdf');
}

async function handleSubmit(event) {
  event.preventDefault();
  if (!form) {
    return;
  }

  const tool = form.dataset.tool;
  const fileInput = form.querySelector('input[type="file"]');
  const textInput = form.querySelector('input[type="text"]');
  const passwordInput = form.querySelector('input[type="password"]');
  const areaInput = form.querySelector('textarea');
  const selectInput = form.querySelector('select');

  try {
    setStatus('Preparing files...');

    try {
      const healthResponse = await fetch('/api/health');
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        if (healthData?.ok) {
          setStatus(`Worker endpoint connected for ${tool}.`);
        }
      }
    } catch {
      setStatus('Local preview mode: using browser-side processing flow.');
    }

    await waitForLibraries();

    if (!fileInput || !fileInput.files?.length) {
      throw new Error('Please upload a file first.');
    }

    try {
      await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool,
          fileCount: fileInput.files.length,
          fileName: fileInput.files[0]?.name || 'upload',
        }),
      });
    } catch {
      // Ignore worker endpoint failures in local preview and continue with browser-side processing.
    }

    if (tool === 'merge') {
      await mergePdfFiles(Array.from(fileInput.files));
      setStatus('Merge completed.');
    } else if (tool === 'split') {
      await splitPdfFile(fileInput.files[0], areaInput ? areaInput.value : '');
      setStatus('Split completed.');
    } else if (tool === 'compress') {
      await compressPdfFile(fileInput.files[0]);
      setStatus('Compression completed.');
    } else if (tool === 'pdf-to-word') {
      await pdfToWord(fileInput.files[0]);
      setStatus('PDF converted to Word document.');
    } else if (tool === 'word-to-pdf') {
      await wordToPdf(fileInput.files[0]);
      setStatus('Word document converted to PDF.');
    } else if (tool === 'pdf-to-image') {
      await pdfToImage(fileInput.files[0]);
      setStatus('PDF pages exported to images.');
    } else if (tool === 'image-to-pdf') {
      await imageToPdf(Array.from(fileInput.files));
      setStatus('Images converted to PDF.');
    } else if (tool === 'rotate') {
      await rotatePdf(fileInput.files[0], selectInput ? selectInput.value : '90° clockwise');
      setStatus('Rotation completed.');
    } else if (tool === 'unlock') {
      await unlockPdf(fileInput.files[0], passwordInput ? passwordInput.value : '');
      setStatus('Unlock completed.');
    } else if (tool === 'watermark') {
      await watermarkPdf(fileInput.files[0], textInput ? textInput.value : 'CONFIDENTIAL', selectInput ? selectInput.value : '50%');
      setStatus('Watermark applied.');
    } else {
      setStatus('Tool not configured yet.');
    }
  } catch (error) {
    console.error(error);
    setStatus(error.message || 'Something went wrong while processing the file.');
  }
}

if (form && statusBox) {
  form.addEventListener('submit', handleSubmit);

  const fileInput = form.querySelector('input[type="file"]');
  const selectedName = form.querySelector('.selected-file-name');

  if (fileInput && selectedName) {
    fileInput.addEventListener('change', () => {
      syncSelectedFileState(fileInput, selectedName);
    });

    syncSelectedFileState(fileInput, selectedName);
  }

  attachToolActionButtons();
}
