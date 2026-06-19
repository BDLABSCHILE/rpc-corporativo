# Auditoría de datos — qué pedirle a Ropa Publicitaria Chile

> Estado del sitio: **vista previa lista para presentar.** Todo lo que sigue es
> data que **inventamos, derivamos o rellenamos** para que la web se viera
> completa y funcional. Antes de lanzar en vivo hay que confirmarla o
> reemplazarla con la marca. Ordenado por prioridad.
>
> Última actualización: 2026-06-18 · catálogo completo de **35 productos reales**
> en 6 categorías (Poleras, Polerones y Polar, Camisas y Blusas, Ropa Técnica y
> Cortavientos, Jockeys/Gorros/Accesorios, Delantales y Uniformes).

---

## 🔴 Prioridad alta — afecta lo que el cliente ve y los precios

### 1. Fotos de producto (todas generadas con IA)
Las **35 fotos** del catálogo son **generadas** (prenda en blanco, maniquí
invisible, fondo gris de estudio). Se ven profesionales y consistentes, pero
**no son las prendas reales** de RPC.
- **Pedir:** fotos reales de estudio de cada producto. Idealmente frente +
  espalda y, si se puede, una foto por color.
- Mientras tanto las generadas sirven perfecto para la presentación.
- Cada producto hoy muestra **un solo color "hero"** (el de la foto); el resto
  de los colores son botones de texto. Las fotos por color quedan pendientes.

### 2. Precios — los tramos por volumen están DERIVADOS, no confirmados
La marca entregó un **rango por unidad** por producto (ej. 8.500 – 13.500) y la
regla *"sobre 50 unidades baja harto"*. A partir de eso armamos una tabla de
tramos (10 / 25 / 50 / 100 u). **Los valores intermedios (25u, 50u) son
interpolados por nosotros**, no son precios reales.
- **Pedir:** la tabla real de precios por cantidad de cada producto.

### 3. Precio "prenda + técnica por separado" — los totales superan el rango
Por decisión tuya, el configurador muestra el **precio de la prenda** y le
**suma la técnica encima** (Bordado +$3.000, Serigrafía +$1.000, DTF +$3.000).
Eso hace que el **total final quede por sobre el rango** que entregó la marca.
- ⚠️ Su ejemplo (*"50 poleras cuello redondo con bordado insignia = $8.500"*)
  sugiere que **el rango ya incluía un logo básico**. Hay que **confirmar con la
  marca** si el rango es prenda sola (modelo actual) o prenda con logo incluido.
  Esto cambia todos los totales que ve el cliente.

### 4. Precios de técnicas incompletos
La marca dio: Serigrafía $1.000 (mín 20), Bordado $3.000 (mín 10), DTF $3.000
(mín 10). **Faltan:**
- **Sublimación**: ofrecida, sin precio ni mínimo → usada en Bandanas, referencial.
- **Vinilo textil (corte)**: ofrecida, sin precio → le pusimos **$990 referencial**.
- **Setup / fotolito / digitalización**: lo dejamos en **$0**. Confirmar si cobran setup.
- **Recargo por zona extra** (2ª posición): inventado referencial. Confirmar.
- **IVA**: asumimos que los rangos son **netos (+IVA)**. Solo el producto #5 decía
  "más IVA" explícito. Confirmar si los demás son netos o con IVA incluido.

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
La marca levantó las **6 categorías completas = 35 productos reales** (Poleras 7,
Polerones y Polar 5, Camisas y Blusas 6, Ropa Técnica y Cortavientos 4, Jockeys/
Gorros/Accesorios 6, Delantales y Uniformes 7). Nombres, colores, tallas,
mínimos, modalidad (stock express vs fabricación a medida), plazos y técnicas son
los del formulario. Lo único nuestro en estos productos son las **fotos** (punto 1),
los **tramos de precio** (punto 2) y las **descripciones** (punto 8).

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
| 35 productos (6 categorías) | ✅ nombres, colores, tallas, mín, modalidad, técnicas, materialidad | — |
| Rangos de precio por unidad | ✅ tope y piso | ⚠️ tramos intermedios derivados |
| Precio técnicas (Serigrafía/Bordado/DTF) | ✅ base + mínimo | setup, zona extra, vinilo, sublimación |
| Fotos de producto | — | ✅ 35 generadas con IA |
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
