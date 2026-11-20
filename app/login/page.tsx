"use client";

import { useState } from "react";
import { supabase } from "../supabase"; // OJO: la ruta para importar
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modoRegistro, setModoRegistro] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const manejarSesion = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("Cargando...");

    if (modoRegistro) {
      // Registrar usuario
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMensaje("Error: " + error.message);
      else setMensaje("¡Registro exitoso! Revisa tu correo o inicia sesión.");
    } else {
      // Iniciar sesión
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMensaje("Error: " + error.message);
      else {
        setMensaje("¡Bienvenido! Redirigiendo...");
        setTimeout(() => { window.location.href = "/editor"; }, 1000);
      }
    }
  };

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#111827', color: 'white' }}>
      <div style={{ background: '#1f2937', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', width: '100%', maxWidth: '400px' }}>
        
        <h2 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '24px' }}>
          {modoRegistro ? "Crear Cuenta" : "Iniciar Sesión"}
        </h2>

        <form onSubmit={manejarSesion} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '4px', display: 'block' }}>Correo electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #4b5563', background: '#111827', color: 'white' }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '4px', display: 'block' }}>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #4b5563', background: '#111827', color: 'white' }} 
            />
          </div>

          <button type="submit" style={{ background: '#3b82f6', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
            {modoRegistro ? "Registrarse" : "Entrar"}
          </button>
        </form>

        {mensaje && <p style={{ textAlign: 'center', marginTop: '16px', color: '#fbbf24', fontSize: '14px' }}>{mensaje}</p>}

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          <span style={{ color: '#9ca3af' }}>
            {modoRegistro ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
          </span>
          <button onClick={() => setModoRegistro(!modoRegistro)} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}>
            {modoRegistro ? "Inicia sesión" : "Regístrate"}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href="/" style={{ color: '#9ca3af', fontSize: '12px', textDecoration: 'none' }}>← Volver al inicio</Link>
        </div>
      </div>
    </main>
  );
}