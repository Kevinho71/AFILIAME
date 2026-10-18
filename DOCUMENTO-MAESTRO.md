# Afíliame — Documento maestro (fuente de verdad)

> **Este documento es la referencia canónica del proyecto.** Reúne qué es Afíliame, para quién es,
> qué resuelve, cómo funciona, las reglas de negocio vigentes, la rentabilidad, la seguridad del
> dinero y la validación de identidad. Si algo aquí contradice a otro archivo, **este documento
> manda**. Al final hay un mapa que indica dónde vive cada cosa.

**Nombre:** Afíliame · **Lema:** "Comparte el año. Paga tu parte."
**Estado actual:** prototipo navegable (mockup). No hay backend, ni pagos reales, ni llamadas a la
red Stellar, ni código de blockchain. Todo el dinero, negocios y personas son ficticios.

---

## 1. Qué es Afíliame (en una frase)

Un negocio con servicios de uso por tiempo (gimnasio, coworking, piscina, academia, parqueo) publica
su **anualidad dividida en cupos**. Personas distintas se juntan para cubrir el precio anual y cada
una paga solo su parte, por QR en bolivianos. El dinero queda en una **garantía** (sobre Stellar, en
USDC) y se libera al negocio solo cuando el grupo se completa; si no, se devuelve automáticamente.
El negocio cobra la anualidad completa por adelantado y el usuario paga el precio anual por solo los
meses que va a usar.

## 2. A quién va dirigido y qué problema resuelve

### 2.1 Actores

| Actor | Quién es | Qué busca |
| --- | --- | --- |
| **Usuario (beneficiario)** | Persona que quiere un servicio por unos meses | Pagar tarifa anual sin comprometerse un año entero |
| **Negocio (comerciante)** | Dueño de gimnasio, coworking, club, academia, parqueo | Cobrar por adelantado y llenar capacidad ociosa |
| **Plataforma (Afíliame)** | Operación que orquesta y garantiza | Comisión por cada cupo vendido y por conversión |

### 2.2 El problema

- **Usuario:** la anualidad sale ~25% más barata, pero exige pagar y comprometerse el año entero.
  Mucha gente solo necesita 3 o 4 meses (un semestre, un proyecto, una temporada).
- **Negocio:** quiere efectivo inmediato y reducir abandono, pero sus clientes no pueden pagar la
  anualidad completa; la mensualidad deja ingresos inciertos.
- **Mercado:** las anualidades no usadas se pierden. La reventa informal por redes es insegura:
  estafas, sin garantía y sin consentimiento del negocio.
- **Confianza:** entre desconocidos nadie quiere pagar primero, y el negocio quiere certeza de cobro
  antes de inscribir gente.

### 2.3 La solución (propuesta de valor)

1. **Venta primaria autorizada:** el negocio crea la oferta, así no hay problema de cesión de contrato.
2. **Todo o nada:** nadie paga a ciegas; si el grupo no se llena, se devuelve todo.
3. **Garantía verificable:** cualquiera puede comprobar que los fondos están bloqueados.
4. **Flexibilidad de moneda:** el usuario paga en bolivianos; el negocio elige cómo recibir.

| Actor | Qué gana |
| --- | --- |
| Negocio | Cobra la anualidad completa por adelantado, llena capacidad, capta clientes nuevos, elige moneda y destino |
| Usuario | Tarifa anual con compromiso corto y pago fraccionado; dinero protegido; inscripción verificada |
| Plataforma | Comisión por cupo liberado, por cesión y por conversión |

---

## 3. Cómo funciona (flujo extremo a extremo)

1. El negocio se registra y es **verificado** (identidad del dueño, NIT, cuenta de cobro).
2. Publica una **oferta**: precio anual, número de cupos, periodos o franjas, plazo de llenado y reglas.
3. La oferta aparece en el feed con barra de cupos llenos y tiempo restante.
4. El usuario **reserva** un cupo y **paga por QR en bolivianos**.
5. La plataforma convierte ese pago a **USDC** y lo deposita en la **garantía**. El usuario ve "Tu
   pago está en garantía".
6. El grupo se va llenando; hay recordatorios antes del cierre.
7. **Si se completa antes del plazo:** la garantía se libera al negocio (menos la comisión) y cada
   beneficiario recibe su **código de activación**.
