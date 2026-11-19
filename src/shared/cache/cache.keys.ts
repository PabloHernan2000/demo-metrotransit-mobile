const PREFIX = 'transporte-metropolitano:v1';

export const CACHE_KEYS = {
    // Cátalogos
    ESTACIONES: `${PREFIX}:estaciones`,
    ESTACION: (id: number) => `${PREFIX}:estacion:${id}`,
    ESTACION_SVG: (id: number) => `${PREFIX}:estaciones:${id}:svg`,
    TRONCAL: `${PREFIX}:troncal`,
} as const;