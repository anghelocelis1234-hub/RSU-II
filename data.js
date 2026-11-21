window.DEFAULT_SCENES = [
  {
    id: 1,
    time: "05:30 a. m.",
    stage: "Despertar antes de que salga el sol",
    title: "Despertar antes de que salga el sol",
    description:
      "Mateo abre los ojos con sueño pesado antes del amanecer porque sus clases empiezan a las 6:00 a. m. La mochila ya está lista desde la noche anterior, pero el reloj marca que el margen es corto.",
    image: "assets/escena-1.jpg",
    hotspots: [
      {
        id: "s1-h1",
        x: 74,
        y: 56,
        category: "tiempo",
        title: "Despertar temprano para clases a las 6:00 a. m.",
        note: "Mateo despierta con sueño antes de que salga el sol porque sus clases empiezan a las 6:00 a. m. y el margen de tiempo es corto desde el primer segundo.",
        prompt: "¿Cómo influye madrugar tanto en el apetito o en el orden de la mañana?"
      },
      {
        id: "s1-h2",
        x: 28,
        y: 74,
        category: "decision",
        title: "Mochila lista desde la noche",
        note: "La mochila está preparada desde antes para ganar minutos en la madrugada; adelantar cosas ayuda a correr menos, pero la comida quedó fuera de esa preparación.",
        prompt: "¿Qué pequeño hábito nocturno podría incluir también algo para comer?"
      }
    ]
  },
  {
    id: 2,
    time: "05:40 a. m.",
    stage: "Salir apurado sin desayunar",
    title: "Salir apurado hacia el transporte sin desayunar",
    description:
      "Mateo se mueve rápido para alcanzar el transporte público y deja atrás la mesa vacía, sin desayunar. El reloj y el traslado le ganan la partida.",
    image: "assets/escena-2.jpg",
    hotspots: [
      {
        id: "s2-h1",
        x: 68,
        y: 66,
        category: "nutricion",
        title: "Mesa vacía al salir",
        note: "Mateo sale sin desayunar porque prioriza ganar minutos hacia el transporte, arrancando el primer tramo del día con el estómago vacío.",
        prompt: "¿Qué pasa cuando el primer tramo del día arranca con el estómago vacío?"
      },
      {
        id: "s2-h2",
        x: 34,
        y: 42,
        category: "tiempo",
        title: "Carrera contra el transporte público",
        note: "El miedo a perder la movilidad o llegar tarde a primera hora empuja a recortar rutinas básicas en casa.",
        prompt: "¿Qué alternativa cabe si el tiempo en la mañana es tan estrecho?"
      }
    ]
  },
  {
    id: 3,
    time: "05:57 a. m.",
    stage: "Puesto en el camino",
    title: "El puesto de emoliente y maca frente al bolsillo",
    description:
      "En el paradero pasa junto a un puesto de emoliente y maca. Son opciones calientes al paso, pero el precio le resulta restrictivo frente a lo que calcula gastar y al apuro por avanzar.",
    image: "assets/escena-3.jpg",
    hotspots: [
      {
        id: "s3-h1",
        x: 42,
        y: 50,
        category: "nutricion",
        title: "Emoliente y maca al paso",
        note: "Una alternativa caliente y conocida en el recorrido, pero que compite directamente con el reloj y con otros gastos del día.",
        prompt: "¿Qué pesa más aquí: el costo unitario, el apuro o el hábito?"
      },
      {
        id: "s3-h2",
        x: 66,
        y: 62,
        category: "presupuesto",
        title: "Precio restrictivo y cálculo del día",
        note: "Gastar de madrugada reduce el margen para pasajes, copias o comidas del resto de la jornada cuando el presupuesto es ajustado.",
        prompt: "¿Cómo se evalúa si algo 'cuesta poco' cuando cada sol cuenta?"
      }
    ]
  },
  {
    id: 4,
    time: "06:02 a. m.",
    stage: "Saldo en Yape",
    title: "Revisando el celular y el saldo en Yape",
    description:
      "Mateo mira su celular y abre Yape. Recibe un apoyo regular moderado de sus padres y, tras pasajes y gastos previos, le quedan S/ 18.50 para administrar.",
    image: "assets/escena-yape.jpg",
    hotspots: [
      {
        id: "s4-h1",
        x: 50,
        y: 52,
        category: "presupuesto",
        theme: "yape",
        customIcon: "Y",
        title: "Saldo en Yape: S/ 18.50 disponibles",
        note: "Mateo recibe un apoyo regular de sus padres (asignación semanal moderada). Tras cubrir pasajes y gastos básicos de los días previos, le queda un saldo concreto de S/ 18.50: no está en cero, pero cada sol cuenta.",
        prompt: "Con un apoyo regular ajustado, ¿en qué conviene priorizar ese saldo restante?"
      },
      {
        id: "s4-h2",
        x: 52,
        y: 72,
        category: "decision",
        theme: "yape",
        customIcon: "Y",
        title: "Presión de administrar el apoyo familiar",
        note: "Entre transporte, copias o materiales y alimentación, un gasto desordenado o improvisado se siente rápido antes de recibir el siguiente apoyo de sus padres.",
        prompt: "¿Cómo puede organizar mejor sus compras sin depender de improvisar cada día?"
      }
    ]
  },
  {
    id: 5,
    time: "09:30 a. m.",
    stage: "En clase",
    title: "Hambre y cansancio durante las clases",
    description:
      "A media mañana, en plena clase, aparece el hambre y el bajón de energía por haber madrugado sin desayunar. Cuesta sostener la atención y el ritmo académico.",
    image: "assets/escena-4.jpg",
    hotspots: [
      {
        id: "s5-h1",
        x: 50,
        y: 48,
        category: "nutricion",
        title: "Hambre a media mañana en clase",
        note: "El ayuno prolongado desde la madrugada pasa factura durante las horas lectivas, afectando la energía y la concentración.",
        prompt: "Aquí se cruzan lo personal (fisiología) y lo académico (atención): ¿cómo impacta en su jornada?"
      },
      {
        id: "s5-h2",
        x: 34,
        y: 68,
        category: "tiempo",
        title: "Cansancio acumulado",
        note: "Dormir poco y arrancar sin alimento vuelve más pesado el tramo largo de la mañana entre bloques continuos de clase.",
        prompt: "¿Qué se puede prever antes de entrar a clases para evitar este bajón?"
      }
    ]
  },
  {
    id: 6,
    time: "09:45 a. m.",
    stage: "Pausa breve",
    title: "Poco dinero: gaseosa y snack al paso",
    description:
      "Con el hambre apretando y el poco dinero disponible, Mateo opta por una gaseosa pequeña y una bolsa de snack. Resuelve el apuro en segundos, pero aporta poco y acorta el bolsillo.",
    image: "assets/escena-5.jpg",
    hotspots: [
      {
        id: "s6-h1",
        x: 44,
        y: 56,
        category: "decision",
        title: "Gaseosa y snack rápido",
        note: "Compra fácil y al instante cuando hay hambre y prisa, pero poco saciante y con bajo aporte nutricional sostenido.",
        prompt: "¿Por qué se recurre tanto a este tipo de compra en medio de la jornada?"
      },
      {
        id: "s6-h2",
        x: 58,
        y: 64,
        category: "presupuesto",
        title: "Costo de la improvisación",
        note: "Gastar monedas sueltas en snacks frecuentes suma rápido frente a un presupuesto limitado como S/ 18.50.",
        prompt: "¿Qué cambio práctico evita llegar al receso improvisando?"
      }
    ]
  },
  {
    id: 7,
    time: "10:15 a. m.",
    stage: "Estantería accesible",
    title: "Estantería de opciones accesibles y nutritivas",
    description:
      "Frente a las compras rápidas al paso, existe una estantería de opciones rendidoras con precios de referencia claros para armar desayunos y refrigerios viables.",
    image: "assets/escena-avena.jpg",
    hotspots: [
      {
        id: "s7-h1",
        x: 38,
        y: 44,
        category: "presupuesto",
        title: "Estantería base: Avena, Leche y Carbohidrato",
        note: "Productos rendidores que bajan drásticamente el costo por porción frente a comprar algo cada mañana:",
        items: [
          { name: "Avena (bolsa rendidora)", price: "~S/ 10.00 (dura semanas)" },
          { name: "Leche (tarro o caja)", price: "S/ 4.00 – S/ 5.00" },
          { name: "Carbohidrato base (pan, arroz o papa/yuca)", price: "S/ 1.00 – S/ 1.50 / porción" }
        ],
        prompt: "¿Cómo puede encajar esta base rendidora en la rutina de un estudiante con poco tiempo?"
      },
      {
        id: "s7-h2",
        x: 64,
        y: 64,
        category: "nutricion",
        title: "Frutas económicas por unidad",
        note: "Comprar por unidad permite cuidar el saldo sin renunciar a opciones frescas y saciantes:",
        items: [
          { name: "Bananas / plátanos (por unidad)", price: "S/ 0.40 – S/ 0.50 c/u" },
          { name: "Manzanas (por unidad)", price: "S/ 1.20 – S/ 1.50 c/u" }
        ],
        prompt: "¿Qué combinación realista puede armar Mateo con S/ 2 o S/ 3 al día usando esta estantería?"
      }
    ]
  },
  {
    id: 8,
    time: "14:30 p. m.",
    stage: "Regreso a casa",
    title: "Regreso a casa tarde (entre 2:00 y 3:00 p. m.)",
    description:
      "Mateo vuelve a casa entre las 2:00 y las 3:00 p. m. con cansancio mental y físico tras horas de clases, calor y transporte público.",
    image: "assets/escena-6.jpg",
    hotspots: [
      {
        id: "s8-h1",
        x: 52,
        y: 48,
        category: "tiempo",
        title: "Voz interior: desgaste y frustración",
        note: "«Siento que todo el día voy corriendo detrás del reloj...». El cansancio mental, el calor y el horario estirado dejan a Mateo sin ánimo ni claridad para organizar comida.",
        prompt: "¿Cómo afecta este desgaste emocional y físico a las decisiones alimentarias de la tarde?"
      },
      {
        id: "s8-h2",
        x: 32,
        y: 66,
        category: "decision",
        title: "El día se estira demasiado",
        note: "Llegar a casa después de las 2:00 p. m. con el hambre postergada genera sensación de desorden y poca energía para empezar de cero en la cocina.",
        prompt: "¿Qué se puede dejar avanzado o previsto para no decidir desde el agotamiento?"
      }
    ]
  },
  {
    id: 9,
    time: "15:00 p. m.",
    stage: "Almuerzo tardío",
    title: "Comida poco equilibrada y riesgos del almuerzo tardío",
    description:
      "Al volver tarde y agotado, Mateo come algo rápido y poco variado a deshora, asumiendo los riesgos de almorzar con hambre extrema.",
    image: "assets/escena-7.jpg",
    hotspots: [
      {
        id: "s9-h1",
        x: 48,
        y: 62,
        category: "nutricion",
        title: "Riesgos de comer tarde y mal",
        note: "Almorzar entre las 2:30 y 3:00 p. m. con demasiada hambre lleva a comer rápido, elegir porciones desbalanceadas, sentir pesadez o sueño en la tarde y desordenar la cena y el día siguiente.",
        prompt: "¿Qué señales físicas y de rutina muestran que este horario tardío está pasando factura?"
      },
      {
        id: "s9-h2",
        x: 70,
        y: 44,
        category: "decision",
        title: "Ánimo bajo y falta de plan previo",
        note: "Mateo siente fastidio consigo mismo por comer 'lo que haya' a deshora, pero sin previsión previa, el hambre y el cansancio mandan sobre la calidad del plato.",
        prompt: "¿Qué ajuste pequeño ordenaría mejor esta comida sin exigirle cocinar una hora?"
      }
    ]
  },
  {
    id: 10,
    time: "Cierre del caso",
    stage: "Balance de Mateo",
    title: "Cruce de decisiones, emociones y alternativas",
    description:
      "Mateo hace balance de su día: madrugó sin desayunar, cuidó sus S/ 18.50 de Yape, sintió hambre en clase, improvisó con snack, vio opciones de estantería accesible y llegó agotado a almorzar tarde.",
    image: "assets/escena-8.jpg",
    hotspots: [
      {
        id: "s10-h1",
        x: 32,
        y: 44,
        category: "decision",
        title: "Balance emocional y contextual de Mateo",
        note: "«No es que no quiera cuidarme, es que siento que el tiempo y la plata no alcanzan». Mateo carga cansancio, preocupación por su saldo restante y la presión de cumplir con sus clases de primer año.",
        prompt: "Desde esta mirada sin juicios, elijan 2 dificultades clave (personales, sociales o académicas)."
      },
      {
        id: "s10-h2",
        x: 68,
        y: 52,
        category: "nutricion",
        title: "Propuesta realista del equipo",
        note: "Con su apoyo familiar moderado, sus horarios de 6:00 a. m. y opciones como avena, leche, fruta por unidad y un carbohidrato base, ¿qué sí es posible cambiar desde mañana?",
        prompt: "Anoten en su hoja bond 2 alternativas realistas para organizar su alimentación."
      }
    ]
  },
  {
    id: 11,
    time: "Consigna en equipo",
    stage: "Hoja bond y lapicero",
    title: "Trabajo en equipo y conclusiones",
    description:
      "Con hoja bond y lapicero o lápiz, analicen el caso de Mateo en equipo, identifiquen dos dificultades y propongan dos alternativas realistas para compartir al final.",
    image: "assets/escena-consigna.svg",
    hotspots: [
      {
        id: "s11-h1",
        x: 38,
        y: 42,
        category: "decision",
        title: "1. Identificar 2 dificultades",
        note: "Analicen en equipo y anoten en su hoja bond dos dificultades concretas del caso de Mateo (pueden ser personales, sociales o académicas).",
        prompt: "¿Qué dos factores pesan más en su día entre clases, traslados y presupuesto?"
      },
      {
        id: "s11-h2",
        x: 62,
        y: 58,
        category: "nutricion",
        title: "2. Proponer 2 alternativas realistas",
        note: "Propongan dos soluciones viables para organizar su alimentación con poco tiempo y presupuesto limitado, usando opciones accesibles.",
        prompt: "¿Qué dos cambios concretos podrían aplicar desde mañana y compartir con el grupo?"
      },
      {
        id: "s11-h3",
        x: 50,
        y: 76,
        category: "tiempo",
        title: "3. Compartir conclusiones (10 min)",
        note: "Al sonar la alarma de los primeros 10 minutos de análisis, cada equipo comparte sus conclusiones de forma voluntaria y sin juicios.",
        prompt: "¿Quién de su equipo resumirá sus dos dificultades y dos alternativas?"
      }
    ]
  }
];

window.CATEGORY_META = {
  tiempo: { label: "Tiempo", icon: "⏱" },
  presupuesto: { label: "Presupuesto", icon: "🪙" },
  decision: { label: "Decisión", icon: "🧭" },
  nutricion: { label: "Nutrición", icon: "🥗" }
};
