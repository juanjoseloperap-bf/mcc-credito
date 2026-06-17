# Decisiones técnicas — Parte 3

Acá explico las decisiones principales que tomé al construir el sitio y por qué las tomé.

---

## Una sola página, no varias

Elegí construirlo como una sola página con secciones en lugar de múltiples páginas. El contenido tiene un flujo natural: el usuario entiende el servicio, calcula su cuota, llena el formulario y si tiene dudas abre el chat. Separarlo en páginas hubiera roto ese flujo sin agregar valor real.

## Vanilla JS, sin frameworks

La prueba lo pedía explícitamente y lo comparto: para un sitio de este alcance un framework sería sobredimensionado. El resultado es más liviano, más fácil de leer y no requiere build steps. Dividí el JS en archivos por responsabilidad: uno para la calculadora, uno para el formulario, uno para el chat, uno para las animaciones.

## El backend en el mismo proyecto

El servidor Express sirve tanto el frontend estático como el endpoint del chat IA. Esto simplifica el deploy — todo en un solo servicio en Railway — y elimina problemas de CORS porque el navegador habla con el mismo dominio.

## Las animaciones

Usé GSAP para las animaciones de scroll y entrada, Lenis para el desplazamiento suave entre secciones y Vanta.js para el fondo 3D del hero. En dispositivos móviles el fondo 3D se desactiva para no afectar el rendimiento. Los botones principales tienen efecto magnético: se atraen levemente hacia el cursor al pasar por encima. Las tarjetas de servicios tienen perspectiva 3D al hacer hover.

Quise que el sitio se sintiera moderno y cuidado sin ser recargado — es un producto financiero, la seriedad importa.

## Deploy en Railway

Conecté el repositorio de GitHub a Railway. Cada vez que hago push a `main` el sitio se actualiza automáticamente. Las variables de entorno (clave de IA, configuración de CORS) viven en Railway, nunca en el código.

## Secciones del sitio

El sitio tiene seis secciones: presentación con propuesta de valor, tres productos de crédito, calculadora dual (hipoteca y ROI de inversión), formulario de precalificación con validación en tiempo real, ventajas competitivas y preguntas frecuentes. El agente IA está disponible en todo momento como widget flotante.
