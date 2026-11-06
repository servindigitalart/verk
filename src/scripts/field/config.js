// VERK · parámetros del hero (Fluid Halftone). Único lugar para ajustar el comportamiento visual.
// Se pueden probar en vivo con ?tune (panel de deslizadores; no se carga sin el parámetro).
export const FIELD = {
  dprCap: 1.5,          // tope de densidad de píxeles del lienzo (coste GPU ∝ DPR²)
  speed: 1,             // velocidad global del tiempo de la simulación
  cursor: 1,            // fuerza del cursor sobre el fluido

  // Trama halftone
  cell: 7.5,            // tamaño de celda de la trama, px CSS (menor = más puntos)
  density: 1,           // multiplicador del tono (cuánta superficie cubren los puntos)
  contrast: 1,          // curva del tono: >1 vacía los medios tonos, <1 los llena
  aniso: 1.4,           // estiramiento de los puntos en la dirección del flujo (estelas)
  gap: 7,               // margen limpio alrededor del isotipo, px (el isotipo es un obstáculo sólido)
  limeReach: 24,        // modo lima: distancia máxima del cursor a las barras del isotipo, px

  // Interacción cromática con la tipografía: las partículas que atraviesan las letras se «cargan» de color
  // y lo arrastran en su estela. Nunca cambia el texto: cambia el punto que pasa detrás.
  chroma: {
    intensity: .75,     // 0 = desactivado · 1 = cambio cromático completo
    radius: 22,         // alcance alrededor del contorno de las letras, px
    response: 2.4,      // velocidad de carga al atravesar una letra (1/s)
    transition: 1.8,    // segundos que tarda una partícula cargada en volver al violeta
    near: .5,           // tinte inmediato de los puntos que están justo detrás de una letra (legibilidad)
    textDensity: .82,   // tamaño relativo de los puntos detrás de las letras (legibilidad)
  },

  // Isotipo: respiración autónoma + respuesta al cursor (solo traslación sobre el eje de 45°)
  mark: {
    breath: 3.2,        // amplitud de la respiración, px
    reach: 1.15,        // alcance del cursor, en alturas del isotipo
    push: 16,           // desplazamiento máximo por el cursor, px
    stiffness: 70,      // rigidez del muelle de cada barra (1/s²)
    damping: .42,       // amortiguamiento relativo (<1 = sobreoscila ligeramente, sensación líquida)
  },
};
