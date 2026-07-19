const form = document.querySelector('form');
const statusBox = document.querySelector('.status');
const resultBox = document.querySelector('.result-box');
let pendingDownload = null;

function setStatus(message) {
  if (statusBox) {
    statusBox.textContent = message;
  }
}

function setResult(message) {
  if (resultBox) {
    resultBox.hidden = false;
    resultBox.textContent = message;
  }
}

function getFormValues(formElement) {
  const values = {};

  formElement.querySelectorAll('input, select, textarea').forEach((field) => {
    const key = field.name || field.id;
    if (!key) {
      return;
    }

    values[key] = field.type === 'number' ? Number(field.value) : field.value;
  });

  return values;
}

function roundNumber(value) {
  if (!Number.isFinite(value)) {
    return value;
  }

  return Number(value.toFixed(2));
}

function safeCalcAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) {
    return 'Please enter a valid birth date.';
  }

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    days += 30;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `Age: ${years} years, ${months} months, ${days} days`;
}

function calculateResult(calcType, values) {
  switch (calcType) {
    case 'age':
      return safeCalcAge(values.birthDate);
    case 'bmi': {
      const weight = Number(values.weight);
      const height = Number(values.height) / 100;
      const bmi = weight / (height * height);
      return `BMI: ${roundNumber(bmi)}`;
    }
    case 'percentage': {
      const part = Number(values.part);
      const total = Number(values.total);
      const percentage = total ? (part / total) * 100 : 0;
      return `Percentage: ${roundNumber(percentage)}%`;
    }
    case 'discount': {
      const price = Number(values.price);
      const discount = Number(values.discount);
      const discounted = price - (price * discount) / 100;
      return `Discounted price: ${roundNumber(discounted)}`;
    }
    case 'tip': {
      const bill = Number(values.bill);
      const tip = Number(values.tip);
      const tipValue = (bill * tip) / 100;
      return `Tip amount: ${roundNumber(tipValue)} | Total: ${roundNumber(bill + tipValue)}`;
    }
    case 'simple-interest': {
      const principal = Number(values.principal);
      const rate = Number(values.rate);
      const time = Number(values.time);
      const interest = (principal * rate * time) / 100;
      return `Simple interest: ${roundNumber(interest)}`;
    }
    case 'compound-interest': {
      const principal = Number(values.principal);
      const rate = Number(values.rate) / 100;
      const time = Number(values.time);
      const amount = principal * Math.pow(1 + rate, time);
      return `Compound amount: ${roundNumber(amount)}`;
    }
    case 'loan-emi': {
      const principal = Number(values.principal);
      const rate = Number(values.rate) / 1200;
      const months = Number(values.months);
      const emi = rate === 0 ? principal / months : (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      return `EMI: ${roundNumber(emi)}`;
    }
    case 'salary-hourly': {
      const salary = Number(values.salary);
      const weeks = Number(values.weeks || 52);
      const hours = Number(values.hours || 40);
      const hourly = salary / (weeks * hours);
      return `Hourly pay: ${roundNumber(hourly)}`;
    }
    case 'date-diff': {
      const start = new Date(values.startDate);
      const end = new Date(values.endDate);
      const diff = Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
      return `Day difference: ${diff}`;
    }
    case 'speed': {
      const distance = Number(values.distance);
      const time = Number(values.time);
      return `Speed: ${roundNumber(distance / time)}`;
    }
    case 'area-rectangle': {
      return `Area: ${roundNumber(Number(values.length) * Number(values.width))}`;
    }
    case 'triangle-area': {
      return `Area: ${roundNumber((Number(values.base) * Number(values.height)) / 2)}`;
    }
    case 'circle-area': {
      return `Area: ${roundNumber(Math.PI * Number(values.radius) * Number(values.radius))}`;
    }
    case 'cube-volume': {
      return `Volume: ${roundNumber(Math.pow(Number(values.side), 3))}`;
    }
    case 'cylinder-volume': {
      return `Volume: ${roundNumber(Math.PI * Math.pow(Number(values.radius), 2) * Number(values.height))}`;
    }
    case 'profit-margin': {
      const cost = Number(values.cost);
      const revenue = Number(values.revenue);
      const margin = revenue ? ((revenue - cost) / revenue) * 100 : 0;
      return `Profit margin: ${roundNumber(margin)}%`;
    }
    case 'tax': {
      const amount = Number(values.amount);
      const rate = Number(values.rate);
      return `Tax amount: ${roundNumber((amount * rate) / 100)} | Total: ${roundNumber(amount + (amount * rate) / 100)}`;
    }
    case 'gst': {
      const amount = Number(values.amount);
      const rate = Number(values.rate);
      return `GST amount: ${roundNumber((amount * rate) / 100)} | Total: ${roundNumber(amount + (amount * rate) / 100)}`;
    }
    case 'interest-rate': {
      const amount = Number(values.amount);
      const rate = Number(values.rate);
      return `Interest: ${roundNumber((amount * rate) / 100)}`;
    }
    case 'ratio': {
      const a = Number(values.valueA);
      const b = Number(values.valueB);
      if (!a || !b) {
        return 'Ratio requires both values.';
      }
      const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
      const divisor = gcd(Math.abs(a), Math.abs(b));
      return `Ratio: ${roundNumber(a / divisor)}:${roundNumber(b / divisor)}`;
    }
    case 'grade': {
      const marks = Number(values.marks);
      const total = Number(values.total);
      const grade = total ? (marks / total) * 100 : 0;
      return `Grade: ${roundNumber(grade)}%`;
    }
    case 'pixel-size': {
      const width = Number(values.widthPx);
      const height = Number(values.heightPx);
      const dpi = Number(values.dpi);
      return `Physical size: ${roundNumber((width / dpi) * 2.54)} cm x ${roundNumber((height / dpi) * 2.54)} cm`;
    }
    case 'work-hours': {
      const start = new Date(`2020-01-01T${values.startTime}`);
      const end = new Date(`2020-01-01T${values.endTime}`);
      const hours = Math.max(0, (end - start) / (1000 * 60 * 60));
      return `Work hours: ${roundNumber(hours)}`;
    }
    case 'fuel-cost': {
      const distance = Number(values.distance);
      const mileage = Number(values.mileage);
      const price = Number(values.price);
      return `Fuel cost: ${roundNumber((distance / mileage) * price)}`;
    }
    case 'weight-convert': {
      const kg = Number(values.kg);
      return `Pounds: ${roundNumber(kg * 2.20462)} | Grams: ${roundNumber(kg * 1000)}`;
    }
    case 'length-convert': {
      const meters = Number(values.meters);
      return `Feet: ${roundNumber(meters * 3.28084)} | Inches: ${roundNumber(meters * 39.3701)}`;
    }
    case 'temperature-convert': {
      const celsius = Number(values.celsius);
      return `Fahrenheit: ${roundNumber((celsius * 9) / 5 + 32)} | Kelvin: ${roundNumber(celsius + 273.15)}`;
    }
    case 'data-size': {
      const mb = Number(values.mb);
      return `GB: ${roundNumber(mb / 1024)} | TB: ${roundNumber(mb / 1024 / 1024)}`;
    }
    case 'daily-budget': {
      const budget = Number(values.budget);
      const days = Number(values.days);
      return `Daily budget: ${roundNumber(budget / days)}`;
    }
    case 'unit-price': {
      const price = Number(values.price);
      const quantity = Number(values.quantity);
      return `Unit price: ${roundNumber(price / quantity)}`;
    }
    case 'savings-goal': {
      const goal = Number(values.goal);
      const months = Number(values.months);
      return `Monthly savings: ${roundNumber(goal / months)}`;
    }
    case 'break-even': {
      const fixedCost = Number(values.fixedCost);
      const contribution = Number(values.contribution);
      return `Break-even units: ${roundNumber(fixedCost / contribution)}`;
    }
    case 'net-pay': {
      const gross = Number(values.gross);
      const deductions = Number(values.deductions);
      return `Net pay: ${roundNumber(gross - deductions)}`;
    }
    case 'co2-footprint': {
      const distance = Number(values.distance);
      const fuel = Number(values.fuel);
      return `CO2 estimate: ${roundNumber(distance * fuel * 2.31)}`;
    }
    case 'heart-rate-zone': {
      const age = Number(values.age);
      const resting = Number(values.resting);
      const max = 220 - age;
      return `Target zone: ${roundNumber((max - resting) * 0.6 + resting)} - ${roundNumber((max - resting) * 0.8 + resting)}`;
    }
    case 'credit-payoff': {
      const balance = Number(values.balance);
      const payment = Number(values.payment);
      return `Payoff months: ${roundNumber(balance / payment)}`;
    }
    case 'sleep': {
      const wakeTime = new Date(`2020-01-01T${values.wakeTime}`);
      const cycles = Number(values.cycles);
      const sleepHours = cycles * 1.5;
      return `Suggested sleep time: ${new Date(wakeTime.getTime() - sleepHours * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    case 'average': {
      const numbers = String(values.numbers).split(',').map(Number).filter((v) => !Number.isNaN(v));
      return `Average: ${roundNumber(numbers.reduce((sum, item) => sum + item, 0) / Math.max(numbers.length, 1))}`;
    }
    case 'sum': {
      const numbers = String(values.numbers).split(',').map(Number).filter((v) => !Number.isNaN(v));
      return `Sum: ${roundNumber(numbers.reduce((sum, item) => sum + item, 0))}`;
    }
    case 'product': {
      const numbers = String(values.numbers).split(',').map(Number).filter((v) => !Number.isNaN(v));
      return `Product: ${roundNumber(numbers.reduce((product, item) => product * item, 1))}`;
    }
    case 'square-root': {
      return `Square root: ${roundNumber(Math.sqrt(Number(values.value)))}`;
    }
    case 'power': {
      return `Power: ${roundNumber(Math.pow(Number(values.base), Number(values.exponent)))}`;
    }
    case 'log': {
      return `Log: ${roundNumber(Math.log(Number(values.value)))}`;
    }
    case 'pi': {
      return `Pi result: ${roundNumber(Number(values.value) * Math.PI)}`;
    }
    case 'currency': {
      const amount = Number(values.amount);
      return `INR estimate: ${roundNumber(amount * 83.7)}`;
    }
    case 'generic': {
      const v1 = Number(values.value1);
      const v2 = Number(values.value2);
      return `Result: ${roundNumber(v1 + v2)}`;
    }
    default:
      return 'Calculator logic not configured yet.';
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

    if (tool === 'calculator') {
      const values = getFormValues(form);
      const result = calculateResult(form.dataset.calc, values);
      setStatus('Calculation completed.');
      setResult(result);
      return;
    }

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
