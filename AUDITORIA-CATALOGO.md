# Auditoría de datos — qué pedirle a Ropa Publicitaria Chile

> Estado del sitio: **vista previa lista para presentar.** Todo lo que sigue es
> data que **inventamos, derivamos o rellenamos** para que la web se viera
> completa y funcional. Antes de lanzar en vivo hay que confirmarla o
> reemplazarla con la marca. Ordenado por prioridad.
>
> Última actualización: 2026-06-23 · catálogo de **47 productos reales** en 7
> categorías + **TODAS las reglas comerciales, precios de técnicas y tramos
> por cantidad CONFIRMADOS por la marca** (matriz devuelta 2026-06-23 +
> follow-up WhatsApp con los 5 productos faltantes y las 4 reglas
> pendientes). El cotizador ya opera con datos 100% reales.

---

## ✅ Lo que la marca ya confirmó (2026-06-23)

**Reglas generales (hoja "Reglas generales" de la matriz devuelta):**
- ✅ **IVA = NETO** (los rangos no incluyen IVA; el 19% se suma al final). El
  sitio ya estaba modelado así.
- ✅ **Rango = solo la prenda**, no incluye logo. El sitio ya lo modela así
  (técnica se suma encima de la prenda).
- ✅ **Descuento por volumen desde 50 unidades.**
- ✅ **Mezclar tallas y colores en un mismo pedido: sí.**
- ✅ **Cada logo extra (zona adicional) se cobra.**
- ✅ **Bordado**: matriz se cobra **una vez por logo · gratis sobre 50 u**.
- ✅ **Plazo express: 2 días.**
- ✅ **Despacho:** gratis sobre 25 u en RM; regiones paga el cliente.
- ✅ **Pago:** cliente nuevo 50% adelanto + 50% contra entrega, OC contra entrega,
  o 30 días con respaldo.
- ✅ **Devoluciones:** solo por error de RPC.
- ✅ **Logos:** que el cliente envíe vectorizado (AI estampado, PDF bordado).

**Precios de técnicas (hoja "Técnicas de estampado"), por tamaño:**

| Técnica | Mín | Insignia (5–12 cm) | Carta (~28 cm) | Gigantografía (>33 cm) |
|---|---|---|---|---|
| Serigrafía 1 color | 20 | $1.000 | $2.000 | — |
| Serigrafía full color (hasta 5 colores) | 20 | $2.000 | $3.000 | — |
| Bordado | 10 | $2.500 | $5.000 | $7.000 |
| DTF / Transfer digital | 10 | $2.500 | $4.500 | $6.500 |
| Vinilo textil | — | $2.800 | $5.000 | — |

Aplicados al sitio: el `basePriceUnit` de cada técnica usa el precio **insignia**
(caso default). Los recargos por carta y gigantografía quedan en la descripción
hasta que sumemos un selector de tamaño al configurador (UI pendiente).

---

## 🔴 Prioridad alta — todavía pendientes

### 1. Fotos de producto (todas generadas con IA)
Las **47 fotos** del catálogo son **generadas** (prenda en blanco, maniquí
invisible, fondo gris de estudio). Se ven profesionales y consistentes, pero
**no son las prendas reales** de RPC.
- **Pedir:** fotos reales de estudio de cada producto. Idealmente frente +
  espalda y, si se puede, una foto por color.
- Cada producto muestra hoy un solo color "hero"; las fotos por color quedan
  pendientes.

### 2. ✅ Tramos exactos por producto — RESUELTO
La marca devolvió la planilla `Precios.xlsx` el 2026-06-23 con los tramos
10 / 25 / 50 / 100 / 250 u para todos los productos. Cargados al sitio
producto a producto. Tramos 500 u y 1.000 u: la marca no los cotiza.

### 3. ✅ Sublimación — RESUELTO
La marca aclaró que la sublimación **viene incluida** en el precio del
producto (Bandanas) — no se cobra aparte. La técnica quedó con `basePriceUnit:
0` y descripción "sublimación incluida".

### 4. ✅ Setup de serigrafía — RESUELTO
NO se cobra setup en serigrafía. El sitio ya tiene `setupFee: 0`. Confirmado.

### 5. ✅ Logo complejo — RESUELTO
La marca aclaró: "Se hace en DTF y el precio es similar". O sea, si el cliente
quiere un logo con degradados/detalle, se deriva a la técnica DTF (que ya cobra
sus tarifas). NO hay recargo extra por complejidad.

### 6. ✅ Descuento por volumen: por TOTAL del pedido — RESUELTO
La marca confirmó: el descuento aplica sobre la cantidad TOTAL del pedido (no
por producto). Implementado en `lib/quote/pricing.ts` con el parámetro
`cartTotalQty`: en el cotizador, el tramo de cada línea se decide sumando todas
las líneas. Si pides 5 poleras + 5 polerones, ambos cotizan en el tramo de 10 u.

### 7. UI pendiente: selector de tamaño del logo
El sitio cobra el precio **insignia** por defecto. Para reflejar carta /
gigantografía hay que agregar un selector en el configurador (1 hora de trabajo
cuando decidamos hacerlo). No es bloqueante para lanzar.

### 8. ✅ Los 5 productos del último incremento — RESUELTOS
Gorro de Chef, Cofia, Mandil Largo Poliéster, Jockey Gabardina para Estampado y
Pantalón Cargo Forro Polar — la marca los cotizó el 2026-06-23 vía WhatsApp.
Cargados al sitio con sus tramos reales.

---

## 🟡 Prioridad media — datos del formulario que quedaron en blanco

### 5. Campos que la marca dejó pendientes
- **Materiales sin especificar** ("A confirmar al cotizar"): Polera Oversize,
  Camisa Jeans, Blusa Jeans, los 3 Softshell, Bucket Hat y Gorro Safari.
