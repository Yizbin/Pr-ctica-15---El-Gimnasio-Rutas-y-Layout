import { Link } from "react-router-dom";
import { useSesion } from "../context/SesionContext";

export default function Encabezado() {
  const { usuario, cerrarSesion } = useSesion();
  return (
    <header>
      {}
      {usuario ? (
        <>
          <span>{usuario.nombre}</span>
          <button onClick={cerrarSesion}>Salir</button>
        </>
      ) : (
        <Link to="/entrar">Entrar</Link>
      )}
    </header>
  );
}