import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { Layout } from './componentes/Layout.tsx';
import { NoEncontrado } from './componentes/NoEncontrado.tsx';
import { RutaProtegida } from './componentes/RutaProtegida.tsx';
const PaginaClases = lazy(() => import('./paginas/PaginaClases.tsx'));
const PaginaClase = lazy(() => import('./paginas/PaginaClase.tsx'));
const PaginaEntrar = lazy(() => import('./paginas/PaginaEntrar.tsx'));
const PaginaRegistro = lazy(() => import('./paginas/PaginaRegistro.tsx'));
const PaginaMisInscripciones = lazy(() => import('./paginas/PaginaMisInscripciones.tsx'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/clases" replace />} />
        <Route path="clases">
          <Route index element={<PaginaClases />} />
          <Route path=":id" element={<PaginaClase />} />
        </Route>
        <Route path="entrar" element={<PaginaEntrar />} />
        <Route path="registro" element={<PaginaRegistro />} />
        <Route element={<RutaProtegida />}>
          <Route path="mis-inscripciones" element={<PaginaMisInscripciones />} />
        </Route>
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}