8. **Si vence sin completarse:** cada pago se devuelve automáticamente a su origen.
9. El beneficiario **activa su cupo** la primera vez que va (código de un solo uso, ver §5.3).
10. El negocio decide qué hacer con su saldo: mantenerlo, retirarlo a su banco o pagar a un QR.
11. Al finalizar el ciclo, se cierra la oferta y se habilita la calificación mutua.

### 3.1 Estados de una oferta

`Borrador → Publicada → Llenándose → Completa → Liberada → En curso → Finalizada → Cerrada`

Ramas alternas: **Vencida → Reembolsada** (plazo sin completarse) y **Cancelada → Reembolsada**
(el negocio la retira antes de llenarse). También puede **Pausada** (temporal).

### 3.2 Estados de un cupo

`disponible → reservado → en_garantia → emitido → activado → finalizado`

Ramas alternas: **reembolsado** (retiro o grupo incompleto) y **en_cesion** (cedido a otro).

---

## 4. Reglas de negocio (canónicas)

### 4.1 Cupos y fechas (uso)

Un cupo lleva fechas **solo si el uso es exclusivo** (dos personas no pueden usar el mismo recurso
a la vez). La decisión es del negocio.

| Tipo | Cuándo | ¿Lleva fechas? |
| --- | --- | --- |
| **compartido** | Varias personas a la vez (gimnasio, piscina, parqueo rotativo) | No |
| **franja** | Acceso por franja horaria (mañana/tarde/noche) | No (la franja vale todo el ciclo) |
| **exclusivo** | Recurso de una persona a la vez (escritorio fijo, lugar asignado) | Sí (periodo) |

### 4.2 Garantía (todo o nada)

- El dinero del usuario **nunca toca una cuenta de la plataforma como dueña**: pasa del pago a la
  garantía, y solo sale por **liberación al negocio** o por **reembolso**.
