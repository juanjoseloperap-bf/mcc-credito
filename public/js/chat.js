// Widget de chat IA — Parte 2 integrada al sitio
// URL relativa: funciona en localhost y en Railway sin cambios.

const BACKEND_URL = '/api/chat';

const chatToggle  = document.getElementById('chat-toggle');
const chatPanel   = document.getElementById('chat-panel');
const chatClose   = document.getElementById('chat-close');
const chatInput   = document.getElementById('chat-input');
const chatSend    = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');
const chatCount   = document.getElementById('chat-count');

let conversationHistory = [];
let userName = null;
let backendAvailable = null; // null = no verificado aún

// Expuesto globalmente para que precalificacion.js pueda pasarlo
window.chatSetUserName = function(name) {
  userName = name;
};

// Abrir/cerrar panel
chatToggle.addEventListener('click', () => {
  const isOpen = chatPanel.classList.toggle('open');
  chatToggle.setAttribute('aria-expanded', isOpen);
  chatPanel.setAttribute('aria-hidden', !isOpen);
  if (isOpen) {
    chatCount.style.display = 'none';
    chatInput.focus();
    if (conversationHistory.length === 0) addBotMessage(getWelcome());
  }
});

chatClose.addEventListener('click', () => {
  chatPanel.classList.remove('open');
  chatToggle.setAttribute('aria-expanded', 'false');
  chatPanel.setAttribute('aria-hidden', 'true');
});

// Enviar mensaje
async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = '';
  chatSend.disabled = true;
  addUserMessage(text);
  conversationHistory.push({ role: 'user', content: text });

  const typingEl = addTyping();

  try {
    let reply;
    if (backendAvailable === null) {
      backendAvailable = await checkBackend();
    }
    if (backendAvailable) {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
        signal: AbortSignal.timeout(12000)
      });
      if (!res.ok) throw new Error('backend_error');
      const data = await res.json();
      reply = data.reply;
    } else {
      reply = await simulateResponse(conversationHistory);
    }

    conversationHistory.push({ role: 'assistant', content: reply });
    typingEl.remove();
    addBotMessage(reply);
  } catch (err) {
    typingEl.remove();
    if (err.name === 'TimeoutError') {
      conversationHistory.pop();
      addBotMessage('La respuesta tardó demasiado. ¿Puedes intentar de nuevo?');
    } else {
      addBotMessage('Hubo un problema de conexión. Intenta en un momento.');
    }
  } finally {
    chatSend.disabled = false;
    chatInput.focus();
  }
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

// DOM helpers
function addBotMessage(text) {
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function addUserMessage(text) {
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTyping() {
  const div = document.createElement('div');
  div.className = 'chat-msg typing';
  div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function getWelcome() {
  const greeting = userName ? `Hola ${userName.split(' ')[0]}` : 'Hola';
  return `${greeting}, soy el asesor virtual de Mi Casa Crédito. Estoy aquí para orientarte sobre opciones de crédito hipotecario. ¿En qué te puedo ayudar?`;
}

// Verificar si el backend está disponible
async function checkBackend() {
  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'ping' }] }),
      signal: AbortSignal.timeout(2000)
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Simulación de respuestas cuando no hay backend activo
async function simulateResponse(history) {
  await new Promise(r => setTimeout(r, 700 + Math.random() * 500));
  const userMessages = history.filter(m => m.role === 'user');
  const count = userMessages.length;
  const last = userMessages[count - 1]?.content.toLowerCase() || '';

  if (last.includes('tasa') || last.includes('interés') || last.includes('interes')) {
    return 'Las tasas arrancan desde el 5.9% anual para primera vivienda. La tasa exacta depende de tu perfil crediticio, el monto y el plazo. ¿Quieres que te estime la cuota mensual con algún número en mente?';
  }
  if (last.includes('requisito') || last.includes('documento') || last.includes('necesito para')) {
    return 'Necesitas: identificación vigente, comprobante de ingresos de los últimos 3 meses y estados de cuenta bancarios. Si eres independiente o tienes negocio propio, también declaración de renta de los últimos 2 años. ¿Eres empleado o trabajas por cuenta propia?';
  }
  if (last.includes('cuota') || last.includes('mensual') || last.includes('cuánto pago') || last.includes('cuanto pago')) {
    return 'Para calcular la cuota necesito: monto del crédito, tasa anual estimada y plazo en años. También puedes usar la calculadora de hipoteca en la sección "Calculadora" del menú — te da el resultado al instante. ¿Tienes esos datos a la mano?';
  }
  if (last.includes('inversion') || last.includes('inversión') || last.includes('renta') || last.includes('roi') || last.includes('arrendar')) {
    return 'Para inversión en propiedad de renta financiamos hasta el 75% del valor del inmueble. En la sección Calculadora hay una pestaña de ROI donde puedes estimar el retorno anual y el cap rate. ¿Ya tienes un inmueble en mente o estás comparando opciones?';
  }
  if (last.includes('refinanc')) {
    return 'Con el refinanciamiento puedes reducir tu cuota hasta un 30%, mejorar la tasa o acceder a liquidez sobre el valor de tu propiedad. ¿Tu objetivo principal es bajar la cuota mensual o necesitas capital?';
  }
  if (last.includes('tiempo') || last.includes('demora') || last.includes('cuánto tarda') || last.includes('cuanto tarda')) {
    return 'La pre-aprobación inicial toma 24 a 48 horas. El proceso completo hasta el desembolso está entre 15 y 30 días hábiles. Todo es digital: documentos, firma y seguimiento desde tu celular.';
  }
  if (last.includes('calific') || last.includes('aplico') || last.includes('puedo pedir')) {
    return 'Para saber si calificas, lo más rápido es el formulario de precalificación en la sección "Precalificación" del menú — respuesta en segundos, sin costo. También puedo orientarte aquí: ¿cuál sería tu ingreso mensual aproximado?';
  }
  if (last.includes('gracias') || last.includes('listo') || last.includes('perfecto') || last.includes('excelente')) {
    return 'Con mucho gusto. Si decides avanzar, el formulario de precalificación en la sección "Precalificación" es el primer paso — un asesor te contacta en 24 horas. ¡Éxitos!';
  }

  const flow = [
    '¡Hola! Soy Carlos, asesor virtual de Mi Casa Crédito. Puedo orientarte sobre créditos hipotecarios, ayudarte a calcular tu cuota o explicarte el proceso. ¿En qué te puedo ayudar?',
    '¿Tienes alguna propiedad en mente o estás evaluando cuánto crédito podrías obtener?',
    '¿Cuál es tu ingreso mensual aproximado? Con ese dato te puedo estimar el rango de crédito al que podrías acceder.',
    '¿Eres empleado formal, trabajas de forma independiente o tienes tu propio negocio?',
    'Con esa información tu perfil tiene buenas condiciones para evaluarse. Te recomiendo completar el formulario en la sección "Precalificación" — un asesor te contacta en 24 horas sin costo. ¿Tienes alguna otra pregunta?'
  ];

  return flow[Math.min(count - 1, flow.length - 1)];
}
