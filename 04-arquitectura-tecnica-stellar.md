# Arquitectura técnica de Afíliame (cómo funciona de verdad, sobre Stellar)

> Documento técnico. Explica el flujo real del dinero: de bolivianos a USDC, la custodia en
> garantía, la entrega al negocio, el retiro a bolivianos pagándose a sí mismo por QR, y el QR que
> ven los usuarios. Incluye la referencia a **Takenos** y el detalle de **por qué Stellar**.

---

## 0. Resumen ejecutivo

Afíliame es una **capa de pagos y garantías**, no un banco ni un exchange. Internamente todo el
dinero es **USDC sobre Stellar**; el usuario piensa y paga en **bolivianos**, y el negocio elige en
qué moneda terminar. Tres piezas hacen el trabajo sucio y el usuario nunca las ve:

1. **Red Stellar**: custodia la garantía (escrow) y registra los movimientos de forma pública.
2. **Anchor / socio de liquidez**: convierte Bs ↔ USDC (entrada y salida) y mueve el dinero por las
   vías locales (QR bancario, transferencia).
3. **Plataforma (backend)**: orquesta flujos, genera los QR, guarda quién es quién y aplica las
   reglas de negocio (comisión 3%, todo-o-nada, reembolso).

El principio rector: **el dinero del cliente jamás toca una cuenta de la plataforma como dueña**;
pasa del pago a una garantía verificable, y de ahí solo sale por liberación al negocio o por
reembolso.

---

## 1. Vista general del flujo de dinero

```text
 USUARIO (Bs)                    ANCHOR / LIQUIDEZ                    RED STELLAR
   paga por QR ──────►  cuenta recaudadora (Bs)  ──convierte──►  USDC en garantía (escrow)
                                                                          │
                                             (grupo se completa)          │ libera
                                                                          ▼
                                                                   USDC ──► billetera del NEGOCIO
                                                                          │  (menos 3% comisión)
   (si no se completa) ◄──── reembolso automático en Bs ◄─────────────────┘
                                                                          │
 NEGOCIO (Bs) ◄── paga un QR (su propia cuenta) ◄── convierte USDC→Bs ◄───┘
```

Todas las flechas de dinero pasan por el **anchor**, que es quien tiene cuentas en bolivianos
(para QR/transferencias) y en Stellar (para USDC). La plataforma **no toca el dinero**: solo ordena
y firma las condiciones.

---

## 2. Los cuatro componentes

### A. Plataforma (backend + base de datos)

- Backend (Spring Boot o Node.js) + PostgreSQL.
- Guarda: usuarios y negocios verificados (KYC), ofertas, cupos, estados, tasas y referencias.
- **Custodia las cuentas Stellar** de usuarios y negocios (custodial en MVP; luego passkeys o un
  custodio regulado). El usuario **no maneja claves ni frases semilla**.
- Firma/ejecuta las operaciones en Stellar con el SDK (JavaScript o Java).

### B. Red Stellar (garantía y registros)

- **USDC nativo** emitido por Circle directamente en Stellar (sin bridges).
- **Escrow** para la garantía, con dos opciones (ver §4).
- **Sponsorship / cuentas patrocinadas**: la plataforma paga las fracciones de centavo de fee de
  red, para que el usuario y el negocio **nunca necesiten XLM**.
- **Path payments / conversión integrada**: cambio de activo atómico en una sola operación.

### C. Anchor / socio de liquidez (Bs ↔ USDC)

- Entidad local autorizada con cuentas bancarias en Bs y cuentas Stellar.
- Expone on/off-ramp con los estándares **SEP-24** (depósito/retiro), **SEP-10** (autenticación) y
  **SEP-12** (KYC).
- Es quien **realmente** convierte: recibe Bs por QR/transferencia y emite el USDC equivalente (o al
  revés, quema/retira USDC y entrega Bs).

### D. QR bancario (Bolivia)

- El QR que ven los usuarios es un **QR Simple / interoperable** (formato EMVCo que usan las apps
  bancarias bolivianas), generado de forma **dinámica** por la plataforma.
- El QR que paga el negocio al retirar es el **QR de su propia cuenta** (el "págate a ti mismo").

---

