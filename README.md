# Afíliame — demo navegable (datos de ejemplo)

Front del producto **Afíliame: anualidades compartidas con pago protegido**. Todo el dinero, los
negocios y las personas son ficticios: no hay backend, ni pagos reales, ni llamadas a la red
Stellar. El estado vive en el navegador (Zustand + localStorage).

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck (tsc -b) + build de producción
npm run preview  # sirve el build en http://localhost:4173/AFILIAME/
```

## Deploy en GitHub Pages

Sitio publicado: **https://kevinho71.github.io/AFILIAME/**

- `vite.config.ts` usa `base: "/AFILIAME/"` en el build (el dev server sigue en `/`). Si renombras el
  repositorio, cambia esa constante.
- El router usa `basename={import.meta.env.BASE_URL}`, así que las rutas funcionan dentro del
  subdirectorio del repo.
- `postbuild` (`scripts/pages-postbuild.mjs`) genera `dist/404.html` —copia del `index.html`— para
  que los enlaces profundos tipo `/AFILIAME/oferta/powerfit` carguen la SPA en lugar de un 404, y
  deja `.nojekyll`.
- `.github/workflows/deploy-pages.yml` construye y publica en cada push a `main` (o manualmente
  desde la pestaña Actions). `.github/workflows/ci.yml` corre typecheck + build en cada push.
- En el repositorio, Pages está configurado con origen **GitHub Actions**
  (Settings → Pages → Source). Si aparece "Not Found" al entrar, revisa que ese origen siga puesto.


## Stack

Vite + React 19 + TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · Zustand (estado en memoria con
persistencia en `localStorage`) · Recharts (reportes) · `qrcode.react` (QR) · lucide-react (iconos) ·
sonner (avisos).

Diseño: tema oscuro, un solo acento verde digital con dorado para los momentos de dinero, tipografía
Space Grotesk + Inter + JetBrains Mono para cifras. App mobile-first para el cliente y desktop-first
para el negocio.

## Landing y acceso

La portada es comercial: **AFÍLIAME** como marca, el lema “Comparte el año. Paga tu parte.”, la
comparativa *anualidad vs. 12 mensualidades*, el gancho “¿Te imaginas pagar tus meses, pero al
precio de anualidad?”, el paso a paso, una explicación para clientes y otra para negocios, y el
cierre con botón de registro.

El botón **Registrarme** abre el modal de acceso, que tiene dos caminos:

- **Soy cliente**: Google, Apple o teléfono (mock), o el flujo de verificación paso a paso en
  `/registro`.
- **Soy negocio**: verificación de identidad en 3 pasos (datos del negocio y NIT → carnet y selfie
  del dueño → cuenta de cobro y aceptación de reglas). Al enviar, entra al panel en
  `/panel/verificacion`.

El rol ya no se cambia con un interruptor: se elige al iniciar sesión. Desde el panel del negocio o
desde la app del cliente se puede usar **Cambiar de cuenta**, que vuelve a la landing con el modal
abierto (`/?login=1`).

## Guion de demo (3 minutos)

1. **Problema** — `/` (landing: comparativa anualidad vs. mensualidades).
2. **El negocio publica** — iniciar sesión como negocio → `/panel` → `/panel/ofertas/nueva`
   (asistente de 5 pasos con simulación de ingreso).
3. **El cliente compra** — cambiar de cuenta como cliente → `/explorar` → `/oferta/powerfit`
   (1 de 3 cupos) → `Reservar cupo` → `/pago/pf-2` → «Ya pagué el QR» → “Tu pago está en garantía”.
4. **Se llena el grupo** — panel de control (abajo a la derecha) → *Llenar un cupo* → grupo completo
   → `/pase/pf-2` con el pase digital. Con *Iniciar el periodo* el pase queda activo.
5. **El negocio decide** — cambiar de cuenta → `/panel/billetera`: saldo +174,60 USDC →
   `/panel/billetera/retirar` (conversión a Bs con margen del 1%) y `/panel/billetera/pagar-qr`
   (pago de un QR en bolivianos con el saldo en dólares digitales).
6. **Confianza** — `/garantia/powerfit`: depósitos, condiciones y explicación en lenguaje simple.

### Panel de control (flotante)

| Acción | Qué hace |
| --- | --- |
| Llenar un cupo | Un participante ficticio paga el siguiente cupo libre de la oferta en foco |
| Llenar todos los cupos | Completa el grupo y libera la garantía (menos 3% de comisión) |
| Avanzar hasta el vencimiento | Las ofertas sin completar pasan a *Vencida* y cada pago se reembolsa |
| Iniciar el periodo | La oferta liberada pasa a *En curso* y los pases quedan activos |
| Cambiar tasa de cambio | Alterna 10 → 11,2 → 9,6 Bs por USDC (los pagos ya hechos conservan su tasa) |
| Cambiar de cuenta | Vuelve a la landing con el modal de acceso abierto |
| Reiniciar datos | Vuelve al estado inicial del recorrido |

## Vista del cliente (reglas de diseño)

- **Escritorio normal**: la app del cliente usa barra superior con navegación (Explorar, Mis cupos,
  Avisos, Perfil), contenido centrado de 1180 px y dos columnas en las pantallas largas. En móvil
  cambia a barra inferior; no hay marco de teléfono.
- **Solo bolivianos**: el cliente paga por QR en Bs y nunca ve montos en dólares digitales/USDC.
  Esa información vive únicamente en el panel del negocio.
- **Tarjetas con el ahorro**: precio normal tachado + precio actual resaltado + “Ahorras Bs X”.
  Sin etiquetas de porcentaje ni la palabra “descuento”.
- **Una sola barra de cupos**, dividida en tantos tramos como cupos tenga la oferta.
- **Sin datos de terceros**: nunca se muestra quién ocupa los otros cupos, ni nombres, ni fechas de
  pago ajenas. Solo el agregado (“1 de 3 cupos ocupados”).
- “Tu pago está protegido” y “Qué pasa después de pagar” quedan compactados en un botón con
  diálogo y en un desplegable, para no ocupar espacio.

## Mapa de pantallas

### Cliente (U1–U13)

| Doc | Pantalla | Ruta |
| --- | --- | --- |
| U1 | Bienvenida y registro | `/`, `/bienvenida`, `/registro` |
| U2 | Explorar | `/explorar` |
| U3 | Detalle de oferta | `/oferta/:offerId` |
| U4 | Elegir cupo | `/oferta/:offerId/reservar` |
| U5 | Pago (QR y variante USDC) | `/pago/:cupoId` |
| U6 | Cupo reservado | `/reservado/:cupoId` |
| U7 | Esperando al grupo | `/esperando/:offerId` |
| U8 | Acceso listo / pase digital | `/pase/:cupoId` |
| U9 | Mis cupos | `/mis-cupos` |
| U10 | Reembolso automático | `/reembolso/:cupoId` |
| U11 | Ceder mi cupo | `/ceder/:cupoId` |
| U12 | Comprobante y garantía | `/comprobante/:cupoId`, `/garantia/:offerId` |
| U13 | Perfil, avisos y ayuda | `/perfil`, `/avisos` |

### Negocio (M1–M12)

| Doc | Pantalla | Ruta |
| --- | --- | --- |
| M1 | Registro y verificación | `/panel/verificacion` |
| M2 | Panel principal | `/panel` |
| M3 | Crear oferta (5 pasos) | `/panel/ofertas/nueva` |
| M4 | Mis ofertas | `/panel/ofertas` |
| M5 | Detalle de oferta | `/panel/ofertas/:offerId` |
| M6 | Billetera | `/panel/billetera` |
| M7 | Retirar a cuenta bancaria | `/panel/billetera/retirar` |
| M8 | Pagar a un QR | `/panel/billetera/pagar-qr` |
| M9 | Validar acceso | `/panel/validar` |
| M10 | Reportes | `/panel/reportes` |
| M11 | Rendimiento (Próximamente) | `/panel/rendimiento` |
| M12 | Configuración | `/panel/configuracion` |

## Números del ejemplo (sección 8 del documento)

Tasa de referencia **1 USDC = 10 Bs**, comisión de plataforma **3%**, margen de conversión **1%**.

| Concepto | Valor | Dónde se ve |
| --- | --- | --- |
| Anualidad PowerFit | Bs 1.800 | landing, detalle de oferta, panel M3 |
| Precio por cupo (4 meses) | Bs 600 | feed, detalle, elegir cupo, pago |
| Ahorro frente a la mensual | 25% (Bs 800) | landing, tarjetas y comparativas |
| Garantía por cupo | 60 USDC | pago, comprobante, garantía |
| Total en garantía (3 cupos) | 180 USDC | garantía, pago, panel |
| Comisión de plataforma | 5,4 USDC | garantía, billetera, reportes |
| Liberación al negocio | 174,60 USDC | billetera, notificaciones |
| Retiro total a banco | Bs 1.728,54 (1% de margen) | retiro M7 |

Estados de oferta (*Publicada, Llenándose, Completa, Liberada, En curso, Vencida, Reembolsada,
Pausada*) y de cupo (*Disponible, Reservado, Pagado en garantía, Activo, Finalizado, Reembolsado, En
cesión*) se recorren desde el panel de control.

## Idioma, formato y lenguaje

- Español de Bolivia; montos `Bs 1.800` / `Bs 1.728,54`; fechas `dd/mm/aaaa`.
- Vocabulario del producto: “cupo”, “garantía”, “tu pago está protegido”, “reembolso automático”.
  Sin claves, semillas ni comisiones de red en la interfaz; la parte técnica aparece solo en
  *Ver garantía*, con lenguaje simple.
- Sin promesas ni cifras de rendimiento: la pantalla de rendimiento está deshabilitada y sin números.
- Lo legal y regulatorio se presenta como pendiente de validación.

## Qué no incluye

No integra pagos reales, claves reales ni llamadas a Stellar; no incluye backend, autenticación real
ni la consola de plataforma; no afirma cumplimiento regulatorio.

## Estado

El estado se guarda en `localStorage` con la clave `cupos-demo-v1`. Para volver al estado inicial:
**Reiniciar datos** en el panel de control (o borrar esa clave).
