# Errores corregidos — Parte 1

Revisé el archivo `mcc-precalificacion-buggy.html` completo y encontré **8 errores**. Los corrijo y explico uno por uno.

---

| # | Qué estaba mal | Por qué importa | Cómo lo corregí |
|---|---|---|---|
| 1 | El `<label>` del email tenía `for="correo"` pero el input tenía `id="email"` | El label no apuntaba al campo correcto. Hacer clic en el texto no enfocaba el input y los lectores de pantalla lo anunciaban mal. | Cambié `for="correo"` a `for="email"` para que coincidan. |
| 2 | La validación usaba `&&` en vez de `\|\|` al verificar nombre y email | Con `&&`, si el nombre estaba bien pero el email era inválido, la validación pasaba igual. El operador correcto es `\|\|` para fallar si cualquiera de los dos falla. | Cambié el operador `&&` por `\|\|`. |
| 3 | Faltaba un `return` después de detectar datos inválidos | Sin el `return`, el código seguía ejecutándose aunque la validación fallara. El formulario mostraba mensaje de éxito incluso con campos vacíos. | Agregué `return;` inmediatamente después del mensaje de error. |
| 4 | El ingreso se guardaba como elemento del DOM, no como número | `income: incomeInput` guardaba el nodo HTML, no el valor escrito. Al comparar `lead.income > 5000` siempre daba falso porque comparaba un objeto con un número. | Cambié a `income: Number(incomeInput.value)`. |
| 5 | `lead.employment = 'employee'` usaba `=` en vez de `===` | Eso no es una comparación, es una asignación. El `if` siempre era verdadero sin importar lo que el usuario eligiera, y además sobreescribía el valor del campo. | Cambié a `lead.employment === 'employee'`. |
| 6 | La tasa anual no se convertía a decimal antes de calcular | La fórmula necesita la tasa como decimal (0.065), no como porcentaje (6.5). Sin esa conversión, una cuota de $1.896 aparecía como $162.000. | Cambié `annualRate / 12` por `annualRate / 100 / 12`. |
| 7 | El contenedor tenía `width: 1180px` fijo | En pantallas más pequeñas el sitio se desbordaba horizontalmente y aparecía scroll lateral. | Cambié a `max-width: 1180px; width: 100%` para que se adapte al ancho disponible. |
| 8 | La sección hero estaba dentro del `<header>` | El `<header>` es para navegación y logo, no para contenido principal. Además el título principal era `<h2>` cuando debería ser `<h1>`. | Moví el hero a `<main>` y cambié el `<h2>` a `<h1>`. |

---

Adicional a las correcciones, mejoré la calculadora para que muestre también el total pagado y los intereses totales, y agregué validación básica antes de calcular para evitar resultados inválidos.
