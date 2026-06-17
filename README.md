# Mi Casa Crédito — Prueba Técnica

**Candidato:** Juan Jose Lopera Posada
**Sitio en vivo:** https://mcc-credito-production.up.railway.app

---

## Qué hay en este repositorio

Este repo cubre las tres partes de la prueba en un solo lugar:

```
mcc-credito/
├── parte_1_corregida/      → Parte 1: el HTML buggy corregido + documentación de errores
├── public/                 → Parte 3: el sitio completo (frontend)
├── server.js               → Parte 2 + 3: backend con el agente IA y las rutas
├── ARQUITECTURA_IA.md      → Parte 2: cómo está montada la integración de IA
├── DECISIONES_TECNICAS.md  → Parte 3: por qué elegí lo que elegí
└── RECOMENDACIONES_FUTURAS.md → Qué haría diferente o adicional en producción real
```

---

## Cómo correrlo localmente

```bash
git clone https://github.com/juanjoseloperap-bf/mcc-credito.git
cd mcc-credito
npm install
cp .env.example .env
npm start
```

Luego abrir: **http://localhost:3000**

Para usar el agente IA real, agregar la clave de Anthropic en el `.env`. Si no hay clave, el asistente responde en modo simulación automáticamente — el sitio funciona igual.

---

## Resumen de cada parte

**Parte 1 — Depuración:** encontré 8 errores en el archivo original. Están todos documentados con tabla en `parte_1_corregida/ERRORES_CORREGIDOS.md`.

**Parte 2 — IA:** construí un agente conversacional llamado Carlos que orienta al usuario, calcula escenarios y recolecta los datos del lead para enviarlo al CRM. La clave de IA vive en el servidor, nunca llega al navegador.

**Parte 3 — Sitio web:** una sola página con seis secciones: presentación, servicios, calculadora de hipoteca y ROI, formulario de precalificación, ventajas y preguntas frecuentes. Responsive, con animaciones y desplegado en Railway con deploy automático desde GitHub.
