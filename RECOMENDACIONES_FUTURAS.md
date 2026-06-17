# Recomendaciones futuras

Lo que haría si este proyecto continuara en producción real.

---

## Lo más urgente

**Base de datos para los leads.** Hoy los datos del formulario y del chat van directo al CRM vía webhook. Si el CRM falla en ese momento, se pierden. Lo correcto es guardar primero en base de datos y luego sincronizar con el CRM. Railway ya incluye PostgreSQL, el esfuerzo es bajo.

**Autenticación para un panel interno.** El equipo de asesores necesita ver los leads que llegan, saber cuáles ya fueron contactados y hacer seguimiento. Con una ruta protegida básica y una tabla en la misma DB ya se resuelve sin necesidad de comprar un CRM externo en la etapa inicial.

**Notificación inmediata al asesor.** Cuando llega un lead completo desde el chat, el asesor debería saberlo de inmediato. Un correo transaccional o un mensaje a WhatsApp es suficiente para empezar. En Colombia el WhatsApp tiene mucho más tasa de apertura que el email.

---

## Mejoras al producto

**Tabla de amortización descargable.** La calculadora muestra la cuota mensual, pero muchos usuarios quieren ver el desglose mes a mes. Agregaría la opción de descargar eso en PDF.

**Comparador de escenarios.** Poder comparar dos opciones en paralelo (diferente plazo o diferente tasa) dentro de la misma calculadora. Es una funcionalidad que genera mucho tiempo de permanencia y confianza.

**Tour de bienvenida.** Un recorrido guiado de tres pasos para usuarios que llegan por primera vez y no saben por dónde empezar: calculadora → formulario → chat.

---

## Deuda técnica

- Comprimir los assets del servidor (gzip) para reducir el tiempo de carga.
- Agregar monitoreo de errores (Sentry) para saber si algo falla en producción sin tener que revisar logs manualmente.
- Mover el system prompt del agente a la base de datos para poder actualizarlo sin necesidad de redesplegar el servidor.
