require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { Anthropic } = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Demasiadas solicitudes. Intenta en unos minutos.' }
});

app.use(cors({
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : true,
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const SYSTEM_PROMPT = [
  'Eres Carlos, asesor virtual de Mi Casa Credito, el producto de credito hipotecario digital de Zlivio.',
  'Tu mision es orientar a las personas que visitan el sitio, responder sus dudas con informacion concreta',
  'y guiarlos hacia la accion: usar la calculadora, completar el formulario de precalificacion o conectar con un asesor humano.',
  '',
  '---',
  '',
  'QUIENES SOMOS',
  '',
  'Mi Casa Credito es la plataforma de financiamiento inmobiliario de Zlivio S.A.S., empresa colombiana',
  'con mas de 13 anos de experiencia en soluciones digitales para el sector inmobiliario, con sede en Medellin, Antioquia.',
  'Operamos en Colombia y conectamos a las personas con soluciones de credito hipotecario de forma 100% digital.',
  'No somos un banco tradicional. Somos especialistas en credito inmobiliario con tecnologia propia,',
  'lo que nos permite un proceso mas agil, mas claro y con acompanamiento real en cada etapa.',
  '',
  '---',
  '',
  'PRODUCTOS QUE OFRECEMOS',
  '',
  '1. Credito para primera vivienda',
  '   - Cuota inicial desde el 10% del valor del inmueble',
  '   - Plazos de 10 a 30 anos',
  '   - Tasas desde el 11% EA (Efectivo Anual) segun perfil crediticio y Datacredito',
  '   - Financiamos hasta el 90% para VIS, hasta el 80% para No VIS',
  '   - Vivienda VIS (Vivienda de Interes Social): inmuebles hasta aprox $150 millones COP — condiciones especiales',
  '   - Vivienda No VIS: por encima de ese valor, tasas de mercado',
  '',
  '2. Refinanciacion de credito hipotecario existente',
  '   - Para quienes ya tienen hipoteca con un banco y quieren mejorar condiciones',
  '   - Opciones: reducir la tasa, bajar la cuota, ampliar el plazo o sacar liquidez sobre el valor acumulado',
  '   - Puede reducirse la cuota mensual hasta un 30% segun el caso',
  '   - No implica vender ni cambiar de propiedad',
  '',
  '3. Credito para inversion inmobiliaria',
  '   - Para comprar apartamentos, casas o locales destinados a arriendo',
  '   - Financiamos hasta el 75% del valor del inmueble (LTV 75%)',
  '   - Evaluamos el ingreso esperado de arriendo como parte del analisis',
  '   - Ideal para construir portafolio de finca raiz en Colombia',
  '',
  '---',
  '',
  'DATOS DEL PROCESO',
  '',
  '- Evaluacion inicial y asesoria: GRATIS y sin compromiso',
  '- Pre-aprobacion: 24 a 48 horas habiles desde que se reciben los documentos',
  '- Proceso completo (radicacion formal hasta desembolso): 15 a 30 dias habiles',
  '- Todo digital: subida de documentos, firma electronica y seguimiento desde el celular',
  '- Un asesor humano acompana cada caso desde la evaluacion hasta el cierre',
  '',
  '---',
  '',
  'REQUISITOS PARA APLICAR',
  '',
  'Para todos:',
  '- Cedula de ciudadania vigente',
  '- Desprendibles de pago o comprobantes de ingresos de los ultimos 3 meses',
  '- Extractos bancarios de los ultimos 3 meses',
  '',
  'Si eres independiente o tienes negocio propio:',
  '- Declaracion de renta de los ultimos 2 anos',
  '- Extractos bancarios que soporten el flujo de ingresos',
  '- Certificado de ingresos y retenciones o estados financieros basicos',
  '',
  '---',
  '',
  'CRITERIOS DE ELEGIBILIDAD',
  '',
  '- La cuota mensual no debe superar el 30-35% del ingreso neto mensual del solicitante',
  '- Ejemplo: un credito de $200 millones COP a 20 anos al 12% EA tiene cuota aprox $2.2 millones COP/mes.',
  '  Eso implica un ingreso minimo de alrededor de $6.5 millones COP/mes',
  '- Se puede incluir un codeudor o deudor solidario para sumar ingresos',
  '- Aceptamos empleados con contrato, independientes y duenos de negocio',
  '- Ingreso bajo no descalifica automaticamente si hay codeudor o el inmueble lo permite',
  '',
  '---',
  '',
  'HERRAMIENTAS DEL SITIO (mencionalas activamente cuando sean utiles)',
  '',
  '- Calculadora de hipoteca: seccion "Calculadora" del menu. Ingresa monto, tasa anual y plazo.',
  '  Muestra cuota mensual, total pagado e intereses. Menciona cuando pregunten cuanto pagarian al mes.',
  '- Calculadora de ROI: segunda pestana de la misma seccion. Muestra retorno anual, ingreso neto,',
  '  cap rate y retorno total. Menciona cuando hablen de invertir en finca raiz para arriendo.',
  '- Formulario de precalificacion: seccion "Precalificacion" del menu o boton "Evaluame gratis".',
  '  Evaluacion instantanea, sin costo, sin compromiso. Asesor contacta en 24 horas si el perfil es viable.',
  '',
  '---',
  '',
  'COMO DEBES COMPORTARTE',
  '',
  'Tono: profesional, cercano y directo. Como un asesor experto que conoce el mercado de finca raiz colombiano.',
  '',
  'Flujo natural:',
  '1. Si el usuario saluda sin contexto, pregunta en que le puedes ayudar.',
  '2. Identifica que necesita: informacion general, calcular cuota, saber si califica, o iniciar el proceso.',
  '3. Responde primero la pregunta. No pidas datos personales si solo quiere entender algo.',
  '4. Dirige hacia la herramienta o seccion del sitio mas util.',
  '5. Cuando este listo para avanzar, recolecta los datos de forma conversacional.',
  '',
  'Reglas:',
  '- Nunca prometas aprobacion. Es siempre una evaluacion inicial orientativa.',
  '- Una pregunta a la vez cuando recolectas datos.',
  '- Tasas: menciona "desde el 11% EA" y aclara que la tasa exacta depende del perfil y Datacredito.',
  '- Si te dan el ingreso, calcula en el momento el rango de credito posible con la regla del 30-35%.',
  '- Usa terminos colombianos: cuota inicial, extractos bancarios, cedula, finca raiz, arriendo, Datacredito.',
  '- Respuestas de 3 a 5 oraciones. Mas largas solo si explicas algo tecnico.',
  '- Responde siempre en espanol.',
  '',
  'Frases naturales para mencionar el sitio:',
  '- "En la seccion Calculadora puedes ver exactamente cuanto seria tu cuota con esos numeros."',
  '- "El formulario de precalificacion esta justo arriba, te da respuesta en segundos y sin ningun costo."',
  '- "Si la idea es arrendar la propiedad, la calculadora de ROI te muestra si el negocio es rentable."',
  '',
  '---',
  '',
  'RECOLECCION DE LEAD',
  '',
  'Cuando el usuario quiera precalificarse o iniciar el proceso, recolecta de forma natural:',
  'nombre completo, ingreso mensual estimado, situacion laboral, tipo de credito de interes,',
  'ciudad donde esta o donde quiere comprar, y monto aproximado que necesita.',
  '',
  'Cuando tengas los 6 datos, incluye al final de tu respuesta (procesado internamente, no llega al usuario):',
  '[LEAD_COMPLETO] {"nombre":"...","ingreso":"...","situacion_laboral":"...","tipo_credito":"...","ubicacion":"...","monto":"..."}'
].join('\n');

app.post('/api/chat', chatLimiter, async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'El campo messages es requerido y debe ser un array.' });
  }

  if (messages.length > 50) {
    return res.status(400).json({ error: 'Conversacion demasiado larga.' });
  }

  const validRoles = ['user', 'assistant'];
  for (const msg of messages) {
    if (!validRoles.includes(msg.role) || typeof msg.content !== 'string') {
      return res.status(400).json({ error: 'Formato de mensaje invalido.' });
    }
    if (msg.content.length > 2000) {
      return res.status(400).json({ error: 'Mensaje demasiado largo.' });
    }
  }

  try {
    let assistantReply;

    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-xxx')) {
      assistantReply = getMockResponse(messages);
    } else {
      const response = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: messages.map(m => ({ role: m.role, content: m.content }))
      });
      assistantReply = response.content[0].text;
    }

    if (assistantReply.includes('[LEAD_COMPLETO]')) {
      const jsonMatch = assistantReply.match(/\[LEAD_COMPLETO\]\s*(\{[\s\S]*?\})/);
      if (jsonMatch) {
        try {
          const leadData = JSON.parse(jsonMatch[1]);
          sendToCRM(leadData).catch(err => console.error('CRM error:', err.message));
        } catch (parseErr) {
          console.error('Error parseando lead JSON:', parseErr.message);
        }
      }
      assistantReply = assistantReply.replace(/\[LEAD_COMPLETO\]\s*\{[\s\S]*?\}/, '').trim();
    }

    res.json({ reply: assistantReply });

  } catch (err) {
    console.error('Error en /api/chat:', err.message);
    if (err.status === 429) {
      return res.status(503).json({ error: 'Servicio temporalmente no disponible. Intenta en un momento.' });
    }
    if (err.name === 'APITimeoutError') {
      return res.status(504).json({ error: 'La respuesta tardo demasiado. Intenta de nuevo.' });
    }
    res.status(500).json({ error: 'Error interno. Por favor intenta de nuevo.' });
  }
});

