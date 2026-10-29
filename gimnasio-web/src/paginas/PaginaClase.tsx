import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useClase } from '../hooks/useClase.ts';
import { useSesion } from '../context/SesionContext.tsx';
import { inscribirse } from '../servicios/gimnasio.ts';
import { mensajeDeError, urlImagen } from '../servicios/api.ts';
import { Cargando } from '../componentes/Cargando.tsx';
import { MensajeError } from '../componentes/MensajeError.tsx';

interface Aviso {
  tipo: 'exito' | 'error';
  texto: string;
}

export default function PaginaClase() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { sesion } = useSesion();
  const { clase, cargando, error, reintentar } = useClase(Number(id));
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [inscribiendoId, setInscribiendoId] = useState<number | null>(null);

  async function inscribirme(horarioId: number) {
    if (!sesion) {
      navegar('/entrar', { state: { desde: `/clases/${id}` } });
      return;
    }
    setAviso(null);
    setInscribiendoId(horarioId);
    try {
      await inscribirse(horarioId);
      setAviso({ tipo: 'exito', texto: '¡Listo! Quedaste inscrito en ese horario.' });
      reintentar();
    } catch (e) {
      setAviso({ tipo: 'error', texto: mensajeDeError(e, 'No se pudo completar la inscripción.') });
    } finally {
      setInscribiendoId(null);
    }
  }

  if (cargando) return <Cargando />;
  if (error || !clase) {
    return <MensajeError mensaje={error ?? 'Esa clase no existe.'} onReintentar={reintentar} />;
  }

  return (
    <>
      <Link to="/clases" className="detalle__volver">← Todas las clases</Link>

      <article className="detalle">
        <img className="detalle__imagen" src={urlImagen(clase.imagen)} alt={clase.nombre} />
        <div className="detalle__datos">
          <span className={`etiqueta etiqueta--${clase.categoria}`}>{clase.categoria}</span>
          <h1>{clase.nombre}</h1>
          <p className="pagina__bajada">{clase.descripcion} · {clase.duracionMin} min</p>

          {aviso && <p className={`aviso aviso--${aviso.tipo}`}>{aviso.texto}</p>}

          <h2>Horarios</h2>
          <ul className="horarios">
            {clase.horarios.map((h) => (
              <li key={h.id} className="horario">
                <div>
                  <div className="horario__dia">{h.dia} · {h.horaInicio}</div>
                  <div className="horario__meta">
                    {h.entrenador} · {h.disponibles} de {h.cupoMaximo} lugares
                  </div>
                </div>
                {h.disponibles === 0 ? (
                  <span className="horario__lleno">Lleno</span>
                ) : (
                  <button
                    className="boton boton--chico"
                    disabled={inscribiendoId !== null}
                    onClick={() => inscribirme(h.id)}
                  >
                    {inscribiendoId === h.id ? 'Inscribiendo…' : 'Inscribirme'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </>
  );
}