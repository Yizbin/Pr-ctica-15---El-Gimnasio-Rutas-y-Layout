// hooks/useClases.ts — RECURSO: el mismo patrón de useProductos (Práctica 14).
// Pide las clases al montar y regresa los tres estados de toda petición.
import { useEffect, useState } from 'react';
import { traerClase } from '../servicios/gimnasio.ts';
import { mensajeDeError } from '../servicios/api.ts';
import type { ClaseConHorarios } from '../tipos.ts';

export function useClase(id: number) {
  const [clase, setClase] = useState<ClaseConHorarios | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setError('Esa clase no existe.');
      setCargando(false);
      return;
    }
    let vigente = true;
    setCargando(true);
    setError(null);
    traerClase(id)
      .then((c) => { if (vigente) setClase(c); })
      .catch((e) => { if (vigente) setError(mensajeDeError(e, 'No se pudo cargar la clase.')); })
      .finally(() => { if (vigente) setCargando(false); });
    return () => { vigente = false; };
  }, [id, intento]);

  function reintentar() {
    setIntento((n) => n + 1);
  }

  return { clase, cargando, error, reintentar };
}