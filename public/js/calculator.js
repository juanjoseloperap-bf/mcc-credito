// Tabs de la calculadora
document.querySelectorAll('.calc-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.calc-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    document.querySelectorAll('.calc-form').forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

function calcMortgage(principal, annualRatePct, years) {
  const months = years * 12;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return { monthly: principal / months, totalPaid: principal, totalInterest: 0 };
  const monthly = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return { monthly, totalPaid: monthly * months, totalInterest: monthly * months - principal };
}

function calcROI(propertyValue, monthlyRent, annualExpensesPct, years) {
  const annualRent = monthlyRent * 12;
  const annualExpenses = propertyValue * (annualExpensesPct / 100);
  const annualNetIncome = annualRent - annualExpenses;
  const totalReturn = annualNetIncome * years;
  return {
    annualNetIncome,
    totalReturn,
    roiPct: (totalReturn / propertyValue) * 100,
    capRate: (annualNetIncome / propertyValue) * 100
  };
}

function fmt(n) {
  return n.toLocaleString('es-MX', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function fmtPct(n) { return n.toFixed(2) + '%'; }

function updateResult(mainValue, items) {
  document.querySelector('.result-amount').textContent = mainValue;
  document.querySelector('.result-breakdown').innerHTML = items
    .map(i => `<div class="breakdown-item"><span>${i.label}</span><span>${i.value}</span></div>`)
    .join('');
}

document.getElementById('calc-mortgage-btn').addEventListener('click', () => {
  const principal = Number(document.getElementById('m-principal').value);
  const rate = Number(document.getElementById('m-rate').value);
  const years = Number(document.getElementById('m-years').value);
  if (!principal || principal <= 0 || !rate || rate <= 0 || !years || years <= 0) {
    updateResult('—', [{ label: 'Ingresa valores válidos.', value: '' }]);
    return;
  }
  const { monthly, totalPaid, totalInterest } = calcMortgage(principal, rate, years);
  updateResult(fmt(monthly), [
    { label: 'Monto financiado', value: fmt(principal) },
    { label: `Total pagado (${years} años)`, value: fmt(totalPaid) },
    { label: 'Total en intereses', value: fmt(totalInterest) },
    { label: 'Tasa mensual', value: fmtPct(rate / 12) }
  ]);
});

document.getElementById('calc-roi-btn').addEventListener('click', () => {
  const value = Number(document.getElementById('r-value').value);
  const rent = Number(document.getElementById('r-rent').value);
  const expenses = Number(document.getElementById('r-expenses').value);
  const years = Number(document.getElementById('r-years').value);
  if (!value || value <= 0 || !rent || rent <= 0 || !years || years <= 0) {
    updateResult('—', [{ label: 'Ingresa valores válidos.', value: '' }]);
    return;
  }
  const { annualNetIncome, totalReturn, roiPct, capRate } = calcROI(value, rent, expenses || 0, years);
  updateResult(fmtPct(roiPct), [
    { label: 'Ingreso neto anual', value: fmt(annualNetIncome) },
    { label: `Retorno total (${years} años)`, value: fmt(totalReturn) },
    { label: 'Cap Rate', value: fmtPct(capRate) },
    { label: 'Renta bruta anual', value: fmt(rent * 12) }
  ]);
});