## 3. Flujo detallado paso a paso

### Paso 1 — El usuario paga en bolivianos por QR (entrada)

1. Al reservar un cupo, la plataforma **genera un QR dinámico** con:
   - destino: la **cuenta recaudadora en Bs del anchor** (no la cuenta del negocio, porque el dinero
     debe pasar por la garantía);
   - monto exacto en Bs;
   - una **referencia única** (id del cupo) para reconciliar;
   - una **vigencia corta** (p. ej. 5 minutos). Al expirar, se regenera con nueva referencia.
2. El usuario escanea con su app bancaria y paga.
3. El anchor confirma la acreditación por webhook a la plataforma.
4. El anchor **convierte Bs → USDC** a la tasa pactada y deposita el USDC en la **garantía**.

> **Nota sobre el QR dinámico**: un QR estático (monto 0 o fijo) no sirve, porque cada pago tiene
> monto y referencia distintos y debe vencer. Por eso el prototipo actual dibuja un QR de ejemplo
> (`AFILIAME-QR|...`); en producción se reemplaza por la generación real vía el anchor/red QR.

### Paso 2 — Conversión Bs → USDC y entrada a garantía

- La conversión la hace el **anchor** (no la plataforma). La plataforma recibe la confirmación de
  "X Bs recibidos → Y USDC depositados en la garantía".
- El **precio en Bs queda fijado al reservar**: el usuario no asume riesgo cambiario. El riesgo lo
  absorbe el anchor o un margen de conversión (en el ejemplo, 1%).

### Paso 3 — Custodia en garantía (escrow)

Dos formas de implementarlo, en orden de madurez:

1. **Claimable balance con condiciones (MVP recomendado)**: una operación nativa de Stellar que
   bloquea un pago y permite reclamarlo solo si se cumplen **condiciones de tiempo y cofirmantes**.
   La plataforma es cofirmante: libera solo cuando el grupo se completa, o devuelve al vencer.
   Es simple, barato y **no requiere escribir un contrato**.
2. **Contrato Soroban (fase avanzada, más confianza)**: un contrato en Rust/WASM que impone
   *"N depósitos antes de la fecha límite, o reembolso automático"* sin depender de la plataforma.
   Cualquiera puede leer la lógica en la cadena. Es la opción que mejor responde a "cualquiera puede
   verificar", pero cuesta más construirlo y auditarlo.

**Recomendación**: para el ideatón y el primer piloto, `claimable balance` + cofirma de la
plataforma. Para producción con liberación escalonada y reembolso 100% no custodial, migrar a
Soroban.

### Paso 4 — Liberación al negocio

- Al pagarse el **último cupo**, la plataforma ejecuta la liberación:
  1. El escrow paga el USDC a la **billetera custodial del negocio**, **menos la comisión del 3%**
     (se hace en la misma operación: un `payment` con split, o un contrato que reparte).
  2. Se notifica al negocio: "recibiste 174,6 USDC".
- Si vence el plazo sin completarse, la misma condición dispara el **reembolso automático** de cada
  pago a su origen (el anchor lo convierte de vuelta a Bs y lo devuelve por la vía original).

### Paso 5 — El negocio retira USDC → Bs "pagándose a sí mismo por QR"

Este es el patrón de salida (off-ramp) y es exactamente lo que hace **Takenos** con su billetera:

1. El negocio abre, en su app bancaria, el **QR de "cobrar" de su propia cuenta** (un QR Simple con
   su cuenta como destino).
2. Escanea ese QR con Afíliame (o lo sube). La app lee el destino y el monto.
3. La plataforma pide al **anchor** convertir el monto necesario de **USDC → Bs** y **pagar a ese
   QR**, que apunta a la cuenta del propio negocio.
4. Resultado: el negocio **se paga a sí mismo** — convierte sus dólares digitales a bolivianos en su
   banco, sin depender de una cuenta en dólares.

Esto es la misma pantalla **"Pagar a un QR"** (M8 del prototipo), solo que el QR destino es la cuenta
del propio negocio en lugar de la de un proveedor. Es un off-ramp elegante: reutiliza la red de QR
ya masiva en Bolivia como puente hacia la cuenta bancaria.

