import { create } from 'zustand';
import { traerMisInscripciones } from '../servicios/gimnasio.ts';
import { leerSesionGuardada, mensajeDeError } from '../servicios/api.ts';
import type { Inscripcion } from '../tipos.ts';

interface EstadoInscripciones {
  inscripciones: Inscripcion[];
  cargando: boolean;
  error: string | null;
  cargar: () => Promise<void>;
  vaciar: () => void;
}

let numeroPeticion = 0;

export const useInscripcionesStore = create<EstadoInscripciones>((set) => ({
  inscripciones: [],
  cargando: leerSesionGuardada() !== null,
  error: null,

  cargar: async () => {
    const mia = ++numeroPeticion;
    set({ cargando: true, error: null });
    try {
      const lista = await traerMisInscripciones();
      if (mia === numeroPeticion) set({ inscripciones: lista, cargando: false });
    } catch (e) {
      if (mia === numeroPeticion) {
        set({ error: mensajeDeError(e, 'No se pudieron cargar tus inscripciones.'), cargando: false });
      }
    }
  },

  vaciar: () => {
    numeroPeticion++;
    set({ inscripciones: [], cargando: false, error: null });
  },
}));

export const esConfirmada = (i: Inscripcion) => i.estado === 'confirmada';