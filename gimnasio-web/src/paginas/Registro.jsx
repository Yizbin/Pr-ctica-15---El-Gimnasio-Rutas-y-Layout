import { useState } from "react";
import { useNavigate } from "react-router-dom";
import cliente from "../api/cliente";
import { useSesion } from "../context/SesionContext";

export default function Entrar() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { iniciarSesion } = useSesion();
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await cliente.post("/auth/login", { email, password });
      iniciarSesion(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo iniciar sesion");
    }
  };

  return (
    <form onSubmit={manejarEnvio}>
      {}
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="error">{error}</p>}
      <button type="submit">Entrar</button>
    </form>
  );
}