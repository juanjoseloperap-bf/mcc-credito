# Arquitectura de la integración IA — Parte 2

El agente se llama **Carlos** y vive como un widget de chat en la esquina del sitio. Su función es orientar al usuario, responder dudas sobre crédito hipotecario colombiano y, cuando el usuario está listo, recolectar sus datos para enviárselos al equipo.

---

## Cómo está montado

El sitio corre en un solo servidor en Railway. El frontend y el backend comparten el mismo dominio, lo que simplifica la seguridad y elimina problemas de CORS en producción.

```
Usuario (navegador)
    ↓ escribe un mensaje
chat.js → POST /api/chat
    ↓ llega al servidor
server.js → valida el mensaje → llama a la API de Anthropic
    ↓ recibe respuesta
Detecta si hay datos completos del lead → si los hay, los envía al CRM en segundo plano
    ↓ limpia la respuesta
Devuelve solo el texto al usuario
```

---

## El agente IA

Uso **Claude Haiku** de Anthropic — el modelo más económico de la familia, suficiente para una conversación de asesoría. Tiene un system prompt detallado con el contexto real de Mi Casa Crédito: tasas, productos, requisitos, plazos y cómo manejar cada tipo de usuario.

Cuando el agente considera que ya tiene toda la información necesaria del usuario (nombre, ingreso, situación laboral, tipo de crédito, ciudad y monto), incluye una marca especial en su respuesta. El servidor detecta esa marca, extrae los datos y los envía al CRM sin que el usuario lo note. La respuesta que llega al chat es texto limpio.

Si no hay clave de API configurada, el servidor responde con un modo simulación que detecta palabras clave y da respuestas coherentes. El sitio funciona igual para demostración.

---

## Seguridad

La clave de Anthropic vive únicamente en las variables de entorno del servidor (Railway). Nunca toca el navegador. Cada request pasa por validación de formato y longitud antes de llegar a la IA, y hay un límite de 30 mensajes por IP cada 15 minutos para evitar abuso.

Los datos del lead no se guardan en el servidor — van directo al CRM de forma asíncrona. Si el CRM falla, el error se registra en log pero no interrumpe la conversación del usuario.

---

## Qué envía al CRM

Cuando el lead está completo envía: nombre, ingreso estimado, situación laboral, tipo de crédito de interés, ciudad y monto aproximado. Todo junto con la fuente (`chat-ia`) y el timestamp para trazabilidad.
