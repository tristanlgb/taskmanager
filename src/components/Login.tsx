import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { User } from '../types';
import { createId } from '../utils/task';

export function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const [name, setName] = useState('Tristan');
  const [email, setEmail] = useState('tristan@example.com');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (cleanName && cleanEmail) onLogin({ id: createId(), name: cleanName, email: cleanEmail });
  };

  return <div className="login-page"><form className="login-card" onSubmit={submit}>
    <div className="brand login-brand"><div className="brand-mark"><CheckCircle2 /></div><span>TaskFlow</span></div>
    <h1>Bienvenido</h1><p>Tu espacio simple para organizar tareas, prioridades y proyectos.</p>
    <label>Nombre<input required value={name} onChange={(event) => setName(event.target.value)} /></label>
    <label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
    <button className="primary wide" type="submit">Ingresar</button>
    <small>Demo local · Los datos se guardan en tu navegador.</small>
  </form></div>;
}