- **Todo o nada:** si no se completan los cupos antes del plazo, cada pago vuelve a su origen.
- La garantía es **intocable**: nunca se usa para rendimiento ni para otro fin.
- **Liberación completa vs escalonada (opcional).** Por defecto el negocio cobra todo al
  completarse el grupo (liquidez instantánea). La **liberación escalonada** (Sello "Pago
  Protegido") es **totalmente opcional**: el negocio la elige al publicar, desde el primer momento,
  sin requisito de historial. En ella el dinero se entrega por etapas, al inicio de cada periodo, y
  si el negocio cierra antes, lo no usado vuelve al cliente. El usuario ve el modo en un
  **indicador** en la oferta y, al pulsarlo, abre un **modal** que explica ambos modos y cómo
  protegen su dinero.

### 4.3 Activación del cupo (código de un solo uso)

Afíliame es dueño del dinero y de la verificación de *"quién pagó y tiene derecho"*. El negocio es
dueño del control de acceso diario. El puente es un **código de activación de un solo uso** (no una
credencia reutilizable):

1. Al liberarse la garantía, el cupo pasa a `emitido` y el beneficiario recibe el código (QR).
2. La primera vez que va, muestra el código en recepción.
3. El negocio escanea y ve **nombre, identidad verificada y vigencia** (nunca montos).
4. Si coincide, pulsa **Confirmar activación** → el código se **quema** y el cupo pasa a `activado`.
5. El negocio **inscribe al beneficiario con su propio método** (huella, tarjeta, lista…).

Reglas de robustez: se quema al **confirmar**, no al escanear; un solo código activo por cupo
(reemisión invalida el anterior); compartir el código no sirve (se muestra la identidad del titular).

### 4.4 Retiro del dinero (mientras el grupo se llena)

| Fase | ¿Puede retirar? | Condición |
| --- | --- | --- |
| Primeras **24 h** tras pagar | Sí, gratis | Arrepentimiento |
| Después de 24 h, **hasta 3 días antes del cierre** | Sí, con penalización | **2%** del precio del cupo |
| **Últimos 3 días** antes del cierre | No | Solo cesión |
| Grupo completo / fondos liberados | No | Solo cesión con aprobación del negocio |
| Periodo en curso o terminado | No | Nada |

- La penalización del 2% cubre el costo real de revertir la conversión; no es un castigo.
- Al retirar, el cupo **vuelve a quedar disponible**. Los demás miembros no se perjudican: si el
  grupo no se completa, reciben reembolso total igual.
- Por eso los últimos 3 días son solo cesión: un retiro tardío casi seguro hunde el grupo.

### 4.5 Cesión de cupo (no es un NFT)

La cesión es un **proceso gobernado**, no un token al portador:

1. El vendedor publica su cupo a un precio igual o menor al original (evita especulación).
2. El **negocio aprueba**.
3. El comprador paga y la plataforma **verifica su identidad**.
4. Se cambia el titular y se **reemite el código de activación** a nombre del nuevo.

Dos casos de dinero: **antes de completar** (el pago del comprador reemplaza al del vendedor; al
vendedor se le devuelve) y **después de liberar** (el comprador paga directo al vendedor vía la
garantía, con comisión de cesión del 2–3% que paga quien cede).

### 4.6 Reputación

- **Clientes: sin reputación pública.** Cualquiera puede participar en cualquier oferta. Solo existe
  un **guardrail anti-abuso invisible**: más de 2 reembolsos sin justificación en 90 días suspende la
  reserva automática y exige verificación manual.
- **Negocios: sí hay calificación.** El cliente necesita decidir entre opciones.

---

## 5. Seguridad del dinero

- **Garantía intocable:** los fondos del cliente nunca se usan para rendimiento ni se mueven con
  otro fin; solo liberación o reembolso.
- **Todo o nada:** reembolso automático si el grupo no se completa, en 24–72 horas hábiles, sin
  comisión para el usuario.
- **Precio fijo en bolivianos:** el usuario no asume riesgo cambiario; su precio queda fijo al pagar.
- **Dinero estable:** internamente el dinero es USDC (dólar digital), que conserva valor sin depender
  de una cuenta en dólares.
- **Verificable:** sobre Stellar, cualquiera puede comprobar que los fondos están bloqueados y bajo
  qué condiciones.
- **Reembolsos claros:** 24 h de arrepentimiento gratis; retiro con 2% después; solo cesión en los
  últimos 3 días; nada después de liberado.

> En el mockup esto se **simula**: no hay dinero real ni red. En el producto real, la garantía se
> implementa con `claimable balances` o un contrato Soroban (ver documento técnico).

### 5.1 Destino de devolución (cuenta bancaria, no QR)

Para las devoluciones el usuario **no guarda un "QR con monto válido un año"**: guarda una **cuenta
bancaria** (banco + número, a su nombre), que es lo que el QR representa por debajo. El QR solo
aparece al pagar o al retirar; nunca se conserva un QR vivo. Los reembolsos vuelven a esa cuenta en
24–72 horas hábiles.

### 5.2 Quién mueve el dinero (el anchor) y el riesgo de cambio

Toda conversión la ejecuta un **anchor (socio de liquidez)**: una entidad local regulada con cuentas
de banco (Bs) y cuentas Stellar (USDC). Afíliame no toca el dinero. La cadena de una devolución es:

`garantía (USDC) → el anchor convierte USDC→Bs → paga a la cuenta del usuario`

Sobre el tipo de cambio: el usuario **siempre recibe los Bs que pagó**. La diferencia cambiaria (si
el dólar subió o bajó entre el pago y la devolución) la absorbe la plataforma con el anchor,
financiada por el 3% (comisión), el 1% (margen) y el 2% (penalización de retiro).

## 6. Validación de identidad única

- **Verificación obligatoria** antes de pagar, para usuarios y negocios.
  - Usuario: carnet de identidad + selfie (biometría facial).
  - Negocio: datos del negocio + NIT + carnet y selfie del dueño + cuenta de cobro.
- **Registro nominal:** cada cupo se asigna a una persona identificada; el cupo no se transfiere sin
  aprobación del negocio.
- **Unicidad:** una persona = una cuenta verificada. Se detecta intento de doble registro por
  documento y por coincidencia biométrica del selfie.
- **Anti-abuso:** límite de reembolsos sin justificación (ver §4.6) y verificación manual ante
  comportamiento sospechoso.
- **Privacidad entre clientes:** nunca se muestra quién ocupa los otros cupos, solo el agregado
  ("2 de 3 cupos ocupados").

> En el mockup la verificación es un flujo simulado. En el producto real se integra un proveedor KYC.

- **Crear cuenta no toca blockchain.** Crear una cuenta en Afíliame es crear un registro en la app
  (off-chain). La cuenta Stellar (billetera) la crea la plataforma por detrás (custodia) y el
  usuario nunca la ve.
- **Google/Apple = autenticación, no identidad.** Iniciar sesión con Google solo prueba que esa
  cuenta de Google es tuya. La verificación de identidad (carnet + selfie) es separada y obligatoria
  antes de pagar.

---

## 7. Modelo de negocio (rentabilidad)

| Fuente de ingreso | Cuánto | Quién paga |
| --- | --- | --- |
| Comisión por oferta liberada | **3%** (rango 2,5–3,5%) | El negocio (se descuenta al liberar) |
| Cesión de cupo | **2–3%** del precio del cupo | Quien cede |
| Margen de conversión (Bs ↔ USDC) | **1%** por conversión | Quien retira o paga a QR |
| Plan premium (futuro) | Suscripción | Negocios |

El usuario **nunca paga comisión extra** por su cupo: paga el precio del cupo, punto.

### 7.1 Ejemplo numérico (cifras oficiales)

Oferta de gimnasio: anualidad **Bs 1.800** dividida en **3 cupos** (tasa de referencia 1 USDC = 10 Bs).

| Concepto | Cálculo | Resultado |
| --- | --- | --- |
| Precio por cupo (4 meses) | 1.800 ÷ 3 | **Bs 600** |
| Ahorro vs mensual | Mensual 200 × 12 = 2.400 vs 1.800 | **25% (Bs 600)** |
| Garantía por cupo | 600 Bs a 10 Bs/USDC | **60 USDC** |
| Total en garantía | 60 × 3 | **180 USDC** |
| Comisión de plataforma (3%) | 180 × 0,03 | **5,4 USDC** |
| Liberación al negocio | 180 − 5,4 | **174,6 USDC** |
| Retiro total a banco | 174,6 × 10 menos 1% | **≈ Bs 1.728** |

---

## 8. Por qué Stellar (breve)

- **Garantía verificable:** escrow programable que ninguna parte altera a su gusto; cualquiera lo
  verifica en un explorador.
- **Comisiones mínimas:** fracciones de centavo, lo que hace viable cobrar cupos pequeños (Bs 400–600).
- **USDC nativo:** dólar digital emitido por Circle directamente en Stellar, sin bridges.
- **Conversión integrada:** anchors y path payments para cambiar Bs ↔ USDC.
- **El usuario no maneja cripto:** cuentas patrocinadas (la plataforma paga el fee de red).

El detalle técnico (Soroban, anchors, SEP-24, flujo Bs→USDC→escrow→retiro) está en el documento
técnico. En el entregable actual **no se programa blockchain**: es solo mockup.

---

## 9. Costos de blockchain vs conversión

Además de la conversión hay **tres costos de red** (todos en XLM). Ninguno lo paga directamente el
usuario ni el negocio: los absorbe la plataforma.

| Costo | En qué se paga | Magnitud | Quién lo asume |
| --- | --- | --- | --- |
| **Conversión** Bs ↔ USDC (anchor) | Bolivianos (spread/margen) | ~1% (el costo real) | Plataforma (vía margen del 1%) |
| **Fees de red** (por transacción) | XLM | Fracciones de centavo (~USD 0,0007) | Plataforma |
| **Reservas de saldo mínimo** (cuentas, trustlines, escrow) | XLM (congelado, se devuelve al cerrar) | Centavos/dólares | Plataforma |
| **Rent de Soroban** (solo con contratos) | XLM (recurrente por estado) | Muy bajo | Plataforma |

- **Fees de red**: fee base de 100 stroops = 0,00001 XLM; una transacción típica cuesta fracciones
  de centavo. Por eso el pitch dice "comisiones de fracciones de centavo": es literal.
- **Reservas**: cada cuenta Stellar exige ~1 XLM de saldo mínimo, cada trustline ~0,5 XLM y cada
  `claimable balance` otra reserva. Ese XLM **no se gasta** (queda congelado y se devuelve al cerrar
  la cuenta). En el modelo custodio se usan pocas cuentas de la plataforma, así que son
  centavos/dólares, no por usuario.
- **Rent de Soroban**: solo si el escrow se implementa con contrato (en vez de `claimable
  balances`); es un costo recurrente por mantener estado persistente.

**Conclusión**: los costos de red son irrelevantes frente a la conversión (~1%) y se absorben en la
comisión del 3% + el margen del 1%. Gracias a las **cuentas patrocinadas**, la plataforma paga el
fee por todos y ni el usuario ni el negocio necesitan XLM.

---

## 10. Infraestructura de MVP (AWS free tier + Neon + serverless)

Stack objetivo del MVP, pensado para costar ~0 dentro del tier gratuito de AWS + Neon.

| Capa | Servicio | Free tier / nota |
| --- | --- | --- |
| **Frontend** (SPA/PWA) | **AWS Amplify Hosting** (o S3 + CloudFront) | Hosting estático gratis + CDN. El demo hoy vive en GitHub Pages |
| **Backend** (API) | **AWS Lambda** + **Function URL** | 1M requests/mes y 400k GB-s/mes gratis |
| **Cron del escrow** (liberar/reembolsar) | **Amazon EventBridge** (regla programada) → Lambda | Programación gratis |
| **Cola / reintentos** | **Amazon SQS** (opcional) | 1M requests/mes gratis |
| **Base de datos** | **Neon** (PostgreSQL serverless) | Tier gratuito (~0,5 GB), sin servidor que mantener |
| **Secretos** (claves Stellar, API keys) | **Parameter Store** (SSM) o variables de entorno cifradas | Gratis |
| **Assets** | **S3** (si no se usa Amplify) | 5 GB gratis (12 meses) |

- **Backend 100% serverless**: Lambda + Function URL atiende la API REST; el **worker** que vigila
  el escrow ("¿se completó el grupo?", "¿venció el plazo?") es un **cron de EventBridge** que
  dispara otra Lambda. No hay servidores que mantener ni pagar en reposo.
- **Webhooks del anchor**: el Function URL es la **URL pública estable** donde el anchor avisa "pago
  recibido" / "reembolso asentado". Los endpoints deben ser **idempotentes**.
- **Neon** como Postgres serverless: escala a cero y no requiere parchear ni respaldar. Si más
  adelante se quiere **Auth incluida** (Google/Apple), evaluar Supabase en vez de Neon.
- **Región**: `sa-east-1` (São Paulo) es la más cercana a Bolivia; el frontend va por CDN, así que
  no sufre latencia.
- **Secretos**: las claves de firma de Stellar y las API keys del anchor nunca van al repo; van en
  Parameter Store o variables de entorno cifradas.
- **Costo esperado**: ~0 durante el MVP; empieza a costar cuando el volumen supera el free tier.

---

## 11. Números oficiales (única fuente)

| Concepto | Valor |
| --- | --- |
| Tasa de referencia | 1 USDC = 10 Bs |
| Comisión de plataforma | 3% |
| Margen de conversión | 1% |
| Comisión de cesión | 2–3% |
| Penalización de retiro | 2% |
| Corte de retiro (últimos días) | 3 días antes del cierre |
| Plazo de llenado | 3 a 15 días (define el negocio) |
| Arrepentimiento | 24 h, sin penalización |
| Reembolso automático | 24–72 h hábiles |

---

## 12. Glosario

- **Oferta:** anualidad publicada por un negocio, dividida en cupos.
- **Cupo:** parte del precio de la anualidad que paga una persona.
- **Ciclo:** ventana de vigencia de la anualidad.
- **Garantía:** fondos bloqueados hasta completar el grupo o devolverlos.
- **Liberación:** paso de los fondos de la garantía al negocio (menos comisión).
- **Código de activación:** QR de un solo uso que el beneficiario muestra una vez en recepción.
- **Activado:** estado del cupo tras confirmar el código; desde ahí manda el sistema del negocio.
- **Cesión:** cambio de titular del cupo, con aprobación del negocio y re-verificación del nuevo.
- **USDC:** dólar digital estable, nativo en Stellar.

---

## 13. Mapa de documentos

| Documento | Para qué sirve |
| --- | --- |
| **`DOCUMENTO-MAESTRO.md`** (este) | Fuente de verdad: concepto, reglas, rentabilidad, seguridad, costos e infraestructura |
| `REGLAS-DE-NEGOCIO.md` | Detalle de reglas (fechas, activación, retiros, cesión, reputación) |
| `idea.md` | Especificación pantalla por pantalla del mockup (histórica; puede quedar desactualizada en algún término) |
| `README.md` | Cómo correr y desplegar el demo |
| `docs/01-pitch-3-minutos.md` | Guion del video |
| `docs/02-prompt-slides-deck.md` | Prompt para generar el deck de 8 slides |
| `docs/03-inscripcion-y-checkin.md` | Detalle del código de activación |
| `docs/04-arquitectura-tecnica-stellar.md` | Cómo funciona de verdad sobre Stellar (futuro) |
| `docs/05-pago-simulado-y-plataforma-ideaton.md` | GitHub, web y dirección de contrato |
| `docs/06-plan-de-cambios.md` | Checklist de pendientes |
