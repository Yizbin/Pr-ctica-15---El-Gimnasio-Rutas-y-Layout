import axios from 'axios';
import type { Sesion } from '../tipos.ts';

export const URL_API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: URL_API,
  timeout: 5000,
});

export const CLAVE_SESION = 'sesion';
export const EVENTO_SESION_CERRADA = 'sesion-cerrada';

export function leerSesionGuardada(): Sesion | null {
  try {
    const texto = localStorage.getItem(CLAVE_SESION);
    return texto ? (JSON.parse(texto) as Sesion) : null;
  } catch {
    return null;
  }
}

api.interceptors.request.use((config) => {
  const sesion = leerSesionGuardada();
  if (sesion) {
    config.headers.Authorization = `Bearer ${sesion.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const hayRespuesta401 = axios.isAxiosError(error) && error.response?.status === 401;
    if (hayRespuesta401 && error.config?.url !== '/auth/login' && leerSesionGuardada()) {
      localStorage.removeItem(CLAVE_SESION);
      window.dispatchEvent(new Event(EVENTO_SESION_CERRADA));
    }
    return Promise.reject(error);
  },
);

export interface Sobre<T> {
  data: T;
}

export function urlImagen(ruta: string): string {
  return `${URL_API}${ruta}`;
}

export function mensajeDeError(e: unknown, generico: string): string {
  if (axios.isAxiosError(e)) {
    if (e.response?.status === 401 && e.config?.url !== '/auth/login') {
      return 'Tu sesión terminó. Vuelve a entrar.';
    }
    const mensaje = e.response?.data?.message;
    if (Array.isArray(mensaje)) return mensaje.join('. ');
    if (typeof mensaje === 'string') return mensaje;
  }
  return generico;
}