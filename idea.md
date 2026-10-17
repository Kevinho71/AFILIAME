Cupos: anualidades compartidas con pago garantizado sobre Stellar
Documento de concepto y especificación para un prototipo visual (mockups) · Borrador v1 · 17 de octubre de 2026
0. Cómo usar este documento
Este documento explica la idea completa: qué es, para quién, cómo funciona el dinero, por qué usa blockchain y cómo debe verse. El entregable actual no es un producto funcional: es una interfaz gráfica navegable que simula todo con datos falsos. No hay backend, ni pagos reales, ni llamadas reales a Stellar. Lo que se evalúa es la claridad de la idea.
Nombre de trabajo: Cupos (provisional).
Para un agente que construya los mockups: leer las secciones 1 a 11 para entender el producto, ejecutar las secciones 12 a 16, y respetar los criterios y prohibiciones de la sección 21.
1. La idea en un párrafo
Un negocio con servicios de uso por tiempo (gimnasio, coworking, club con piscina, academia) publica su anualidad dividida en cupos: por defecto 3 cupos de 4 meses, o 3 franjas horarias a lo largo del año. Personas distintas compran cada cupo y pagan solo su parte, por QR bancario en bolivianos. Los pagos quedan en una garantía sobre la red Stellar mientras el grupo se llena. Si se completan los cupos antes del plazo, el dinero se libera al negocio de una vez, como una anualidad pagada por adelantado. Si no se completan, todo se devuelve automáticamente. El negocio recibe en una billetera en USDC y decide qué hacer: mantenerlo, retirarlo a su banco en bolivianos o pagar con ese saldo a cualquier QR. Nadie necesita saber de criptomonedas.
2. El problema
• Negocio: la anualidad da efectivo inmediato y reduce abandono, pero muchos clientes no pueden pagarla completa. La mensualidad es más cara para el cliente y deja ingresos inciertos.
• Usuario: la tarifa anual es más barata, pero exige pagar y comprometerse todo el año. Mucha gente solo necesita 3 o 4 meses (un proyecto, una temporada, un semestre).
• Mercado: las anualidades que no se usan se pierden. La reventa informal por redes sociales es insegura: estafas, sin garantía y sin consentimiento del negocio.
• Confianza: entre desconocidos nadie quiere pagar primero, y el negocio quiere certeza de cobro antes de inscribir gente.
3. La solución y su propuesta de valor
Diferenciadores:
1. Venta primaria autorizada: el negocio crea la oferta, así que no hay problema de cesión de contrato.
2. Todo o nada: nadie paga a ciegas; si el grupo no se llena, se devuelve todo.
3. Garantía verificable: cualquiera puede comprobar que los fondos están bloqueados.
4. Flexibilidad de moneda: el usuario paga en bolivianos; el negocio elige cómo recibir.
Actor
Qué gana
Negocio
Cobra la anualidad completa por adelantado, llena capacidad ociosa, capta clientes que no comprarían una anualidad, elige moneda y destino de sus fondos
Usuario
Tarifa anual con compromiso corto y pago fraccionado; dinero protegido; acceso con pase digital
Plataforma
Comisión por cupo vendido y por servicios de conversión
4. Glosario
Término
Significado
Oferta
Anualidad publicada por un negocio, dividida en cupos
Cupo
Una parte de la oferta, con periodo o franja y precio propios
Periodo / franja
Intervalo de uso del cupo (ej. mayo a agosto) o franja horaria (mañana, tarde, noche)
Beneficiario
Persona inscrita nominalmente para usar un cupo
Garantía
Fondos bloqueados (escrow) hasta que se llene la oferta o venza el plazo
Plazo de llenado
Fecha límite para completar todos los cupos
Liberación
Paso de los fondos de la garantía al negocio. Puede ser completa (todo al llenarse) o escalonada (cada cupo al iniciar su periodo)
Sello Pago Protegido
Distintivo de ofertas con liberación escalonada
Saldo del negocio
USDC en la billetera del negocio
Pase digital
Credencial con QR que el beneficiario muestra para acceder
USDC
Dólar digital estable emitido por Circle, disponible de forma nativa en Stellar
5. Actores y roles
5.1 Usuario (comprador y beneficiario)
• Objetivo: usar un servicio anual pagando menos y por menos tiempo.
• Dolores: no puede pagar una anualidad completa; desconfía de pagar a desconocidos.
• Hace: explora ofertas, reserva un cupo, paga por QR, espera que el grupo se llene, recibe su pase, usa el servicio, cede el cupo si ya no lo necesita.
• Ve: precios en bolivianos, estado de la garantía, pase digital. Nunca ve claves, comisiones de red ni términos técnicos obligatorios.
5.2 Comerciante (dueño del negocio)
• Objetivo: cobrar por adelantado, llenar capacidad y captar clientes nuevos sin descontar a los actuales.
• Dolores: impagos, clientes que abandonan, flujo de caja irregular, dificultad para conseguir dólares.
• Hace: crea ofertas, define reglas, ve quién compró, recibe la liberación, decide el destino de sus fondos, valida accesos.
• Sub-rol Validador (recepción): solo puede escanear pases y consultar si un beneficiario está habilitado.
5.3 Plataforma (operación)
• Aprueba negocios, resuelve disputas, administra comisiones y la tasa de referencia. Su consola queda fuera del alcance del mockup.
5.4 Socios y sistemas externos
• Red de pagos QR bancaria: recibe los pagos en bolivianos del usuario y permite pagar a QR de terceros.
• Proveedor de liquidez o anchor: convierte entre bolivianos y USDC.
• Red Stellar: custodia las garantías y registra los movimientos.
• Pagador externo (opcional): persona fuera del país que paga un cupo en USDC para un familiar.
6. Flujo de funcionamiento de extremo a extremo
1. El negocio se registra y es verificado (identidad del dueño, datos del negocio, cuenta bancaria de destino).
2. Publica una oferta: precio anual, número de cupos, periodos o franjas, plazo de llenado, tipo de liberación y reglas de uso.
3. La oferta aparece en el feed con barra de cupos llenos y tiempo restante.
4. El usuario reserva un cupo y paga su parte por QR bancario en bolivianos.
5. La plataforma convierte ese pago a USDC y lo deposita en la garantía en Stellar. El usuario ve "Tu pago está en garantía".
6. El grupo se va llenando. Cada reserva actualiza el progreso. Hay recordatorios a las 48 y 24 horas del plazo.
7. Si se llenan todos los cupos antes del plazo: se libera la garantía al negocio, que inscribe a los beneficiarios y emite sus pases.
8. Si vence el plazo sin llenarse: cada pago se devuelve automáticamente a su origen.
9. El negocio decide qué hacer con su saldo: mantener, retirar a su banco o pagar a un QR.
10. Durante el periodo, el beneficiario muestra su pase y el negocio lo valida.
11. Al finalizar, se cierra la oferta y se habilita la calificación mutua.
6.1 Estados de una oferta
Estado
Significado
Siguiente
Borrador
El negocio la edita
Publicada
Publicada
Visible, sin cupos pagados
Llenándose
Llenándose
Hay al menos un cupo pagado
Completa o Vencida
Completa
Todos los cupos pagados
Liberada
Liberada
Fondos entregados al negocio
En curso
En curso
Periodos de uso activos
Finalizada
Finalizada
Todos los periodos terminaron
Cerrada
Vencida
Plazo sin completarse
Reembolsada
Reembolsada
Todos los pagos devueltos
Cerrada
Cancelada
El negocio la retiró antes de llenarse
Reembolsada
6.2 Estados de un cupo
Disponible, Reservado (pago pendiente), Pagado en garantía, Activo, Finalizado, Reembolsado, En cesión.
6.3 Eventos y su efecto
Evento
Efecto en el dinero
Notificación
Usuario paga el QR
Se convierte y entra a garantía
Usuario: "Cupo reservado"; Negocio: "Nuevo cupo"
Último cupo pagado
Se libera la garantía (completa) o se programa (escalonada)
Todos: "Grupo completo"
Vence el plazo
Reembolso automático
Usuarios: "Te devolvimos tu pago"
Negocio cancela
Reembolso automático
Usuarios y plataforma
Inicia un periodo (liberación escalonada)
Se libera el cupo correspondiente
Negocio
Usuario cede su cupo
Sin movimiento hasta que haya comprador
Negocio: solicitud de aprobación
7. Reglas de negocio
1. Precio por cupo = precio anual ÷ número de cupos, con descuento anual aplicado. El usuario siempre ve el ahorro frente a la tarifa mensual.
2. Plazo de llenado: entre 3 y 15 días, definido por el negocio.
3. Todo o nada: sin cupos completos al vencer, hay reembolso total, sin cargo para el usuario.
4. Registro nominal: cada cupo se asigna a una persona identificada; el pase no es transferible sin aprobación del negocio.
5. Liberación: completa (por defecto) o escalonada. La escalonada protege más al usuario y otorga el Sello Pago Protegido, filtrable en el feed.
6. Fondos de garantía intocables: el dinero en garantía de los clientes nunca se usa para generar rendimiento ni se mueve con otro fin.
7. Abandono: un cupo ya liberado no se reembolsa; el beneficiario puede cederlo si el negocio aprueba.
8. Cesión de cupo: requiere aprobación del negocio y tiene precio máximo igual al precio original (evita especulación).
9. Cancelación por el negocio después de la liberación: se activa el proceso de disputa y se penaliza su reputación.
10. Verificación de identidad obligatoria para negocios y para usuarios antes de pagar.
11. Comisión de plataforma: entre 2,5% y 3,5% sobre la oferta (ejemplo 3%), cobrada al negocio y descontada en la liberación. El usuario nunca paga comisión adicional por su cupo.
12. Reputación: calificaciones de ambas partes; los negocios con historial limpio acceden a beneficios.
7.1 Devoluciones, cancelaciones y cesiones
El dinero en garantía solo puede salir por reembolso o por liberación al negocio. El usuario no retira su cupo mientras está en garantía.
Etapa
Qué puede hacer el usuario
Reembolso
Penalización
Grupo incompleto
Cancelar su reserva
Total, a su origen
Ninguna
Primeras 24 horas tras pagar
Cancelar
Total
Ninguna, aunque el grupo ya esté completo
Grupo completo, garantía no liberada
Cancelar solo con aprobación del negocio, o ceder
Total si el negocio aprueba
Ninguna
Garantía liberada, periodo no iniciado
Ceder el cupo
No hay reembolso automático
Comisión de cesión de 2% a 3%
Periodo en curso o terminado
Nada
No aplica
No aplica
1. Ventana de arrepentimiento de 24 horas tras el pago, sin penalización. El plazo final debe validarse con un abogado según la protección al consumidor en Bolivia.
2. Reserva no pagada: el cupo vuelve a estar disponible cuando vence el QR, sin cargo.
3. Reembolso en la moneda de pago: los pagos en Bs se devuelven en Bs a la cuenta o QR de origen. La plataforma absorbe la diferencia de tipo de cambio y no cobra comisión de devolución al usuario.
4. Tiempo de devolución: entre 24 y 72 horas hábiles, mostrado en la pantalla de pago y en el comprobante.
5. Cesión de cupo: requiere aprobación del negocio. El precio máximo es el precio original del cupo. La comisión de cesión la paga quien cede.
6. Cancelación por el negocio de una oferta llena: todos los usuarios reciben reembolso total. El negocio paga una penalización de 10% del monto liberado (propuesta) y registra una incidencia en su reputación.
7. Incumplimiento del negocio (no abre el periodo o no presta el servicio): el usuario reclama en disputa. La plataforma reembolsa los periodos no prestados y puede retener la liberación de los periodos pendientes.
8. No asistencia del usuario: sin reembolso del periodo ya iniciado. El cupo vence sin cargo adicional.
9. Abuso de reservas: más de 2 reembolsos sin justificación en 90 días suspende la reserva automática y requiere verificación manual.
10. Fraude o pago disputado: el reembolso se retiene mientras se investiga, con aviso al usuario y al negocio.
8. Conversiones de dinero
Principio: el usuario piensa y paga en bolivianos; dentro del sistema el dinero es USDC; el negocio decide en qué moneda quiere terminar. Los valores de abajo son ficticios, solo para el mockup: 1 USDC = 10 Bs, comisión de plataforma 3%, margen de conversión 1% por cada conversión.
8.1 Ejemplo numérico
Oferta de gimnasio: anualidad de 1.800 Bs en 3 cupos.
Paso
Cálculo
Resultado
Precio por cupo
1.800 ÷ 3
600 Bs
Ahorro del usuario
Mensual 200 Bs × 4 = 800 Bs frente a 600 Bs
25%
Conversión de entrada
600 Bs a 10 Bs/USDC, incluido el margen
60 USDC a garantía
Total en garantía
60 × 3
180 USDC
Comisión de plataforma (3%)
180 × 0,03
5,4 USDC
Liberación al negocio
180 − 5,4
174,6 USDC
Si retira todo a su banco
174,6 × 10 menos 1%
aprox. 1.728 Bs
8.2 Escenarios de conversión
Escenario
Qué ocurre
Qué ve la persona
Usuario paga por QR en Bs
El socio de liquidez convierte Bs a USDC y se deposita en la garantía
"Pagaste 600 Bs"
Usuario paga en USDC (exterior)
Entra directo a la garantía, sin conversión
Monto en USDC y equivalente en Bs
Liberación al negocio
USDC pasa de la garantía a la billetera del negocio, menos comisión
"Recibiste 174,6 USDC (aprox. 1.746 Bs)"
Negocio retira a su banco
USDC se convierte a Bs y se transfiere a su cuenta
Cotización, comisión, monto neto y tiempo estimado
Negocio paga a un QR
Se convierte el monto necesario de USDC y se paga en Bs al QR
Monto del QR, USDC descontados y comisión
Reembolso
Se devuelve a su origen, en USDC o convertido a Bs
"Te devolvimos 600 Bs"
Regla de recepción
El negocio define, por ejemplo, 50% se queda en USDC y 50% va a su banco
Reparto mostrado antes de confirmar
8.3 Cotización y tasa
• La conversión muestra una cotización con vigencia corta (por ejemplo 60 segundos), con desglose de comisión y margen.
• La tasa de referencia la define el socio de liquidez. Decisión abierta: qué tasa usar y quién asume la diferencia si cambia entre el pago y el retiro. El pago del usuario se fija en el momento de pagar.
• El usuario nunca asume riesgo cambiario: su precio en bolivianos queda fijo al reservar.
• El negocio puede publicar el precio en bolivianos o en USDC; si es en bolivianos, el riesgo debe resolverse con el socio de liquidez o con un margen. Pendiente de validar.
8.4 Lo que el mockup debe mostrar
Desglose claro en cada conversión, el tiempo estimado, un aviso visible de que el saldo en USDC no genera intereses, y que la tasa del prototipo es ilustrativa.
9. Justificación de blockchain y de Stellar
9.1 Qué problema concreto resuelve
Necesidad
Qué aporta Stellar
Sin blockchain
Garantía todo o nada con reembolso automático
Escrow programable que ninguna parte altera a su conveniencia
La plataforma retiene el dinero en una cuenta propia; todos deben confiar en ella; reembolsos manuales
Prueba pública de los fondos
Cualquiera verifica en un explorador que están bloqueados y bajo qué condiciones
Capturas de pantalla y promesas
Pagos pequeños y fraccionados
Comisiones de fracciones de centavo y confirmación en segundos
Comisiones bancarias fijas encarecen los pagos pequeños
Dinero estable para el negocio
USDC nativo para conservar valor sin depender de una cuenta en dólares
Acceso limitado a dólares
Pagos desde el exterior
Un familiar paga un cupo en segundos con USDC
Remesas lentas y caras
Reparto automático
Una transacción divide entre negocio y comisión
Conciliación manual
Conversión
Intercambio entre activos integrado y red de anchors para entrada y salida
Casas de cambio y trámites manuales
9.2 Lo que blockchain NO resuelve (hay que decirlo)
• El consentimiento del negocio: si el negocio no participa, no hay producto.
• La conversión Bs a USDC: depende de socios, liquidez y regulación locales.
• La verificación de acceso en la puerta: la cadena no abre el torniquete.
• La calidad del servicio: una garantía no evita un mal gimnasio.
• El riesgo de que el negocio cierre tras la liberación completa: por eso existe la liberación escalonada.
9.3 Por qué Stellar
Red orientada a pagos, con comisiones mínimas, USDC nativo, ecosistema de anchors para moneda local, cuentas patrocinadas (el usuario nunca necesita el activo de red), contratos inteligentes en Soroban y controles de cumplimiento a nivel de activo. Su desventaja honesta: un ecosistema de finanzas descentralizadas más pequeño que otras redes, relevante solo para ideas de rendimiento. Además, el reto del ideatón encaja con pagos y remesas.
9.4 Cómo se vería la integración sin fricción
Sin frases semilla, sin "conectar billetera", sin comisiones visibles, con lenguaje de negocio. La cadena aparece solo en un botón opcional: "Ver garantía".
10. Arquitectura y tecnologías
10.1 Para el mockup (alcance actual)
Capa
Tecnología
Motivo
Interfaz
Next.js, TypeScript, Tailwind CSS, shadcn/ui
Prototipo rápido y navegable
Datos
Archivos JSON o TypeScript con datos falsos
Sin backend
Estado
Estado en memoria (contexto o Zustand)
Simula cambios de estado en la demo
Gráficos
Recharts
Reportes simples
QR
Librería de generación de QR
Mostrar QR de ejemplo
Diseño opcional
Figma
Para iterar antes de codificar
La app debe ser mobile-first para el usuario y desktop-first (responsiva) para el comerciante.
10.2 Para el producto real (futuro)
Capa
Tecnología sugerida
App del usuario
Flutter o Next.js (PWA)
Panel del comerciante
Next.js con TypeScript
Backend
Spring Boot o Node.js, con API REST
Base de datos
PostgreSQL
Blockchain
Stellar, SDK en JavaScript o Java; Soroban para el escrow
Pagos QR y conversión
Integración con socio de liquidez o anchor autorizado
Identidad
Verificación documental (CI, NIT)
Notificaciones
Correo, SMS y WhatsApp
10.3 Piezas de Stellar previstas
• Cuentas por usuario y por negocio, creadas por el backend al inicio (custodiales); más adelante, billeteras con passkeys.
• Línea de confianza con USDC en cada cuenta que lo maneje.
• Cuentas y comisiones patrocinadas por la plataforma, para que nadie necesite el activo de red.
• Escrow, dos opciones: (A) saldos reclamables con condiciones de tiempo y cofirma de la plataforma, más simple; (B) contrato Soroban que impone "N depósitos antes de la fecha límite o reembolso", sin depender de la plataforma, más confiable. Decisión pendiente.
• Pagos con conversión integrada para cambios entre activos.
• Estándares de anchors (SEP-10, SEP-12, SEP-24) para autenticación, identidad y depósitos o retiros.
• Control de activos propios (autorización y recuperación) solo si en el futuro emitimos un pase tokenizado; no aplica al USDC.
10.4 Decisión sobre la billetera
No se construye criptografía propia. Se construye la experiencia de billetera (saldo, historial, acciones). Primero custodial en pruebas; después passkeys o un custodio regulado. La custodia real conlleva carga regulatoria y debe validarse con un abogado.
11. Casos de uso
ID
Caso
Actor
Resumen
UC-01
Comprar un cupo y completar el grupo
Usuario
Reserva, paga por QR, espera, recibe pase cuando se llena
UC-02
Grupo no se llena
Usuario
Vence el plazo y recibe reembolso automático
UC-03
Publicar una oferta
Comerciante
Asistente de creación con simulación de ingreso
UC-04
Recibir la liberación y decidir
Comerciante
Elige mantener, retirar o pagar a QR, o define una regla de reparto
UC-05
Pagar a un proveedor con saldo
Comerciante
Escanea un QR y se paga convirtiendo USDC a bolivianos
UC-06
Pagar desde el exterior
Pagador externo
Un familiar paga un cupo en USDC para alguien en Bolivia
UC-07
Ceder un cupo
Usuario
Publica su cupo; el negocio aprueba; otro lo compra
UC-08
Validar acceso
Validador
Escanea el pase y ve habilitado, fuera de periodo o no válido
UC-09
Oferta por franja horaria
Comerciante
Vende horarios de baja ocupación a precio menor
UC-10
Elegir Pago Protegido
Usuario
Filtra el feed por ofertas con liberación escalonada
UC-11
Disputa
Usuario o negocio
Reporta que el servicio no se presta o que el pase no funciona
UC-12
Consultar reportes
Comerciante
Ve llenado, ingresos anticipados y clientes nuevos
Ejemplos por tipo de negocio
• Gimnasio: anualidad en 3 cupos de 4 meses; el enero y febrero concentran la demanda, así que puede variar el precio por cupo.
• Coworking: puesto fijo por proyectos de 4 meses para freelancers y estudiantes; capacidad ociosa.
• Club con piscina: cupos por temporada (verano, resto del año).
• Academia de baile: 3 franjas horarias (mañana, tarde, noche) para llenar horas valle.
• Parqueo anual: cupos por periodos para quien necesita estacionamiento temporal.
12. Alcance del entregable actual: interfaz simulada
12.1 Objetivos
Un prototipo navegable que cuente la historia completa de la idea con datos falsos, en dos experiencias: app del usuario y panel del comerciante.
12.2 Fuera de alcance
Backend real, pagos reales, conexión a Stellar, autenticación real, consola de plataforma.
12.3 Reglas del prototipo
• Banner permanente y discreto: "Prototipo de demostración: no se mueve dinero real".
• Idioma español de Bolivia. Moneda con formato boliviano (ej. 1.800 Bs). Fechas en formato día/mes/año.
• Navegación: el usuario tiene barra inferior (Explorar, Mis cupos, Avisos, Perfil); el comerciante tiene menú lateral (Panel, Ofertas, Billetera, Validar acceso, Reportes, Configuración).
• Cambio de rol en un interruptor visible para la demo.
12.4 Panel de demo (flotante)
Botones que simulan eventos: Llenar un cupo, Llenar todos los cupos, Avanzar hasta el vencimiento, Cambiar tasa de cambio, Alternar usuario/comerciante, Reiniciar datos. Permite mostrar todos los estados en una presentación de pocos minutos.
13. Especificación de pantallas: Usuario
U1. Bienvenida y registro. Propuesta en una frase, registro con teléfono o correo, verificación de identidad simulada (carnet y selfie). No pide billetera ni nada cripto.
U2. Explorar. Buscador, categorías (gimnasio, coworking, club, academia, otros), filtros (ciudad, precio por cupo, periodo, cupos disponibles, Pago Protegido). Tarjetas con foto, negocio, precio por cupo, ahorro frente a mensual, barra de cupos llenos (ej. 2 de 3), tiempo restante y etiqueta de estado.
U3. Detalle de oferta. Galería, qué incluye, horarios y ubicación, reglas del negocio, tabla de cupos (periodo, precio, disponible, reservado o pagado), explicación de la garantía en 3 pasos, política de reembolso, botones "Reservar cupo" y "Ver garantía".
U4. Elegir cupo. Selector de periodo o franja, fechas de uso, precio y comparativa visible: "Mensual 800 Bs frente a Cupos 600 Bs".
U5. Pago. Resumen y desglose, QR bancario en bolivianos con cuenta regresiva de vigencia e instrucciones, variante "Pagar con USDC" para pagos externos. Estados: esperando pago, confirmando, confirmado, expirado.
U6. Cupo reservado. Confirmación "Tu pago está en garantía", resumen, qué pasa ahora, botón para compartir la oferta por WhatsApp y llenar el grupo.
U7. Esperando al grupo. Progreso (ej. 2 de 3), cuenta regresiva, participantes con iniciales, aviso de reembolso automático, botón invitar.
U8. Acceso listo. Animación de grupo completo y pase digital con nombre, periodo, QR, reglas y ubicación; botón para añadir al calendario. Variantes: aún no inicia, activo, por vencer.
U9. Mis cupos. Pestañas Activos, Pendientes, Finalizados y Reembolsados.
U10. Reembolso automático. "No se completó el grupo. Te devolvimos 600 Bs." Indica medio y tiempo, y sugiere ofertas similares.
U11. Ceder mi cupo. Elegir cupo, precio (máximo el original), publicar y ver estados; aviso de que requiere aprobación del negocio.
U12. Comprobante y garantía. Recibo con identificador de operación y estado de fondos, y botón "Ver garantía en la red" que abre una vista simulada de explorador con una explicación en lenguaje simple.
U13. Perfil, avisos y ayuda. Datos, métodos de pago, centro de notificaciones, reportar un problema (disputa) y preguntas frecuentes.
14. Especificación de pantallas: Comerciante
M1. Registro y verificación. Datos del negocio, NIT, dueño, cuenta bancaria de destino, fotos y términos. Estados: en revisión y aprobado.
M2. Panel principal. Tarjetas de Saldo disponible (USDC y equivalente en Bs), En garantía (por liberar), Ofertas activas y Clientes nuevos del mes; acciones pendientes y gráfico de ingresos anticipados.
M3. Crear oferta (asistente de 5 pasos). 1) Datos del servicio. 2) Precio anual y descuento frente a mensual. 3) División en cupos (por periodo, por franja o personalizada) con vista previa del precio por cupo. 4) Reglas: plazo de llenado, tipo de liberación (completa o escalonada con Sello Pago Protegido), política de cambios, requisitos. 5) Revisión, simulación de ingreso y publicación.
M4. Mis ofertas. Tabla con estado, cupos llenos, plazo, monto en garantía y acciones (editar, pausar, duplicar, cerrar).
M5. Detalle de oferta. Progreso, lista de participantes (nombre, periodo, estado de pago, identidad verificada), línea de tiempo de eventos, acciones (contactar, reasignar cupo, cancelar con aviso de consecuencias).
M6. Billetera. Saldo en USDC con equivalente en Bs y cotización, historial (liberaciones, retiros, pagos) y tres acciones principales: "Mantener", "Retirar a mi banco" y "Pagar a un QR". Aviso fijo: este saldo no genera intereses.
M7. Retirar a cuenta bancaria. Monto, destino, cotización con vigencia, desglose de comisión y margen, tiempo estimado, confirmación y comprobante.
M8. Pagar a un QR. Escanear o subir un QR de ejemplo, leer el monto en Bs, mostrar USDC equivalentes y comisión, confirmar y emitir comprobante.
M9. Validar acceso. Vista para recepción: escanear pase o buscar por nombre. Resultados: válido (verde), fuera de periodo, no habilitado. Registro de visitas.
M10. Reportes. Llenado de ofertas, tiempo promedio de llenado, ingresos anticipados, clientes nuevos frente a existentes, tasa de reembolso.
M11. Rendimiento (Próximamente). Pantalla deshabilitada que presenta la idea como futura, opcional y de terceros, sin cifras de rendimiento, con aviso de riesgos y de que requiere validación legal.
M12. Configuración. Equipo (rol Validador), cuenta bancaria, regla de recepción (todo a Bs, todo en USDC o un porcentaje de cada uno) y notificaciones.
15. Lenguaje y experiencia
15.1 Vocabulario
Decir
Evitar
Cupo
Token, NFT
Garantía
Escrow, contrato inteligente
Tu pago está protegido
Fondos bloqueados on-chain
Saldo en dólares digitales
USDC (solo como detalle secundario)
Ver garantía
Ver transacción en blockchain
Reembolso automático
Liquidación del escrow
15.2 Tono y estilo
• Cercano, claro y tranquilizador; frases cortas; siempre decir qué pasa ahora y qué pasa después.
• Estética de confianza financiera cercana: colores sobrios con un solo color de acento, tarjetas limpias, mucho espacio. Evitar la estética cripto (neones, degradados agresivos, íconos de monedas).
• Accesibilidad: contraste suficiente, textos legibles, estados con texto además de color.
• Cada estado importante (pendiente, en garantía, completo, vencido, reembolsado) tiene un color, un ícono y una frase propios.
16. Datos de ejemplo para los mockups (todos ficticios)
Negocio
Oferta
Cupos
Estado para mostrar
Gimnasio PowerFit
Anualidad 1.800 Bs
3 de 4 meses a 600 Bs
2 de 3 llenos, cierra en 5 días
Cowork La Esquina
Puesto fijo 3.600 Bs
3 de 4 meses a 1.200 Bs
1 de 3, con Pago Protegido
Club Aguas Claras
Anualidad 1.200 Bs
3 temporadas a 400 Bs
Completa, en curso
Academia Ritmo
Anualidad 1.500 Bs
3 franjas horarias a 500 Bs
Nueva, 0 de 3
Yoga Prana
Anualidad 2.100 Bs
3 de 4 meses a 700 Bs
Vencida, reembolsada
Parqueo Central
Anualidad 1.800 Bs
3 de 4 meses a 600 Bs
2 de 3, termina mañana
Personas de ejemplo: Lucía (estudiante y freelancer que busca coworking por 4 meses), Marcos (dueño de un gimnasio), Carla (familiar en el exterior que paga el cupo de su hermano).
17. Modelo de ingresos
• Comisión por oferta liberada entre 2,5% y 3,5% (ejemplo 3%), cobrada al negocio.
• Margen de conversión en retiros y pagos a QR.
• Comisión por cesión de cupos entre 2% y 3% del precio del cupo, pagada por quien cede.
• Plan premium para negocios (reportes avanzados, varias sedes, prioridad en el feed).
18. Riesgos, supuestos y preguntas abiertas
Riesgo o duda
Mitigación o siguiente paso
El negocio no acepta el modelo
Empezar con coworking y gimnasios; vender como ingreso adelantado y clientes nuevos
El negocio pierde el "abandono" que hoy le da ganancia
Mostrar clientes incrementales y horas valle
Grupo sin llenar
Todo o nada con reembolso y plazos cortos
Negocio que cierra tras la liberación completa
Liberación escalonada, Sello Pago Protegido, verificación y proceso de disputa
Regulación de custodia, pagos y criptoactivos en Bolivia
Asesoría legal; socio autorizado para custodia en bolivianos
Liquidez y tasa Bs a USDC
Socio de liquidez; definir tasa y quién asume la diferencia
Fraude o identidad falsa
Verificación documental y registro nominal
Rendimiento sobre fondos
Fuera del MVP; solo de terceros y opcional, tras validación legal
Supuestos a validar con entrevistas: que los negocios aceptan vender cupos, que los usuarios confían en pagar por QR a una garantía y que existe un socio de liquidez viable.
19. Hoja de ruta posterior al mockup
1. Fase 0 (ahora): interfaz simulada y guion de demo.
2. Fase 1: entrevistas con 3 a 5 negocios en Tarija para validar el modelo.
3. Fase 2: prototipo funcional con escrow real en la red de pruebas de Stellar y pagos simulados.
4. Fase 3: piloto con 1 o 2 negocios, cobros reales en bolivianos con un socio.
5. Fase 4: red principal con USDC, opción de cobro en USDC, mercado secundario y reputación.
6. Fase 5: pase tokenizado con QR rotativo, pagos desde el exterior y conexión con las ideas de pasanaku e importación segura para pymes.
20. Guion de demo (3 minutos)
1. Problema (30 s): anualidades que se pierden y personas que no pueden pagarlas.
2. El negocio publica (30 s): crea la oferta en el asistente y ve la simulación de ingreso.
3. El usuario compra (45 s): explora, reserva y paga por QR; ve "Tu pago está en garantía".
4. Se llena el grupo (30 s): con el panel de demo, completar los cupos; aparece el pase digital.
5. El negocio decide (30 s): ve su saldo y muestra las tres acciones: mantener, retirar, pagar a QR.
6. Confianza (15 s): abrir "Ver garantía" y mostrar la prueba; cerrar con la frase de valor.
Frase de cierre: "Convertimos anualidades en cupos compartidos: el negocio cobra todo por adelantado, el usuario paga solo su parte y Stellar garantiza que el dinero llegue o se devuelva, sin que nadie tenga que saber de cripto."
21. Criterios de aceptación y prohibiciones
Debe cumplirse
• Todas las pantallas de las secciones 13 y 14 existen y son navegables.
• Los estados clave de oferta y de cupo se pueden ver desde el panel de demo.
• Los números del ejemplo de la sección 8 coinciden en todas las pantallas.
• El flujo completo del guion (sección 20) se recorre sin errores.
• Funciona bien en celular para el usuario y en pantalla grande para el comerciante.
No hacer
• No integrar pagos reales, claves reales ni llamadas reales a Stellar.
• No usar términos técnicos de cripto en la interfaz principal.
• No mostrar promesas ni cifras de rendimiento.
• No afirmar cumplimiento regulatorio: presentar lo legal como pendiente de validación.
• No presentar datos ficticios como reales: etiquetar todo como demostración.