export default function PaginaEntrar() {
  return (
    <form className="formulario">
      <h1>Entrar</h1>
      <label className="campo">
        <span className="campo__etiqueta">Correo</span>
        <input className="campo__control" type="email" />
      </label>
      <label className="campo">
        <span className="campo__etiqueta">Contraseña</span>
        <input className="campo__control" type="password" />
      </label>
      <button className="boton boton--ancho" type="submit">Entrar</button>
    </form>
  );
}