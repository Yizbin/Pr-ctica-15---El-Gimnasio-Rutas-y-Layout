import { api, type Sobre } from './api.ts';
import type { Clase, ClaseConHorarios, Inscripcion } from '../tipos.ts';

export async function traerClases(): Promise<Clase[]> {
  const respuesta = await api.get<Sobre<Clase[]>>('/clases');
  return respuesta.data.data;
}

export async function traerClase(id: number): Promise<ClaseConHorarios> {
  const respuesta = await api.get<Sobre<ClaseConHorarios>>(`/clases/${id}`);
  return respuesta.data.data;
}

export async function traerMisInscripciones(): Promise<Inscripcion[]> {
  const respuesta = await api.get<Sobre<Inscripcion[]>>('/inscripciones/mias');
  return respuesta.data.data;
}

export async function inscribirse(horarioId: number): Promise<void> {
  await api.post('/inscripciones', { horarioId });
}