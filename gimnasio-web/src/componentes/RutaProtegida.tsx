import { Navigate, Outlet, useLocation } from 'react-router';
import { useSesion } from '../context/SesionContext.tsx';

export function RutaProtegida() {
  const { sesion } = useSesion();
  const ubicacion = useLocation();

  if (!sesion) {
    return <Navigate to="/entrar" replace state={{ desde: ubicacion.pathname }} />;
  }
  return <Outlet />;
}