- **Plazos pendientes** (usamos un valor referencial): Dry-Fit con botones,
  Polar sin mangas, Polerón polo, Camisa/Blusa Oxford, Jockey, Gorro de lana.
- **Polerón Canguro** — la marca escribió *"70% algodón · 20% poliéster"*
  (suma 90%). Posible typo: ¿es 30%? **Confirmar composición.**
- **Gorro Safari** — en el formulario el campo "Colores" decía `10` (dato
  erróneo). Pusimos **Beige / Verde militar / Negro** de referencia → confirmar.
- **Camisa/Blusa Jeans** — venían con un único color ("azul jeans"); confirmar si
  hay más colores.
- **Notas** de varios productos venían "(pendiente)".

### 6. Stock infinito (asunción del negocio)
Pusimos **disponibilidad infinita** en todo el catálogo (siempre "Stock
inmediato", el análisis de plazos solo cuenta personalización + despacho),
porque me dijiste que **RPC consigue las prendas y las estampa** (no mantiene
stock propio).
- **Confirmar** que aplica a todo el catálogo, o si hay productos de temporada /
  disponibilidad limitada que deban mostrar plazo distinto.

### 7. Catálogo completo — ya no hay categorías demo
La marca levantó **7 categorías completas = 47 productos reales** (Poleras 7,
Polerones y Polar 5, Camisas y Blusas 6, **Pantalones 8**, Ropa Técnica y
Cortavientos 4, **Jockeys/Gorros/Accesorios 7**, **Delantales y Uniformes 10**). Nombres,
colores, tallas, mínimos, modalidad (stock express vs fabricación a medida),
plazos y técnicas son los del formulario. Lo único nuestro en estos productos
son las **fotos** (punto 1), los **tramos de precio** (punto 2) y las
**descripciones** (punto 8). En el formulario, los 3 pantalones venían bajo
categoría "Otro"; en el sitio los agrupé como **"Pantalones"** para que tenga
sentido al usuario.

---

## 🟢 Prioridad baja — revisar antes de lanzar en vivo

### 8. Textos de producto redactados por nosotros
Las descripciones (usos, "el favorito de startups", etc.) las **redactamos a
partir del tipo de prenda**, sin inventar gramajes que la marca no dio (solo el
polar #8 traía "300 g"). Conviene que la marca las lea y ajuste el tono/datos.

### 9. Modelado de técnicas y zonas de impresión
- "Serigrafía" la mostramos como **"Serigrafía 1 color"** (+ "full color" en
  demo). Confirmar si quieren separar 1 color vs full color en el sitio.
- **Zonas de impresión** (pecho, espalda, manga) y sus **tamaños máximos en cm**
  son de referencia; los recuadros no están calibrados sobre foto real.

### 10. SKUs autogenerados
Los SKU de variante (ej. `RPC-CRMC-01`) son **placeholders** generados por
nosotros. Reemplazar por los SKU reales cuando se conecte el sistema/Shopify.

### 11. Marca y contacto (heredado del sitio actual, confirmar vigencia)
- Email `hola@ropapublicitariachile.cl`, WhatsApp **+56 9 9469 7724**, dirección
  **Pasaje Inducentro 275, Of. 401, Recoleta**, razón social **Comercial Franca
  Pisani Ltda.** → vienen del sitio actual, **confirmar vigentes.**
- Claim **"desde 1982 / 40+ años"** → confirmar año exacto de fundación.
- **Logo del header**: el archivo actual (`rpc-logo.webp`) se ve un poco apretado.
  Pedir el **arte oficial** (idealmente versión horizontal en alta).
- **Clientes / casos de éxito** del sitio: confirmar que los logos y casos
  listados son reales y están autorizados para mostrarse.

---

## Resumen de "qué es real" vs "qué pusimos nosotros"

| Dato | Real (marca) | Lo pusimos nosotros |
|---|---|---|
| 47 productos (7 categorías) | ✅ nombres, colores, tallas, mín, modalidad, técnicas, materialidad | — |
| Rangos de precio por unidad | ✅ tope y piso | ⚠️ tramos intermedios derivados |
| Precio técnicas (Serigrafía/Bordado/DTF) | ✅ base + mínimo | setup, zona extra, vinilo, sublimación |
| Fotos de producto | — | ✅ 47 generadas con IA |
| Stock | — | ✅ infinito (según tu indicación) |
| Descripciones / copy | parcial | ✅ redactadas por nosotros |
| Materiales y plazos pendientes (ver punto 5) | parcial | ✅ rellenados de referencia |
| SKUs | — | ✅ autogenerados |
| Logos de clientes | ✅ marcas reales del sitio | ✅ logos sourced online (ver abajo) |

---

## 🟡 Logos del muro de clientes (sourced online)

Se agregaron **22 logos oficiales** al muro "Confían en nosotros", descargados a
`public/brand/clients/` (mayoría SVG de Wikimedia Commons; Colmena, Red de Salud
UC, Bosca y Viña Santa Carolina desde el sitio oficial de cada marca). Se
muestran en escala de grises y pasan a color al hover.

**Confirmado:**
- **Bosca** → es **bosca.cl (calefacción/estufas)**, confirmado por la marca. Logo correcto. ✅

**A confirmar con la marca:**
- **The Grange School** → su sitio bloquea la descarga automática (anti-bot), así
  que aparece como **texto**. Enviar el archivo del logo para incorporarlo.
- **Facultad de Medicina UC** usa el **escudo institucional UC** (no hay marca
  separada de la facultad); **Universidad Mayor** es el escudo (solo había JPEG).
- Logos de marcas de terceros mostrados como referencia de clientes reales
  (uso nominativo). Si algún cliente no autoriza el uso de su logo, se quita.