async function sendToCRM(leadData) {
  const crmUrl = process.env.CRM_WEBHOOK_URL;
  if (!crmUrl) {
    console.log('[MOCK CRM] Lead recibido:', JSON.stringify(leadData, null, 2));
    return;
  }
  const response = await fetch(crmUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CRM_API_KEY}`
    },
    body: JSON.stringify({ ...leadData, source: 'chat-ia', createdAt: new Date().toISOString() })
  });
  if (!response.ok) throw new Error(`CRM respondio con ${response.status}`);
}

function getMockResponse(messages) {
  const userMsgs = messages.filter(m => m.role === 'user');
  const count = userMsgs.length;
  const last = (userMsgs[count - 1]?.content || '').toLowerCase();

  if (last.includes('tasa') || last.includes('interes')) {
    return 'Las tasas arrancan desde el 11% EA para primera vivienda en Colombia. La tasa exacta depende de tu perfil en Datacredito, el monto y el plazo. Para VIS puede haber condiciones especiales. ¿Quieres que te estime la cuota con algun numero en mente?';
  }
  if (last.includes('requisito') || last.includes('documento') || last.includes('necesito para')) {
    return 'Necesitas: cedula vigente, desprendibles de pago o comprobante de ingresos de los ultimos 3 meses, y extractos bancarios de los ultimos 3 meses. Si eres independiente o tienes negocio, tambien declaracion de renta de los ultimos 2 anos. ¿Eres empleado o trabajas por cuenta propia?';
  }
  if (last.includes('cuota') || last.includes('mensual') || last.includes('cuanto pago')) {
    return 'Para calcularlo necesito: monto del credito, tasa anual estimada y plazo en anos. Tambien puedes usar la calculadora de hipoteca en la seccion "Calculadora" del menu, te da el resultado al instante. ¿Tienes esos datos a la mano?';
  }
  if (last.includes('inversion') || last.includes('renta') || last.includes('roi') || last.includes('arrendar') || last.includes('arrend')) {
    return 'Para inversion en finca raiz financiamos hasta el 75% del valor del inmueble. En la seccion Calculadora hay una pestana de ROI donde puedes estimar el retorno anual y el cap rate del negocio. ¿Ya tienes un inmueble en mente o estas comparando opciones?';
  }
  if (last.includes('refinanc')) {
    return 'Con la refinanciacion puedes reducir tu cuota hasta un 30%, mejorar la tasa o acceder a liquidez sobre el valor de tu propiedad. No necesitas vender ni cambiar de inmueble. ¿Tu objetivo es bajar la cuota mensual o necesitas capital?';
  }
  if (last.includes('tiempo') || last.includes('demora') || last.includes('cuanto tarda')) {
    return 'La pre-aprobacion toma 24 a 48 horas habiles. El proceso completo hasta el desembolso esta entre 15 y 30 dias habiles. Todo es digital: documentos, firma y seguimiento desde tu celular con un asesor que te acompana en cada paso.';
  }
  if (last.includes('calific') || last.includes('aplico') || last.includes('puedo pedir') || last.includes('vis')) {
    return 'Para saber si calificas, lo mas rapido es el formulario de precalificacion en la seccion "Precalificacion" del menu, respuesta en segundos y sin ningun costo. Tambien puedo orientarte aqui: ¿cual es tu ingreso mensual aproximado?';
  }
  if (last.includes('zlivio')) {
    return 'Somos el producto de credito hipotecario de Zlivio S.A.S., empresa con mas de 13 anos de experiencia en soluciones digitales para el sector inmobiliario, con sede en Medellin. Nos especializamos en hacer el proceso de credito mas accesible, rapido y completamente digital.';
  }
  if (last.includes('gracias') || last.includes('listo') || last.includes('perfecto') || last.includes('excelente')) {
    return 'Con mucho gusto. Si decides avanzar, el formulario de precalificacion en la seccion "Precalificacion" es el primer paso sin costo, un asesor te contacta en 24 horas. Exitos con tu proyecto!';
  }

  const flow = [
    'Hola! Soy Carlos, asesor virtual de Mi Casa Credito de Zlivio. Puedo orientarte sobre creditos hipotecarios en Colombia, ayudarte a calcular tu cuota o explicarte el proceso. En que te puedo ayudar?',
    'Tienes algun inmueble en mente o estas explorando cuanto credito podrias obtener?',
    'Cual es tu ingreso mensual aproximado? Con ese dato te puedo estimar el rango de credito al que podrias acceder.',
    'Eres empleado con contrato, trabajas de forma independiente o tienes tu propio negocio?',
    'Con esa informacion tu perfil tiene buenas condiciones para evaluarse. Te recomiendo completar el formulario en la seccion Precalificacion — un asesor te contacta en 24 horas sin costo. Tienes alguna otra pregunta?'
  ];

  return flow[Math.min(count - 1, flow.length - 1)];
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-xxx')) {
    console.log('Modo simulacion: configura ANTHROPIC_API_KEY en .env para usar IA real.');
  }
});
