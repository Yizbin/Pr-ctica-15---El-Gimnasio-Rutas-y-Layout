import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { CLAVE_SESION, EVENTO_SESION_CERRADA, leerSesionGuardada } from '../servicios/api.ts';
import { entrar as entrarApi, registrar as registrarApi } from '../servicios/sesion.ts';
import type { Sesion } from '../tipos.ts';

interface ValorSesion {
  sesion: Sesion | null;
  entrar: (correo: string, password: string) => Promise<void>;
  registrar: (nombre: string, correo: string, password: string) => Promise<void>;
  salir: () => void;
}

const ContextoSesion = createContext<ValorSesion | null>(null);

export function SesionProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(leerSesionGuardada);

  useEffect(() => {
    const cerrar = () => setSesion(null);
    window.addEventListener(EVENTO_SESION_CERRADA, cerrar);
    return () => window.removeEventListener(EVENTO_SESION_CERRADA, cerrar);
  }, []);

  function guardar(nueva: Sesion) {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(nueva));
    setSesion(nueva);
  }

  async function entrar(correo: string, password: string) {
    guardar(await entrarApi(correo, password));
  }

  async function registrar(nombre: string, correo: string, password: string) {
    guardar(await registrarApi(nombre, correo, password));
  }

  function salir() {
    localStorage.removeItem(CLAVE_SESION);
    setSesion(null);
  }

  return (
    <ContextoSesion.Provider value={{ sesion, entrar, registrar, salir }}>
      {children}
    </ContextoSesion.Provider>
  );
}

export function useSesion(): ValorSesion {
  const valor = useContext(ContextoSesion);
  if (valor === null) {
    throw new Error('useSesion debe usarse dentro de <SesionProvider>');
  }
  return valor;
}