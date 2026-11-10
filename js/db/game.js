export const escenasBatalla = [
  {
    id: "inicio",
    tipo: "inicio",
    etiqueta: "EL DESAFÍO",
    titulo: "Greninja vs. Garchomp",

    textos: [
      "Controlás a Greninja y te enfrentás a Garchomp. Observá sus movimientos y elegí cómo reaccionar.",
      "La batalla tiene hasta tres turnos. Tus decisiones pueden llevarte a la victoria o a la derrota."
    ],

    pregunta: "¿Listo para comenzar?",

    estadoGreninja: "Preparado",
    estadoGarchomp: "Preparado",

    opciones: [
      {
        id: "btn-comenzar-batalla",
        texto: "Comenzar batalla",
        destino: "turno1"
      }
    ]
  },

  {
    id: "turno1",
    tipo: "decision",
    etiqueta: "TURNO 1 DE 3",
    titulo: "La primera embestida",

    textos: [
      "Garchomp se acerca a toda velocidad y se prepara para golpear a Greninja."
    ],

    pregunta: "¿Qué hacés?",

    estadoGreninja: "En guardia",
    estadoGarchomp: "Atacando",

    opciones: [
      {
        id: "esquivar",
        texto: "Esquivar",
        destino: "turno2esquiva"
      },
      {
        id: "atacar-frente",
        texto: "Atacar de frente",
        destino: "turno2herido"
      }
    ]
  },

  {
    id: "turno2esquiva",
    tipo: "decision",
    etiqueta: "TURNO 2 DE 3",
    titulo: "Una oportunidad para atacar",

    textos: [
      "Greninja esquiva el golpe. Garchomp pierde el equilibrio y queda expuesto por un momento."
    ],

    pregunta: "¿Aprovechás la oportunidad?",

    estadoGreninja: "Sin daño",
    estadoGarchomp: "Expuesto",

    opciones: [
      {
        id: "ataque-agua",
        texto: "Lanzar un ataque de agua",
        destino: "turno3agua"
      },
      {
        id: "esperar",
        texto: "Esperar demasiado",
        destino: "derrotaespera"
      }
    ]
  },

  {
    id: "turno2herido",
    tipo: "decision",
    etiqueta: "TURNO 2 DE 3",
    titulo: "Greninja necesita recuperarse",

    textos: [
      "Greninja intenta atacar de frente, pero Garchomp bloquea el ataque y contraataca. Greninja queda herido."
    ],

    pregunta: "¿Cómo reaccionás?",

    estadoGreninja: "Herido",
    estadoGarchomp: "En guardia",

    opciones: [
      {
        id: "usar-pocion",
        texto: "Usar una poción",
        destino: "turno3pocion"
      },
      {
        id: "seguir-atacando",
        texto: "Seguir atacando sin recuperarte",
        destino: "derrotaherido"
      }
    ]
  },

  {
    id: "turno3agua",
    tipo: "decision",
    etiqueta: "TURNO 3 DE 3",
    titulo: "La última embestida",

    textos: [
      "El ataque de agua de Greninja golpea a Garchomp y lo hace retroceder.",
      "Garchomp reúne sus fuerzas y prepara una última embestida. ¡Es el momento decisivo!"
    ],

    pregunta: "¿Cómo terminás la batalla?",

    estadoGreninja: "Con ventaja",
    estadoGarchomp: "Última embestida",

    opciones: [
      {
        id: "contraatacar",
        texto: "Esquivar y contraatacar",
        destino: "victoria"
      },
      {
        id: "atacar-otra-vez",
        texto: "Atacar de frente otra vez",
        destino: "derrotafinal"
      }
    ]
  },

  {
    id: "turno3pocion",
    tipo: "decision",
    etiqueta: "TURNO 3 DE 3",
    titulo: "Una nueva oportunidad",

    textos: [
      "Usás una poción y Greninja recupera sus fuerzas. Todavía podés ganar.",
      "Garchomp prepara una última embestida. Esta vez necesitás reaccionar a tiempo."
    ],

    pregunta: "¿Cómo terminás la batalla?",

    estadoGreninja: "Recuperado",
    estadoGarchomp: "Última embestida",

    opciones: [
      {
        id: "contraatacar",
        texto: "Esquivar y contraatacar",
        destino: "victoria"
      },
      {
        id: "atacar-otra-vez",
        texto: "Atacar de frente otra vez",
        destino: "derrotafinal"
      }
    ]
  },

  {
    id: "victoria",
    tipo: "victoria",
    etiqueta: "RESULTADO FINAL",
    titulo: "¡Victoria de Greninja!",

    textos: [
      "Greninja esquiva la última embestida y contraataca cuando Garchomp queda expuesto. ¡Garchomp cae debilitado y ganás la batalla!"
    ],

    pregunta: "¿Querés jugar otra vez?",

    estadoGreninja: "Vencedor",
    estadoGarchomp: "Debilitado",

    opciones: [
      {
        id: "reintentar",
        texto: "Reintentar",
        destino: "turno1"
      },
      {
        id: "volver-pokedex-batalla",
        texto: "Volver a la Pokédex",
        destino: "pokedex"
      }
    ]
  },

  {
    id: "derrotaespera",
    tipo: "derrota",
    etiqueta: "RESULTADO FINAL",
    titulo: "Garchomp gana la batalla",

    textos: [
      "Esperaste demasiado. Garchomp recupera el equilibrio y ataca antes de que Greninja pueda reaccionar. Greninja cae debilitado."
    ],

    pregunta: "Podés intentarlo de nuevo y elegir otra acción.",

    estadoGreninja: "Debilitado",
    estadoGarchomp: "Vencedor",

    opciones: [
      {
        id: "reintentar",
        texto: "Reintentar",
        destino: "turno1"
      },
      {
        id: "volver-pokedex-batalla",
        texto: "Volver a la Pokédex",
        destino: "pokedex"
      }
    ]
  },

  {
    id: "derrotaherido",
    tipo: "derrota",
    etiqueta: "RESULTADO FINAL",
    titulo: "Garchomp gana la batalla",

    textos: [
      "Greninja vuelve a atacar sin recuperarse del golpe anterior. Garchomp resiste el ataque y lo debilita con un contraataque."
    ],

    pregunta: "Podés intentarlo de nuevo y elegir otra acción.",

    estadoGreninja: "Debilitado",
    estadoGarchomp: "Vencedor",

    opciones: [
      {
        id: "reintentar",
        texto: "Reintentar",
        destino: "turno1"
      },
      {
        id: "volver-pokedex-batalla",
        texto: "Volver a la Pokédex",
        destino: "pokedex"
      }
    ]
  },

  {
    id: "derrotafinal",
    tipo: "derrota",
    etiqueta: "RESULTADO FINAL",
    titulo: "Garchomp gana la batalla",

    textos: [
      "Greninja ataca de frente y recibe la última embestida. Garchomp gana el enfrentamiento y Greninja queda debilitado."
    ],

    pregunta: "Podés intentarlo de nuevo y elegir otra acción.",

    estadoGreninja: "Debilitado",
    estadoGarchomp: "Vencedor",

    opciones: [
      {
        id: "reintentar",
        texto: "Reintentar",
        destino: "turno1"
      },
      {
        id: "volver-pokedex-batalla",
        texto: "Volver a la Pokédex",
        destino: "pokedex"
      }
    ]
  }
];