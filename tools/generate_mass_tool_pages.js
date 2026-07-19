const fs = require('fs');
const path = require('path');

const outDir = __dirname;

const converters = [
  {
    category: 'Length',
    calc: 'length-convert',
    groups: [
      ['meter', 'm'],
      ['kilometer', 'km'],
      ['centimeter', 'cm'],
      ['millimeter', 'mm'],
      ['mile', 'mile'],
      ['foot', 'ft'],
      ['inch', 'in'],
      ['yard', 'yd'],
    ],
  },
  {
    category: 'Weight',
    calc: 'weight-convert',
    groups: [
      ['kilogram', 'kg'],
      ['gram', 'g'],
      ['milligram', 'mg'],
      ['pound', 'lb'],
      ['ounce', 'oz'],
      ['stone', 'st'],
      ['tonne', 'tonne'],
      ['quintal', 'q'],
    ],
  },
  {
    category: 'Area',
    calc: 'area-convert',
    groups: [
      ['square meter', 'sqm'],
      ['square kilometer', 'sqkm'],
      ['square centimeter', 'sqcm'],
      ['square foot', 'sqft'],
      ['square yard', 'sqyd'],
      ['acre', 'acre'],
      ['hectare', 'ha'],
      ['square mile', 'sqmile'],
    ],
  },
  {
    category: 'Volume',
    calc: 'volume-convert',
    groups: [
      ['liter', 'l'],
      ['milliliter', 'ml'],
      ['cubic meter', 'm3'],
      ['gallon', 'gal'],
      ['quart', 'qt'],
      ['pint', 'pt'],
      ['cup', 'cup'],
      ['cubic foot', 'ft3'],
    ],
  },
  {
    category: 'Speed',
    calc: 'speed-unit-convert',
    groups: [
      ['meter per second', 'mps'],
      ['kilometer per hour', 'kmh'],
      ['mile per hour', 'mph'],
      ['knot', 'knot'],
      ['foot per second', 'ftps'],
      ['centimeter per second', 'cmps'],
    ],
  },
  {
    category: 'Data',
    calc: 'data-unit-convert',
    groups: [
      ['bit', 'bit'],
      ['byte', 'byte'],
      ['kilobyte', 'kb'],
      ['megabyte', 'mb'],
      ['gigabyte', 'gb'],
      ['terabyte', 'tb'],
      ['kibibyte', 'kib'],
      ['mebibyte', 'mib'],
    ],
  },
  {
    category: 'Energy',
    calc: 'energy-convert',
    groups: [
      ['joule', 'j'],
      ['calorie', 'cal'],
      ['kilocalorie', 'kcal'],
      ['watt hour', 'wh'],
      ['kilowatt hour', 'kwh'],
      ['BTU', 'btu'],
    ],
  },
  {
    category: 'Pressure',
    calc: 'pressure-convert',
    groups: [
      ['pascal', 'pa'],
      ['kilopascal', 'kpa'],
      ['bar', 'bar'],
      ['atmosphere', 'atm'],
      ['PSI', 'psi'],
      ['mmHg', 'mmhg'],
    ],
  },
  {
    category: 'Angle',
    calc: 'angle-convert',
    groups: [
      ['degree', 'deg'],
      ['radian', 'rad'],
      ['gradian', 'grad'],
      ['minute', 'min'],
      ['second', 'sec'],
    ],
  },
  {
    category: 'Frequency',
    calc: 'frequency-convert',
    groups: [
      ['hertz', 'hz'],
      ['kilohertz', 'khz'],
      ['megahertz', 'mhz'],
      ['gigahertz', 'ghz'],
      ['RPM', 'rpm'],
    ],
  },
  {
    category: 'Power',
    calc: 'power-convert',
    groups: [
      ['watt', 'w'],
      ['kilowatt', 'kw'],
      ['megawatt', 'mw'],
      ['horsepower', 'hp'],
      ['BTU per hour', 'btuhr'],
    ],
  },
];

const financePages = [
  ['monthly-budget-planner', 'Monthly Budget Planner', 'Plan your monthly budget using income and expenses.', 'finance-budget', [{ name: 'income', label: 'Income', type: 'number' }, { name: 'expense', label: 'Expenses', type: 'number' }]],
  ['savings-rate-calculator', 'Savings Rate Calculator', 'Estimate savings rate from income and savings.', 'finance-savings-rate', [{ name: 'income', label: 'Income', type: 'number' }, { name: 'savings', label: 'Savings', type: 'number' }]],
  ['roi-calculator', 'ROI Calculator', 'Calculate return on investment quickly and professionally.', 'finance-roi', [{ name: 'invested', label: 'Invested amount', type: 'number' }, { name: 'returnValue', label: 'Return amount', type: 'number' }]],
  ['cagr-calculator', 'CAGR Calculator', 'Calculate compound annual growth rate for investments.', 'finance-cagr', [{ name: 'startValue', label: 'Start value', type: 'number' }, { name: 'endValue', label: 'End value', type: 'number' }, { name: 'years', label: 'Years', type: 'number' }]],
  ['mortgage-payment-calculator', 'Mortgage Payment Calculator', 'Estimate monthly mortgage payment from principal, rate, and years.', 'finance-mortgage', [{ name: 'principal', label: 'Principal', type: 'number' }, { name: 'rate', label: 'Rate %', type: 'number' }, { name: 'years', label: 'Years', type: 'number' }]],
  ['income-tax-estimator', 'Income Tax Estimator', 'Establish an estimate for total income tax quickly.', 'finance-tax', [{ name: 'income', label: 'Income', type: 'number' }, { name: 'rate', label: 'Tax rate %', type: 'number' }]],
  ['emergency-fund-calculator', 'Emergency Fund Calculator', 'Estimate emergency fund needed based on monthly expenses.', 'finance-emergency', [{ name: 'monthlyExpenses', label: 'Monthly expenses', type: 'number' }, { name: 'months', label: 'Months to cover', type: 'number' }]],
  ['credit-card-interest-calculator', 'Credit Card Interest Calculator', 'Estimate credit card interest and total payoff burden.', 'finance-credit-interest', [{ name: 'balance', label: 'Balance', type: 'number' }, { name: 'apr', label: 'APR %', type: 'number' }, { name: 'months', label: 'Months', type: 'number' }]],
  ['retirement-goal-calculator', 'Retirement Goal Calculator', 'Plan how much you need monthly to meet a retirement goal.', 'finance-retirement', [{ name: 'goal', label: 'Goal amount', type: 'number' }, { name: 'years', label: 'Years', type: 'number' }, { name: 'returnRate', label: 'Annual return %', type: 'number' }]],
  ['npv-calculator', 'NPV Calculator', 'Estimate net present value for cash flows over time.', 'finance-npv', [{ name: 'rate', label: 'Discount rate %', type: 'number' }, { name: 'cashFlow', label: 'Cash flow', type: 'number' }, { name: 'periods', label: 'Periods', type: 'number' }]],
];

