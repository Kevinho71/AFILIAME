# Reglas de negocio de Afíliame

Documento de referencia del modelo. Define qué es un cupo, cuándo lleva fechas y qué se decide en
cada tipo de negocio. El prototipo del front implementa estas reglas.

---

## 1. Principios

1. **La anualidad es una promesa de capacidad para un ciclo.** El negocio vende su capacidad durante
   un ciclo (normalmente un año) a un precio anual.
2. **El cupo es la parte del precio que paga una persona.** El cupo reparte el costo, no
   necesariamente el tiempo.
3. **Regla central de fechas: un cupo lleva fechas solo si el uso es exclusivo**, es decir, si dos
   beneficiarios **no** pueden usar el mismo recurso al mismo tiempo.
4. **Todo o nada.** Si no se completan los cupos antes del plazo, cada pago vuelve a su origen.
5. **Garantía.** El dinero espera en garantía hasta que el grupo se completa (o hasta que se
   devuelve). Nunca se usa para otro fin.
6. **Registro nominal.** Cada cupo está a nombre de una persona identificada; el cupo no se
   transfiere sin aprobación del negocio.

## 2. Tipos de uso de un cupo

| `usage` | Cuándo aplica | ¿Lleva fechas? | Qué coordina el negocio |
| --- | --- | --- | --- |
| **compartido** | El servicio admite varias personas a la vez (aforo o capacidad de atención) | **No** | Aforo, horarios, reservas de clase, reglas de convivencia |
| **franja** | El acceso se reparte por franjas (mañana, tarde, noche) para ordenar la demanda | **No** (la franja vale todo el ciclo) | Aforo por franja y por clase |
| **exclusivo** | El recurso solo puede ser de una persona a la vez (escritorio fijo, lugar asignado, habitación) | **Sí** (periodo) | Asignación del recurso y traspasos |

### Pregunta de decisión

> ¿Dos beneficiarios de la misma oferta pueden estar usando el servicio **al mismo tiempo y en el
> mismo recurso**?

- **Sí** → `compartido` (o `franja`, si el negocio quiere ordenar la demanda). **Sin fechas.**
- **No** → `exclusivo`. **Con periodo**, porque el recurso hay que repartirlo en el tiempo.

La decisión es del **negocio**: publica la oferta y elige cómo dividirla. El modelo no impone fechas
donde no hacen falta.

## 3. El caso que originó la regla

> Cuatro personas compran la anualidad y las cuatro deciden ir de enero a abril.

- Si el servicio **admite varias personas a la vez** (gimnasio, piscina, parqueo rotativo, clases con
  aforo), esto es **totalmente válido**: el negocio ya cobró el año completo por adelantado y las
  cuatro personas usan el servicio cuando quieran, dentro del aforo y del horario.
- **Los cupos no deben mostrar fechas** en ese caso: el cupo es “una parte del precio”, no “4 meses
  del año”. Cualquier coordinación (aforo en horas pico, reserva de clase) es **operativa** y se
  resuelve con el negocio, no con un contrato de fechas.
- Si el negocio **no quiere picos** o su capacidad es limitada en ciertas horas, puede publicar
  **franjas** (`franja`) o, si el recurso es único, **periodos** (`exclusivo`). Sigue siendo su
  decisión, no un requisito del modelo.

## 4. Análisis por caso de negocio

| Caso | Uso | Fechas | Comentario de implementación |
| --- | --- | --- | --- |
| **Gimnasio** (musculación, clases) | compartido | No | Aforo por hora; el negocio puede limitar horas pico. Clases con reserva previa. |
| **Gimnasio con franjas de baja demanda** | franja | No | Se vende la franja completa del ciclo a precio menor para llenar horas valle. |
| **Piscina / club** | compartido | No | Aforo de la piscina y del solárium; temporada alta se regula en recepción. |
| **Academia de baile / clases grupales** | franja | No | El aforo es por clase; la franja ordena la demanda y evita horas muertas. |
| **Estudio de yoga** | compartido | No | Reserva de clase por aforo del salón. |
| **Parqueo con lugar rotativo** | compartido | No | El beneficiario entra cuando lo necesita, sujeto a disponibilidad; no hay lugar fijo. |
| **Parqueo con lugar fijo asignado** | exclusivo | Sí | Un lugar no puede ser de dos autos a la vez; se reparte por periodos. |
| **Coworking: escritorio fijo** | exclusivo | Sí | El escritorio es de una persona por periodo. |
| **Coworking: sala de reuniones / puesto libre** | compartido o franja | No | Se reserva por horas; el aforo limita la simultaneidad. |
| **Locker, habitación, cancha con horario fijo** | exclusivo | Sí | Recurso único en el tiempo; se reparte por periodo o franja reservada. |

