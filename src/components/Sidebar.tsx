import { Bell, CheckCircle2, Circle, Clock3, LayoutDashboard, LogOut, Plus, X } from 'lucide-react';
import type { Category, Task, TaskStatus, User } from '../types';

interface Props {
  user: User; tasks: Task[]; categories: Category[]; filter: string; statusFilter: 'all' | TaskStatus; mobileOpen: boolean;
  onFilter: (category: string, status: 'all' | TaskStatus) => void;
  onCategories: () => void; onNotifications: () => void; onLogout: () => void; onClose: () => void;
}

export function Sidebar({ user, tasks, categories, filter, statusFilter, mobileOpen, onFilter, onCategories, onNotifications, onLogout, onClose }: Props) {
  const counts = { all: tasks.length, pending: tasks.filter((t) => t.status === 'pending').length, progress: tasks.filter((t) => t.status === 'in_progress').length, done: tasks.filter((t) => t.status === 'completed').length };
  const navigate = (category: string, status: 'all' | TaskStatus) => { onFilter(category, status); onClose(); };
  return <>
    <aside className={`sidebar ${mobileOpen ? 'show' : ''}`}>
      <div className="brand"><div className="brand-mark"><CheckCircle2 /></div><span>TaskFlow</span><button type="button" className="mobile-close" aria-label="Cerrar menú" onClick={onClose}><X /></button></div>
      <div className="nav-section"><p>ESPACIO DE TRABAJO</p>
        <button className={`nav-item ${filter === 'all' && statusFilter === 'all' ? 'active' : ''}`} onClick={() => navigate('all', 'all')}><LayoutDashboard />Todas las tareas<span>{counts.all}</span></button>
        <button className={`nav-item ${filter === 'all' && statusFilter === 'pending' ? 'active' : ''}`} onClick={() => navigate('all', 'pending')}><Circle />Tareas pendientes<span>{counts.pending}</span></button>
        <button className={`nav-item ${filter === 'all' && statusFilter === 'in_progress' ? 'active' : ''}`} onClick={() => navigate('all', 'in_progress')}><Clock3 />En curso<span>{counts.progress}</span></button>
        <button className={`nav-item ${filter === 'all' && statusFilter === 'completed' ? 'active' : ''}`} onClick={() => navigate('all', 'completed')}><CheckCircle2 />Completadas<span>{counts.done}</span></button>
      </div>
      <div className="nav-section categories"><div className="section-head"><p>CATEGORÍAS</p><button type="button" aria-label="Administrar categorías" onClick={onCategories}><Plus /></button></div>
        {categories.map((category) => <button key={category.id} className={`nav-item ${filter === category.id ? 'selected' : ''}`} onClick={() => navigate(category.id, 'all')}><i style={{ background: category.color }} />{category.name}<span>{tasks.filter((task) => task.categoryId === category.id).length}</span></button>)}
      </div>
      <div className="sidebar-bottom"><div className="avatar">{user.name.slice(0, 2).toUpperCase()}</div><div><strong>{user.name}</strong><small>{user.email}</small></div><button type="button" aria-label="Configurar notificaciones" title="Notificaciones" onClick={onNotifications}><Bell /></button><button type="button" aria-label="Cerrar sesión" title="Cerrar sesión" onClick={onLogout}><LogOut /></button></div>
    </aside>
    {mobileOpen && <div className="overlay" onClick={onClose} />}
  </>;
}
