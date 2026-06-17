// Lógica del formulario de precalificación — Parte 1 integrada
const precalForm = document.getElementById('precal-form');
const eligibilityResult = document.getElementById('eligibility-result');

function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidPhone(v) { return /^[0-9+()\-\s]{7,20}$/.test(v); }

function validatePrecalField(id) {
  const el = document.getElementById(id);
  const wrapper = el.closest('.field');
  const errorEl = wrapper.querySelector('.field-error');

  const validators = {
    'p-name':       { fn: v => v.trim().length >= 2, msg: 'Nombre muy corto.' },
    'p-email':      { fn: v => isValidEmail(v.trim()), msg: 'Email inválido.' },
    'p-phone':      { fn: v => isValidPhone(v.trim()), msg: 'Teléfono inválido.' },
    'p-income':     { fn: v => Number(v) > 0, msg: 'Ingresa un ingreso válido.' },
    'p-employment': { fn: v => v !== '', msg: 'Selecciona una opción.' },
    'p-interest':   { fn: v => v !== '', msg: 'Selecciona un tipo.' },
  };

  const rule = validators[id];
  if (!rule) return true;

  if (!rule.fn(el.value)) {
    wrapper.classList.add('has-error');
    if (errorEl) errorEl.textContent = rule.msg;
    return false;
  }
  wrapper.classList.remove('has-error');
  return true;
}

['p-name','p-email','p-phone','p-income','p-employment','p-interest'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('blur', () => validatePrecalField(id));
  el.addEventListener('input', () => {
    if (el.closest('.field').classList.contains('has-error')) validatePrecalField(id);
  });
});

// Califica el perfil — misma lógica corregida de la Parte 1
function calculateEligibility(lead) {
  let score = 0;
  if (lead.income > 5000) score += 40;
  else if (lead.income > 2500) score += 20;

  if (lead.employment === 'employee') score += 25;   // FIX: === no =
  if (lead.employment === 'business-owner') score += 20;
  if (lead.employment === 'self-employed') score += 15;

  if (lead.interest === 'investment') score += 10;
  if (lead.interest === 'purchase') score += 5;

  return score;
}

precalForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const fields = ['p-name','p-email','p-phone','p-income','p-employment','p-interest'];
  const allValid = fields.map(id => validatePrecalField(id)).every(Boolean);

  if (!allValid) {
    eligibilityResult.className = 'eligibility-result error-msg';
    eligibilityResult.textContent = 'Por favor revisa los campos marcados antes de continuar.';
    return;
  }

  const lead = {
    name:       document.getElementById('p-name').value.trim(),
    email:      document.getElementById('p-email').value.trim(),
    phone:      document.getElementById('p-phone').value.trim(),
    income:     Number(document.getElementById('p-income').value),  // FIX: valor numérico, no el elemento DOM
    employment: document.getElementById('p-employment').value,
    interest:   document.getElementById('p-interest').value,
  };

  const score = calculateEligibility(lead);

  // Guardar en localStorage (como hacía el original, pero ahora con datos correctos)
  localStorage.setItem('mcc_lead', JSON.stringify({ ...lead, score, createdAt: new Date().toISOString() }));

  if (score >= 55) {
    eligibilityResult.className = 'eligibility-result eligible';
    eligibilityResult.textContent = '¡Tu perfil luce bien! Un asesor te contactará en las próximas 24 horas para continuar el proceso.';
  } else {
    eligibilityResult.className = 'eligibility-result review';
    eligibilityResult.textContent = 'Gracias por tu información. Necesitamos revisar algunos detalles contigo — un asesor se pondrá en contacto.';
  }

  // Pasar el nombre al chat si está disponible
  if (window.chatSetUserName) window.chatSetUserName(lead.name);
});