### Regla derivada para el negocio

- Si el recurso es **único** (un escritorio, un lugar asignado, una habitación), el negocio **debe**
  dividir por periodos: es la única forma de que los cupos no se pisen.
- Si el recurso es **capacidad** (aforo, atención, máquinas, piscina), no hay razón para poner
  fechas: se puede ofrecer uso compartido y, si quiere ordenar la demanda, franjas.

## 5. Efectos en el producto

| Regla | Efecto en la app |
| --- | --- |
| Sin fechas en uso compartido y franja | El cupo se llama “Cupo 1, 2, 3” o “Franja mañana…”, y la interfaz nunca muestra fechas de uso |
| Cupo con periodo | Solo en `exclusivo`; la interfaz muestra “Del dd/mm/aaaa al dd/mm/aaaa” |
| Vigencia del ciclo | La oferta declara la vigencia de la anualidad (inicio y fin) y el pase la muestra |
| Liberación escalonada | Solo tiene sentido con periodos: requiere `usage = exclusivo`. Con uso compartido la liberación es completa al completar el grupo |
| Franja horaria | El cupo lleva la franja (por ejemplo “07:00 a 10:00”) y vale todo el ciclo |
| Privacidad entre clientes | Nunca se muestra quién ocupa los otros cupos: solo el agregado (“2 de 3 cupos ocupados”) y una barra dividida |
| Cesión de cupo | Requiere aprobación del negocio y re-verificación del nuevo titular. No es un token transferible: es un cambio de titular gobernado |
| Retiro del pago | Antes del cierre: gratis en las primeras 24 h, con 2% de penalización después, y en los últimos 3 días solo por cesión. Un cupo ya liberado no tiene reembolso |
| Reembolsos | Grupo incompleto: reembolso total. Periodo ya iniciado: sin reembolso |
| Activación del cupo | Código de un solo uso que se escanea una vez en recepción; al confirmar la identidad queda inutilizable y de ahí el negocio usa su propio control de acceso |
| Aforo y reservas | Se resuelven como reglas del negocio y operación diaria, no como fechas del contrato |

## 6. Preguntas abiertas (a validar con negocios)

1. ¿Cuántos cupos puede vender un negocio por encima de su capacidad real? (riesgo de sobreventa de
   aforo en un mismo mes.)
2. ¿El negocio quiere un tope de usos simultáneos por cupo para controlar el aforo en picos?
3. ¿Se cobra algo por inasistencia prolongada (no-show) o el cupo vence con el ciclo, sin castigo?
4. ¿Las franjas se renuevan por ciclo o se reasignan si la demanda cambia a mitad de año?
5. ¿Se permite cambiar de franja a mitad de ciclo, y con qué aprobación?

## 7. Glosario

- **Anualidad:** precio total por el ciclo completo que el negocio pone a la venta.
- **Ciclo:** ventana de vigencia de la anualidad (por ejemplo, 01/11/2026 al 31/10/2027).
- **Cupo:** parte del precio de la anualidad que paga una persona beneficiaria.
- **Cupo compartido:** cupo sin fechas; el servicio admite uso simultáneo.
- **Franja:** cupo que reserva una ventana horaria del ciclo, sin fechas de calendario.
- **Periodo exclusivo:** cupo con fechas, porque el recurso solo puede usarse por una persona a la vez.
- **Garantía:** dinero retenido hasta completar el grupo o devolverlo.
- **Código de activación:** QR de un solo uso que el beneficiario muestra una vez en recepción.
  Al confirmar la identidad queda inutilizable y el negocio inscribe al beneficiario en su sistema.