### Paso 6 — El QR que ven los usuarios (entrada, dinámico)

- **A dónde apunta**: a la cuenta recaudadora del anchor/plataforma (nunca al negocio), para que el
  dinero entre a la garantía.
- **Cómo se genera**: el backend arma el payload EMVCo/QR Simple con monto + referencia + TTL corto,
  lo firma/valida contra la red QR y devuelve el código. Al vencer, se regenera.
- **Qué ve el usuario**: solo "escanea con tu banco" y el monto. Nada de claves ni comisiones de red.

---

## 4. Takenos como referencia (qué copiamos y qué cambia)

**Takenos** es una billetera real (LatAm) que hace, en esencia, lo que queremos con la billetera del
negocio:

- Recibe **USD** (da datos bancarios de EE. UU. y un IBAN europeo).
- Guarda el saldo en **stablecoins** (USDC) y deja **convertir a moneda local**.
- Permite **retirar a banco local** y **pagar por QR en moneda local**.
- La persona **no toca cripto**: ve "saldo en dólares" y "pagar/retirar".

**Qué copiamos**:
- El patrón **"saldo en USDC → convertir → pagar por QR en moneda local"** como off-ramp.
- El **"págate a ti mismo por QR"** para convertir dólares a bolivianos en la propia cuenta.
- La experiencia **sin cripto**: saldo, historial y tres acciones (mantener / retirar / pagar QR).

**Qué es distinto en Afíliame**:
- Takenos resuelve **ingresos de trabajadores/exportadores**; Afíliame resuelve la **garantía de un
  grupo** (escrow todo-o-nada) para **negocios de servicios locales**.
- Nuestro punto crítico es la **garantía verificable antes de cobrar**, no solo el on/off-ramp.
- Todo corre sobre **Stellar** (USDC nativo + Soroban + anchors), que es el requisito del reto.

> Verifica los detalles puntuales de Takenos en su documentación vigente (términos, tarifas y
> países) antes de citarlos en el pitch; aquí se usa como **patrón de referencia**, no como copia.

---

## 5. Por qué Stellar (detalle técnico)

| Necesidad de Afíliame | Qué aporta Stellar | Dato concreto |
| --- | --- | --- |
| Garantía "todo o nada" con reembolso automático | Escrow programable (claimable balances o Soroban) que ninguna parte altera a su gusto | Soroban (Rust/WASM), en mainnet desde feb. 2024 (Protocol 20) |
| Prueba pública de los fondos | Todo movimiento es verificable en un explorador | stellar.expert / Horizon API |
| Cupos pequeños (Bs 400–600) | Comisiones de fracciones de centavo | ~USD 0,0007 típico; nativos ~400 stroops (~USD 0,000005) |
| Dinero estable para el negocio | **USDC nativo** emitido por Circle directamente en Stellar, **sin bridges** | Circle emite USDC y EURC en Stellar |
| Conversión Bs ↔ USDC | Anchors + path payments (conversión atómica) + DEX integrado | Estándares SEP-24/SEP-10/SEP-12 |
| El usuario no debe manejar cripto | Cuentas patrocinadas (sponsorship): la plataforma paga el fee de red | El usuario nunca necesita XLM |
| Cumplimiento | Controles a nivel de activo (freeze/clawback flags) para USDC regulado | Nativos del protocolo, sin lógica por contrato |
| Velocidad | Confirmación en segundos | Finalidad ~5 s |

**Desventaja honesta** (decirla si preguntan): el ecosistema de DeFi de Stellar es más chico que el
de Ethereum/Solana. Para Afíliame **no importa**, porque no vendemos rendimiento: vendemos pagos y
garantías, que es exactamente para lo que Stellar está optimizado.

---

## 6. Seguridad y custodia (resumen)

- **MVP**: cuentas custodiales creadas por el backend; claves en un gestor de secretos (HSM/KMS).
- **Futuro**: billeteras con **passkeys** o un custodio regulado.
- **KYC obligatorio** para negocios y usuarios antes de pagar.
- **Fondos de garantía intocables**: nunca se usan para rendimiento ni se mueven con otro fin.
- **Custodia real = carga regulatoria**: validar con abogado antes de producción (ya está anotado en
  el `idea.md` como pendiente).

