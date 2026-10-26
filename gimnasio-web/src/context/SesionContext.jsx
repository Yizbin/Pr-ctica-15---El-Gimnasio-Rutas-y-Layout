import { createContext, useContext, useState } from "react";

const SesionContext = createContext(null);

export function SesionProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem("usuario");
    return guardado ? JSON.parse(guardado) : null;
  });

  const iniciarSesion = (nuevoToken, nuevoUsuario) => {
    localStorage.setItem("token", nuevoToken);
    localStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
    setToken(nuevoToken);
    setUsuario(nuevoUsuario);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
  };

  return (
    <SesionContext.Provider value={{ token, usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  const contexto = useContext(SesionContext);
  if (!contexto) {
    throw new Error("useSesion debe usarse dentro de un SesionProvider");
  }
  return contexto;
}