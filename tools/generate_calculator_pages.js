const fs = require('fs');
const path = require('path');

const calculators = [
  { slug: 'age-calculator', title: 'Age Calculator', description: 'Find exact age from a birth date with a clean, professional workflow.', calc: 'age', fields: [{ name: 'birthDate', label: 'Birth date', type: 'date' }] },
  { slug: 'bmi-calculator', title: 'BMI Calculator', description: 'Measure body mass index and understand the result quickly.', calc: 'bmi', fields: [{ name: 'weight', label: 'Weight (kg)', type: 'number' }, { name: 'height', label: 'Height (cm)', type: 'number' }] },
  { slug: 'percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentage values like a professional utility.', calc: 'percentage', fields: [{ name: 'part', label: 'Part', type: 'number' }, { name: 'total', label: 'Total', type: 'number' }] },
  { slug: 'discount-calculator', title: 'Discount Calculator', description: 'Calculate discounted price instantly with clear output.', calc: 'discount', fields: [{ name: 'price', label: 'Original price', type: 'number' }, { name: 'discount', label: 'Discount %', type: 'number' }] },
  { slug: 'tip-calculator', title: 'Tip Calculator', description: 'Split a bill and calculate tip amount in seconds.', calc: 'tip', fields: [{ name: 'bill', label: 'Bill amount', type: 'number' }, { name: 'tip', label: 'Tip %', type: 'number' }] },
  { slug: 'simple-interest-calculator', title: 'Simple Interest Calculator', description: 'Find simple interest for any principal, rate, and time.', calc: 'simple-interest', fields: [{ name: 'principal', label: 'Principal', type: 'number' }, { name: 'rate', label: 'Rate %', type: 'number' }, { name: 'time', label: 'Time (years)', type: 'number' }] },
  { slug: 'compound-interest-calculator', title: 'Compound Interest Calculator', description: 'Estimate compound growth with a clear professional result.', calc: 'compound-interest', fields: [{ name: 'principal', label: 'Principal', type: 'number' }, { name: 'rate', label: 'Rate %', type: 'number' }, { name: 'time', label: 'Time (years)', type: 'number' }] },
  { slug: 'loan-emi-calculator', title: 'Loan EMI Calculator', description: 'Calculate an EMI estimate for your monthly loan payment.', calc: 'loan-emi', fields: [{ name: 'principal', label: 'Loan amount', type: 'number' }, { name: 'rate', label: 'Annual rate %', type: 'number' }, { name: 'months', label: 'Months', type: 'number' }] },
  { slug: 'salary-to-hourly-calculator', title: 'Salary to Hourly Calculator', description: 'Convert yearly salary into hourly pay with a clean result.', calc: 'salary-hourly', fields: [{ name: 'salary', label: 'Yearly salary', type: 'number' }, { name: 'weeks', label: 'Working weeks', type: 'number' }, { name: 'hours', label: 'Hours per week', type: 'number' }] },
  { slug: 'date-difference-calculator', title: 'Date Difference Calculator', description: 'Calculate the number of days between two dates.', calc: 'date-diff', fields: [{ name: 'startDate', label: 'Start date', type: 'date' }, { name: 'endDate', label: 'End date', type: 'date' }] },
  { slug: 'speed-calculator', title: 'Speed Calculator', description: 'Calculate speed from distance and time values.', calc: 'speed', fields: [{ name: 'distance', label: 'Distance', type: 'number' }, { name: 'time', label: 'Time (hours)', type: 'number' }] },
  { slug: 'area-rectangle-calculator', title: 'Area Rectangle Calculator', description: 'Calculate area of a rectangle quickly.', calc: 'area-rectangle', fields: [{ name: 'length', label: 'Length', type: 'number' }, { name: 'width', label: 'Width', type: 'number' }] },
  { slug: 'triangle-area-calculator', title: 'Triangle Area Calculator', description: 'Calculate triangle area from base and height.', calc: 'triangle-area', fields: [{ name: 'base', label: 'Base', type: 'number' }, { name: 'height', label: 'Height', type: 'number' }] },
  { slug: 'circle-area-calculator', title: 'Circle Area Calculator', description: 'Calculate circle area using radius.', calc: 'circle-area', fields: [{ name: 'radius', label: 'Radius', type: 'number' }] },
  { slug: 'cube-volume-calculator', title: 'Cube Volume Calculator', description: 'Calculate cube volume from side length.', calc: 'cube-volume', fields: [{ name: 'side', label: 'Side length', type: 'number' }] },
  { slug: 'cylinder-volume-calculator', title: 'Cylinder Volume Calculator', description: 'Calculate cylinder volume with a clean workflow.', calc: 'cylinder-volume', fields: [{ name: 'radius', label: 'Radius', type: 'number' }, { name: 'height', label: 'Height', type: 'number' }] },
  { slug: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Work out profit margin directly from cost and revenue.', calc: 'profit-margin', fields: [{ name: 'cost', label: 'Cost', type: 'number' }, { name: 'revenue', label: 'Revenue', type: 'number' }] },
  { slug: 'tax-calculator', title: 'Tax Calculator', description: 'Calculate tax amount and total price quickly.', calc: 'tax', fields: [{ name: 'amount', label: 'Amount', type: 'number' }, { name: 'rate', label: 'Tax %', type: 'number' }] },
  { slug: 'gst-calculator', title: 'GST Calculator', description: 'Calculate GST on any amount with professional output.', calc: 'gst', fields: [{ name: 'amount', label: 'Amount', type: 'number' }, { name: 'rate', label: 'GST %', type: 'number' }] },
  { slug: 'interest-rate-calculator', title: 'Interest Rate Calculator', description: 'Calculate interest from amount and rate values.', calc: 'interest-rate', fields: [{ name: 'amount', label: 'Amount', type: 'number' }, { name: 'rate', label: 'Rate %', type: 'number' }] },
  { slug: 'ratio-calculator', title: 'Ratio Calculator', description: 'Calculate the simplest ratio between two values.', calc: 'ratio', fields: [{ name: 'valueA', label: 'Value A', type: 'number' }, { name: 'valueB', label: 'Value B', type: 'number' }] },
  { slug: 'grade-calculator', title: 'Grade Calculator', description: 'Calculate percentage grade from marks and total marks.', calc: 'grade', fields: [{ name: 'marks', label: 'Marks obtained', type: 'number' }, { name: 'total', label: 'Total marks', type: 'number' }] },
  { slug: 'pixel-size-calculator', title: 'Pixel Size Calculator', description: 'Estimate physical size from pixel dimensions and DPI.', calc: 'pixel-size', fields: [{ name: 'widthPx', label: 'Width (px)', type: 'number' }, { name: 'heightPx', label: 'Height (px)', type: 'number' }, { name: 'dpi', label: 'DPI', type: 'number' }] },
  { slug: 'work-hours-calculator', title: 'Work Hours Calculator', description: 'Compute work hours from start and end time.', calc: 'work-hours', fields: [{ name: 'startTime', label: 'Start time', type: 'time' }, { name: 'endTime', label: 'End time', type: 'time' }] },
  { slug: 'fuel-cost-calculator', title: 'Fuel Cost Calculator', description: 'Estimate fuel cost from distance and mileage.', calc: 'fuel-cost', fields: [{ name: 'distance', label: 'Distance', type: 'number' }, { name: 'mileage', label: 'Mileage (km/l)', type: 'number' }, { name: 'price', label: 'Fuel price', type: 'number' }] },
  { slug: 'weight-converter', title: 'Weight Converter', description: 'Convert kilograms into pounds and grams.', calc: 'weight-convert', fields: [{ name: 'kg', label: 'Kilograms', type: 'number' }] },
  { slug: 'length-converter', title: 'Length Converter', description: 'Convert meters into feet and inches.', calc: 'length-convert', fields: [{ name: 'meters', label: 'Meters', type: 'number' }] },
  { slug: 'temperature-converter', title: 'Temperature Converter', description: 'Convert Celsius into Fahrenheit and Kelvin.', calc: 'temperature-convert', fields: [{ name: 'celsius', label: 'Celsius', type: 'number' }] },
  { slug: 'data-size-calculator', title: 'Data Size Calculator', description: 'Convert between MB, GB, and TB values.', calc: 'data-size', fields: [{ name: 'mb', label: 'MB', type: 'number' }] },
  { slug: 'daily-budget-calculator', title: 'Daily Budget Calculator', description: 'Split a monthly budget into daily spending budget.', calc: 'daily-budget', fields: [{ name: 'budget', label: 'Monthly budget', type: 'number' }, { name: 'days', label: 'Days in month', type: 'number' }] },
  { slug: 'unit-price-calculator', title: 'Unit Price Calculator', description: 'Find unit price from total price and quantity.', calc: 'unit-price', fields: [{ name: 'price', label: 'Total price', type: 'number' }, { name: 'quantity', label: 'Quantity', type: 'number' }] },
  { slug: 'savings-goal-calculator', title: 'Savings Goal Calculator', description: 'Estimate monthly savings needed to reach a target amount.', calc: 'savings-goal', fields: [{ name: 'goal', label: 'Goal amount', type: 'number' }, { name: 'months', label: 'Months', type: 'number' }] },
  { slug: 'break-even-calculator', title: 'Break Even Calculator', description: 'Calculate the break-even point from fixed cost and contribution.', calc: 'break-even', fields: [{ name: 'fixedCost', label: 'Fixed cost', type: 'number' }, { name: 'contribution', label: 'Contribution per unit', type: 'number' }] },
  { slug: 'net-pay-calculator', title: 'Net Pay Calculator', description: 'Estimate take-home pay from gross pay and deductions.', calc: 'net-pay', fields: [{ name: 'gross', label: 'Gross pay', type: 'number' }, { name: 'deductions', label: 'Deductions', type: 'number' }] },
  { slug: 'co2-footprint-calculator', title: 'CO2 Footprint Calculator', description: 'Estimate footprint from distance and fuel usage.', calc: 'co2-footprint', fields: [{ name: 'distance', label: 'Distance (km)', type: 'number' }, { name: 'fuel', label: 'Fuel used (liters)', type: 'number' }] },
  { slug: 'heart-rate-zone-calculator', title: 'Heart Rate Zone Calculator', description: 'Estimate a target heart zone from age and resting heart rate.', calc: 'heart-rate-zone', fields: [{ name: 'age', label: 'Age', type: 'number' }, { name: 'resting', label: 'Resting HR', type: 'number' }] },
  { slug: 'credit-card-payoff-calculator', title: 'Credit Card Payoff Calculator', description: 'Estimate payoff time from balance and monthly payment.', calc: 'credit-payoff', fields: [{ name: 'balance', label: 'Balance', type: 'number' }, { name: 'payment', label: 'Monthly payment', type: 'number' }] },
  { slug: 'sleep-calculator', title: 'Sleep Calculator', description: 'Estimate bedtime based on wake-up time and sleep cycle duration.', calc: 'sleep', fields: [{ name: 'wakeTime', label: 'Wake time', type: 'time' }, { name: 'cycles', label: 'Sleep cycles', type: 'number' }] },
  { slug: 'math-average-calculator', title: 'Average Calculator', description: 'Calculate mean value from multiple numbers easily.', calc: 'average', fields: [{ name: 'numbers', label: 'Numbers (comma separated)', type: 'text' }] },
  { slug: 'math-sum-calculator', title: 'Sum Calculator', description: 'Add multiple values and get the total quickly.', calc: 'sum', fields: [{ name: 'numbers', label: 'Numbers (comma separated)', type: 'text' }] },
  { slug: 'math-product-calculator', title: 'Product Calculator', description: 'Multiply multiple values and get a precise result.', calc: 'product', fields: [{ name: 'numbers', label: 'Numbers (comma separated)', type: 'text' }] },
  { slug: 'math-square-root-calculator', title: 'Square Root Calculator', description: 'Compute square root of any number instantly.', calc: 'square-root', fields: [{ name: 'value', label: 'Value', type: 'number' }] },
  { slug: 'math-power-calculator', title: 'Power Calculator', description: 'Calculate power using base and exponent values.', calc: 'power', fields: [{ name: 'base', label: 'Base', type: 'number' }, { name: 'exponent', label: 'Exponent', type: 'number' }] },
  { slug: 'math-log-calculator', title: 'Log Calculator', description: 'Estimate logarithm value of a number easily.', calc: 'log', fields: [{ name: 'value', label: 'Value', type: 'number' }] },
  { slug: 'math-pi-calculator', title: 'Pi Calculator', description: 'Use pi for circumference and area-style math calculations.', calc: 'pi', fields: [{ name: 'value', label: 'Value', type: 'number' }] },
  { slug: 'currency-converter', title: 'Currency Converter', description: 'Convert USD into INR and other common currencies quickly.', calc: 'currency', fields: [{ name: 'amount', label: 'Amount', type: 'number' }, { name: 'currency', label: 'Currency', type: 'text' }] },
  { slug: 'calculator-1', title: 'Calculator 1', description: 'A professional utility page for common quick calculation workflows.', calc: 'generic', fields: [{ name: 'value1', label: 'Value 1', type: 'number' }, { name: 'value2', label: 'Value 2', type: 'number' }] },
  { slug: 'calculator-2', title: 'Calculator 2', description: 'A professional utility page for quick formal calculations.', calc: 'generic', fields: [{ name: 'value1', label: 'Value 1', type: 'number' }, { name: 'value2', label: 'Value 2', type: 'number' }] },
  { slug: 'calculator-3', title: 'Calculator 3', description: 'A professional utility page for quick numeric operations.', calc: 'generic', fields: [{ name: 'value1', label: 'Value 1', type: 'number' }, { name: 'value2', label: 'Value 2', type: 'number' }] },
  { slug: 'calculator-4', title: 'Calculator 4', description: 'A professional utility page for quick numeric operations.', calc: 'generic', fields: [{ name: 'value1', label: 'Value 1', type: 'number' }, { name: 'value2', label: 'Value 2', type: 'number' }] },
  { slug: 'calculator-5', title: 'Calculator 5', description: 'A professional utility page for quick numeric operations.', calc: 'generic', fields: [{ name: 'value1', label: 'Value 1', type: 'number' }, { name: 'value2', label: 'Value 2', type: 'number' }] },
  { slug: 'calculator-6', title: 'Calculator 6', description: 'A professional utility page for quick numeric operations.', calc: 'generic', fields: [{ name: 'value1', label: 'Value 1', type: 'number' }, { name: 'value2', label: 'Value 2', type: 'number' }] },
  { slug: 'calculator-7', title: 'Calculator 7', description: 'A professional utility page for quick numeric operations.', calc: 'generic', fields: [{ name: 'value1', label: 'Value 1', type: 'number' }, { name: 'value2', label: 'Value 2', type: 'number' }] },
  { slug: 'calculator-8', title: 'Calculator 8', description: 'A professional utility page for quick numeric operations.', calc: 'generic', fields: [{ name: 'value1', label: 'Value 1', type: 'number' }, { name: 'value2', label: 'Value 2', type: 'number' }] },
];

function buildInput(field) {
  if (field.type === 'date' || field.type === 'time') {
    return `<label><span>${field.label}</span><input type="${field.type}" name="${field.name}" /></label>`;
  }

  if (field.type === 'text') {
    return `<label><span>${field.label}</span><input type="text" name="${field.name}" /></label>`;
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

  fs.writeFileSync(path.join(__dirname, `${config.slug}.html`), page);
}

calculators.forEach(buildPage);

console.log(`Generated ${calculators.length} calculator pages in ${__dirname}`);