- **Activado:** estado del cupo después de que el negocio escaneó y confirmó el código de
  activación. Desde ese momento el acceso lo gestiona el negocio con su propio método.

---

## 8. Activación del cupo (código de un solo uso)

**Objetivo.** Afíliame es dueño del dinero y de la verificación de "quién pagó y tiene derecho".
El negocio es dueño de todo lo operativo del acceso. El puente entre ambos es un **código de
activación de un solo uso**, no una credencial de acceso reutilizable: así no imponemos un sistema
de asistencia paralelo al que ya usa el negocio.

**Flujo.**

1. Al liberarse la garantía, cada cupo pasa a estado `emitido` y su beneficiario recibe el código
   de activación (QR estático, un solo uso).
2. La primera vez que va, el beneficiario muestra el código en recepción.
3. El negocio escanea el código y ve **nombre, identidad verificada y vigencia** (no montos).
4. Si la persona coincide, el negocio pulsa **Confirmar activación**. Recién ahí el código se
   **quema** (inutilizable) y el cupo pasa a `activado`.
5. El negocio inscribe al beneficiario con su propio método (huella, tarjeta perforable, lista…).

**Reglas de robustez.**

- El código se quema al **confirmar**, no al escanear: un escaneo fallido o de la persona equivocada
  no lo invalida.
- Solo hay un código activo no usado por cupo. Si el beneficiario lo pierde o expira, se reemite y
  el anterior se invalida.
- Compartir el código no sirve: al escanear se muestra la identidad del titular y el negocio no
  confirmaría a un extraño.
- "Vendido pero no activado" es solo un seguimiento operativo del negocio, no un reembolso.

## 9. Retiro del dinero (mientras el grupo se llena)

Un pago en garantía puede retirarse según la fase:

| Fase | ¿Puede retirar? | Condición |
| --- | --- | --- |
| Primeras **24 h** tras pagar | Sí, gratis | Arrepentimiento (protección al consumidor) |
| Después de 24 h, **hasta 3 días antes del cierre** | Sí, con penalización | 2% del precio del cupo |
| **Últimos 3 días** antes del cierre | No | Solo cesión |
| Grupo completo / fondos liberados | No | Solo cesión con aprobación del negocio |
| Periodo en curso o terminado | No | Nada |

- La penalización del 2% cubre el costo real de revertir la conversión y devolver el dinero; no es
  un castigo.
- Al retirar, el cupo **vuelve a quedar disponible** para otra persona. Los demás miembros del grupo
  no se ven perjudicados: si el grupo no se completa, reciben reembolso total de todos modos.
- Por eso los últimos 3 días son solo cesión: un retiro tardío casi seguro hunde el grupo y le hace
  perder tiempo a todos.

## 10. Cesión de cupo (cómo se transfiere)

La cesión **no es un NFT** ni un token al portador. Es un **proceso gobernado**:

1. El vendedor publica su cupo con un precio igual o menor al original (evita especulación).
2. El **negocio aprueba** (tiene la última palabra sobre quién entra).
3. El comprador paga y la plataforma **verifica su identidad**.
4. Se cambia el titular (registro nominal) y se reemite el código de activación a nombre del nuevo.

Dos casos de dinero:

- **Antes de completar el grupo**: el pago del comprador reemplaza al del vendedor en el mismo cupo;
  al vendedor se le devuelve su dinero.
- **Después de liberar**: el negocio ya cobró, así que le es indiferente quién ocupa el cupo; el
  comprador paga directo al vendedor (vía la garantía de la plataforma) y la plataforma cobra el
  2–3% de cesión que paga quien cede.

## 11. Reputación

- **Clientes: sin reputación pública.** Cualquiera puede participar en cualquier oferta. Solo se
  mantiene un guardrail anti-abuso invisible: más de 2 reembolsos sin justificación en 90 días
  suspende la reserva automática y exige verificación manual.
- **Negocios: sí hay calificación.** El cliente necesita decidir entre opciones, así que la calidad
  de servicio del negocio sí se califica.