const genericCalculators = [];
for (let i = 1; i <= 500; i += 1) {
  genericCalculators.push([
    `generic-calculator-${i}`,
    `Calculator ${i}`,
    'A professional utility page for quick numeric and finance-style calculations.',
    'generic',
    [
      { name: 'value1', label: 'Value 1', type: 'number' },
      { name: 'value2', label: 'Value 2', type: 'number' },
    ],
  ]);
}

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildInput(field) {
  if (field.type === 'date' || field.type === 'time') {
    return `<label><span>${field.label}</span><input type="${field.type}" name="${field.name}" /></label>`;
  }
  if (field.type === 'text') {
    return `<label><span>${field.label}</span><input type="text" name="${field.name}" /></label>`;
  }
  if (field.type === 'select') {
    const optionsMarkup = field.options.map((option) => `<option value="${option.value}">${option.label}</option>`).join('');
    return `<label><span>${field.label}</span><select name="${field.name}">${optionsMarkup}</select></label>`;
  }
  return `<label><span>${field.label}</span><input type="number" name="${field.name}" step="any" /></label>`;
}

function buildPage(config) {
  const fieldsMarkup = config.fields.map(buildInput).join('\n');
  const seoTitle = `${config.title} Online Free | Talksyra PDF Studio`;
  const seoDescription = `${config.description.replace(/\.$/, '')}. Fast, free, and mobile-friendly calculator page for quick results.`;
  const seoKeywords = `${config.title.toLowerCase()}, ${config.slug.replace(/-/g, ' ')}, online free calculator, utility tool, talksyra pdf studio`;
  const page = `<!doctype html>
<html lang="en">
  <head>  <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GZHJNRTESB"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-GZHJNRTESB');
</script>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${seoTitle}</title>
    <meta name="description" content="${seoDescription}" />
    <meta name="keywords" content="${seoKeywords}" />
    <meta property="og:title" content="${seoTitle}" />
    <meta property="og:description" content="${seoDescription}" />
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
      <h1>${config.title}</h1>
      <p>${config.description}</p>

      <section class="tool-panel">
        <form data-tool="calculator" data-calc="${config.calc}">
          ${fieldsMarkup}
          <button type="submit">Calculate</button>
        </form>
        <div class="status"></div>
        <div class="result-box" hidden></div>
      </section>
    </main>

    <script src="../script.js"></script>
  </body>
</html>`;

  fs.writeFileSync(path.join(outDir, `${config.slug}.html`), page);
}

const pages = [];

converters.forEach((group) => {
  group.groups.forEach((fromUnit, fromIndex) => {
    group.groups.forEach((toUnit, toIndex) => {
      if (fromIndex === toIndex) {
        return;
      }

      pages.push({
        slug: `${slugify(group.category)}-${slugify(fromUnit[0])}-to-${slugify(toUnit[0])}-converter`,
        title: `${group.category} Converter: ${fromUnit[0]} to ${toUnit[0]}`,
        description: `Convert ${fromUnit[0]} values into ${toUnit[0]} with a clean online utility workflow.`,
        calc: group.calc,
        fields: [
          { name: 'amount', label: 'Amount', type: 'number' },
          { name: 'fromUnit', label: 'From unit', type: 'select', options: group.groups.map((unit) => ({ value: unit[1], label: unit[0] })) },
          { name: 'toUnit', label: 'To unit', type: 'select', options: group.groups.map((unit) => ({ value: unit[1], label: unit[0] })) },
        ],
      });
    });
  });
});

financePages.forEach((entry) => {
  pages.push({
    slug: entry[0],
    title: entry[1],
    description: entry[2],
    calc: entry[3],
    fields: entry[4],
  });
});

genericCalculators.forEach((entry) => {
  pages.push({
    slug: entry[0],
    title: entry[1],
    description: entry[2],
    calc: entry[3],
    fields: entry[4],
  });
});

pages.forEach(buildPage);
console.log(`Generated ${pages.length} mass utility pages in ${outDir}`);