---

## 7. Devoluciones: quién manda el dinero, el destino y el riesgo de cambio

### 7.1 Siempre hay una entidad con cuenta de banco detrás: el anchor

Afíliame **no toca el dinero de nadie**. Quien ejecuta cada conversión y cada pago es el **anchor
(socio de liquidez)**: una entidad local regulada con dos piernas — **cuentas de banco en Bs** (la
recaudadora y la de pagos) y **cuentas Stellar con USDC**. Sin esa entidad no hay ni depósito ni
retiro ni devolución.

### 7.2 Los dos QR y a dónde apuntan (el patrón Takenos)

| Flujo | QR | Destino real |
| --- | --- | --- |
| **Depositar** (Bs → USDC) | El QR de Afíliame | Cuenta recaudadora en Bs **del anchor** |
| **Retirar** (USDC → Bs) | El QR de **la cuenta del propio usuario** | La cuenta bancaria del usuario |

Es exactamente lo que hace Takenos: su QR apunta a una cuenta que Takenos (o su banco asociado)
controla. **Siempre hay una cuenta de banco detrás.**

### 7.3 Destino de devolución: cuenta bancaria, no QR

Para devoluciones, el usuario **no guarda un "QR con monto válido un año"** (un QR dinámico vence
en minutos). Guarda una **cuenta bancaria** (banco + número, a su nombre), que es lo que el QR
codifica por debajo. La cuenta no vence; el QR solo es una forma de *leer* esa cuenta al momento de
pagar o retirar.

- El usuario registra la cuenta al crear su cuenta o al primer pago.
- La plataforma valida que la cuenta esté a su nombre (titularidad), igual que el NIT del negocio.
- El monto de la devolución lo define la plataforma; no se necesita un QR con monto.

### 7.4 Cómo se ejecuta cada devolución (misma mecánica)

```
garantía (USDC en Stellar)
        │  la plataforma ordena el reembolso
        ▼
anchor: recibe el USDC → convierte a Bs → paga a la cuenta del usuario
```

| Devolución | Disparador | Recibe el usuario |
| --- | --- | --- |
| Grupo no se llena | Vence la garantía (todo-o-nada) | 100% en Bs a su cuenta |
| El usuario retira | Reglas de retiro (24 h / 2% / solo cesión) | Bs menos penalización si aplica |
| Cesión | Aprobación del negocio | El pago del comprador reemplaza el suyo, menos 2–3% |

### 7.5 Riesgo de cambio: el usuario nunca recibe "otra cantidad"

El usuario pagó Bs 600 → 60 USDC a tasa R1 → en garantía. Al devolver, esos 60 USDC se convierten a
Bs a la tasa **actual** (R2):

| R2 al devolver | Los 60 USDC valen | Diferencia |
| --- | --- | --- |
| 10 (igual) | Bs 600 | 0 |
| 11 (Bs se debilitó) | Bs 660 | +60 a favor del anchor |
| 9,5 (Bs se fortaleció) | Bs 570 | −30 en contra |

**Regla: el usuario siempre recibe Bs 600.** El +60 o el −30 lo absorbe la plataforma con el anchor,
financiado por el **3%** (comisión), el **1%** (margen de conversión) y el **2%** (penalización de
retiro). Por eso la penalización no es un castigo: cubre la conversión de ida y vuelta más el riesgo
de cambio.

---

## 8. Glosario técnico breve

- **USDC**: dólar digital estable de Circle, nativo en Stellar.
- **Escrow / garantía**: fondos bloqueados hasta cumplir una condición.
- **Claimable balance**: operación nativa de Stellar que deja un pago reclamable bajo condiciones.
- **Soroban**: plataforma de contratos inteligentes de Stellar (Rust/WASM).
- **Anchor**: entidad que conecta dinero local con la red (on/off-ramp).
- **SEP-24 / SEP-10 / SEP-12**: estándares de Stellar para depósito/retiro, autenticación y KYC.
- **Path payment**: operación que convierte entre activos de forma atómica.
- **Sponsorship**: patrocinio de cuentas para que el usuario no pague fees de red.
- **QR Simple / EMVCo**: formato de QR bancario interoperable en Bolivia.
