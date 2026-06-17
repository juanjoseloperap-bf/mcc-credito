# SEO — Lo que implementé

El sitio tiene todas las bases de SEO técnico cubiertas para que Google lo indexe correctamente y se vea bien al compartirlo.

---

## Meta tags

Incluí en el `<head>` del sitio:

- **Title:** `Mi Casa Crédito | Crédito hipotecario digital en Colombia` — describe el negocio con las palabras clave principales.
- **Meta description:** resume el servicio en una línea orientada a búsquedas reales de usuarios colombianos que buscan crédito hipotecario.
- **Meta robots:** `index, follow` — le indica a Google que puede indexar la página y seguir sus enlaces.
- **Open Graph:** título y descripción optimizados para cuando alguien comparte el sitio en redes sociales o WhatsApp. La previa se ve limpia y profesional.

## Estructura de contenido

- Un solo `<h1>` con la propuesta de valor principal.
- Cada sección tiene su propio `<h2>` con términos relevantes al negocio: crédito hipotecario, calculadora, precalificación, ventajas, preguntas frecuentes.
- Los servicios y beneficios usan `<h3>` dentro de sus secciones.
- Esta jerarquía le da a Google contexto claro de qué trata cada parte del sitio.

## HTML semántico

Usé etiquetas que Google entiende bien: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>` y atributos `aria-label` en las secciones principales. Esto mejora tanto el SEO como la accesibilidad.

---

## Qué se podría agregar más adelante

- `og:image` — imagen de previa al compartir en redes (requiere tener una imagen de marca).
- `sitemap.xml` — mapa del sitio para facilitar la indexación si el sitio crece con más páginas.
- `robots.txt` — instrucciones explícitas para los crawlers de buscadores.
- Schema.org / JSON-LD — datos estructurados para que Google muestre información enriquecida en los resultados de búsqueda (nombre del negocio, servicios, calificaciones).
