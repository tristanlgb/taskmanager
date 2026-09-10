import { useEffect, useMemo, useState } from 'react';
import { Archive, CheckCircle2, ChevronDown, Circle, Clock3, Filter, LoaderCircle, Menu, Plus, Search, Settings2, Zap } from 'lucide-react';
import { AutomationModal } from './AutomationModal';
import { NotificationModal } from './NotificationModal';
import { CategoryModal } from './components/CategoryModal';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { TaskCard } from './components/TaskCard';
import { emptyTaskForm, TaskModal, type TaskForm } from './components/TaskModal';
import { sendNotificationTest, sendTaskToN8n } from './n8n';
import { storage } from './storage';
import type { AutomationSettings, Category, NotificationPreferences, Task, TaskStatus, User } from './types';
import { createId, formatDueDays, getFocusTasks } from './utils/task';
import './automation.css';

type StatusFilter = 'all' | TaskStatus;
const categoryColors = ['#8b5cf6', '#06b6d4', '#f97316', '#ec4899', '#22c55e'];

export default function App() {
  const [user, setUser] = useState<User | null>(() => storage.getUser());
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks());
  const [categories, setCategories] = useState<Category[]>(() => storage.getCategories());
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState<TaskForm>(emptyTaskForm);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [automation, setAutomation] = useState<AutomationSettings>(() => storage.getAutomation());
  const [automationOpen, setAutomationOpen] = useState(false);
  const [automationBusy, setAutomationBusy] = useState(false);
  const [automationMessage, setAutomationMessage] = useState('');
  const [automationError, setAutomationError] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreferences>(() => storage.getNotifications(storage.getUser()?.email));
  const [notificationDraft, setNotificationDraft] = useState(notifications);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationBusy, setNotificationBusy] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => storage.saveTasks(tasks), [tasks]);
  useEffect(() => storage.saveCategories(categories), [categories]);
  useEffect(() => storage.saveNotifications(notifications), [notifications]);
  useEffect(() => {
    if (!user || notifications.emailAddress) return;
    const next = { ...notifications, emailAddress: user.email };
    setNotifications(next);
    setNotificationDraft(next);
  }, [user, notifications]);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('es');
    return tasks.filter((task) => (filter === 'all' || task.categoryId === filter)
      && (statusFilter === 'all' || task.status === statusFilter)
      && `${task.title} ${task.description}`.toLocaleLowerCase('es').includes(query));
  }, [tasks, filter, statusFilter, search]);
  const focusTasks = useMemo(() => getFocusTasks(tasks), [tasks]);

  if (!user) return <Login onLogin={(next) => { storage.saveUser(next); setUser(next); }} />;

  const openNewTask = () => { setEditing(null); setForm(emptyTaskForm); setTaskModalOpen(true); };
  const openEditTask = (task: Task) => {
    setEditing(task);
    setForm({ title: task.title, description: task.description, status: task.status, dueDate: task.dueDate, categoryId: task.categoryId ?? '', images: task.images });
    setTaskModalOpen(true);
  };
  const saveTask = () => {
    const title = form.title.trim();
    if (!title) return;
    const values = { ...form, title, description: form.description.trim(), categoryId: form.categoryId || null };
    setTasks((current) => editing
      ? current.map((task) => task.id === editing.id ? { ...task, ...values } : task)
      : [{ id: createId(), ...values, createdAt: new Date().toISOString() }, ...current]);
    setTaskModalOpen(false);
  };
  const removeTask = (id: string) => { if (confirm('¿Eliminar esta tarea?')) setTasks((current) => current.filter((task) => task.id !== id)); };
  const addCategory = (name: string) => {
    const cleanName = name.trim();
    if (cleanName) setCategories((current) => [...current, { id: createId(), name: cleanName, color: categoryColors[current.length % categoryColors.length] }]);
  };
  const removeCategory = (id: string) => {
    setCategories((current) => current.filter((category) => category.id !== id));
    setTasks((current) => current.map((task) => task.categoryId === id ? { ...task, categoryId: null } : task));
    if (filter === id) setFilter('all');
  };
  const openNotifications = () => { setNotificationDraft(notifications); setNotificationMessage(''); setNotificationsOpen(true); };
  const saveNotifications = () => {
    if (notificationDraft.emailEnabled && !notificationDraft.emailAddress.trim()) { setNotificationMessage('Ingresá un email de destino válido.'); return; }
    setNotifications({ ...notificationDraft, emailAddress: notificationDraft.emailAddress.trim() });
    setNotificationsOpen(false);
  };
  const testNotifications = async () => {
    setNotificationBusy(true); setNotificationMessage('');
    try {
      const result = await sendNotificationTest(user, automation, notificationDraft);
      setNotificationMessage(`Email: ${result.delivery?.email ?? 'not_configured'} · Telegram: ${result.delivery?.telegram ?? 'not_configured'}`);
    } catch (error) { setNotificationMessage(error instanceof Error ? error.message : 'No se pudo ejecutar la prueba.'); }
    finally { setNotificationBusy(false); }
  };
  const prioritizeTasks = async () => {
    if (!automation.enabled || !automation.webhookUrl) { setAutomationError(true); setAutomationMessage('Activá la conexión con n8n desde el engranaje.'); return; }
    setAutomationBusy(true); setAutomationError(false); setAutomationMessage('');
    try {
      const results = await Promise.all(focusTasks.map(({ task }) => sendTaskToN8n(task, categories.find((category) => category.id === task.categoryId), user, automation, notifications)));
      const ids = new Set(focusTasks.map(({ task }) => task.id));
      setTasks((current) => current.map((task) => ids.has(task.id) && task.status === 'pending' ? { ...task, status: 'in_progress' } : task));
      const critical = results.filter((result) => result.priority === 'critical' || result.priority === 'high').length;
      const delivered = results.filter((result) => result.delivery?.email === 'sent' || result.delivery?.telegram === 'sent').length;
      setAutomationMessage(`${results.length} tareas priorizadas${critical ? ` · ${critical} urgentes` : ''}${delivered ? ` · ${delivered} notificadas` : ''}`);
    } catch (error) { setAutomationError(true); setAutomationMessage(error instanceof Error ? error.message : 'No se pudo conectar con n8n.'); }
    finally { setAutomationBusy(false); }
  };

  const stats = { all: tasks.length, pending: tasks.filter((task) => task.status === 'pending').length, progress: tasks.filter((task) => task.status === 'in_progress').length, done: tasks.filter((task) => task.status === 'completed').length };
  const urgentCount = focusTasks.filter(({ days }) => days <= 2).length;

  return <div className="app-shell">
    <Sidebar user={user} tasks={tasks} categories={categories} filter={filter} statusFilter={statusFilter} mobileOpen={mobileOpen} onFilter={(category, status) => { setFilter(category); setStatusFilter(status); }} onCategories={() => setCategoryModalOpen(true)} onNotifications={openNotifications} onLogout={() => { storage.saveUser(null); setUser(null); }} onClose={() => setMobileOpen(false)} />
    <main className="main">
      <header><button type="button" className="menu" aria-label="Abrir menú" onClick={() => setMobileOpen(true)}><Menu /></button><div><h1>Mis tareas</h1><p>Organizá tu trabajo y mantené el foco.</p></div><button type="button" className="primary" onClick={openNewTask}><Plus />Nueva tarea</button></header>
      <section className="stats"><Stat icon={<Archive />} label="Total" value={stats.all} /><Stat icon={<Circle />} label="Pendientes" value={stats.pending} /><Stat icon={<Clock3 />} label="En progreso" value={stats.progress} /><Stat icon={<CheckCircle2 />} label="Completadas" value={stats.done} /></section>
      <section className="automation-panel" aria-label="Priorización automática">
        <div className="automation-summary"><span className="automation-icon"><Zap /></span><div><strong>Prioridad automática</strong><small>{focusTasks.length ? `${focusTasks.length} sugeridas${urgentCount ? ` · ${urgentCount} urgentes` : ''}` : 'Sin tareas para priorizar'}</small></div></div>
        <div className="focus-list">{focusTasks.map(({ task, days }) => <span key={task.id} title={task.title}><strong>{task.title}</strong><small className={days < 0 ? 'overdue' : ''}>{formatDueDays(days)}</small></span>)}</div>
        <div className="automation-actions"><button type="button" className="automation-settings" aria-label="Configurar n8n" onClick={() => setAutomationOpen(true)}><Settings2 /></button><button type="button" className="automation-button" disabled={!focusTasks.length || automationBusy} onClick={() => void prioritizeTasks()}>{automationBusy ? <LoaderCircle className="spin" /> : <Zap />}{automationBusy ? 'Procesando…' : 'Priorizar'}</button></div>
        {automationMessage && <p className={`automation-feedback ${automationError ? 'error' : ''}`} role="status">{automationMessage}</p>}
      </section>
      <section className="toolbar"><div className="search"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar tareas..." /></div><div className="select-wrap"><Filter /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}><option value="all">Todos los estados</option><option value="pending">Pendientes</option><option value="in_progress">En progreso</option><option value="completed">Completadas</option></select><ChevronDown /></div></section>
      <section className="task-grid">{filteredTasks.length ? filteredTasks.map((task) => <TaskCard key={task.id} task={task} category={categories.find((category) => category.id === task.categoryId)} onEdit={() => openEditTask(task)} onDelete={() => removeTask(task.id)} onStatus={(status) => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, status } : item))} />) : <div className="empty"><CheckCircle2 /><h3>No hay tareas</h3><p>Probá cambiando los filtros o creá una tarea nueva.</p><button type="button" className="primary" onClick={openNewTask}><Plus />Crear tarea</button></div>}</section>
    </main>
    {taskModalOpen && <TaskModal form={form} setForm={setForm} categories={categories} editing={Boolean(editing)} onClose={() => setTaskModalOpen(false)} onSubmit={saveTask} />}
    {categoryModalOpen && <CategoryModal categories={categories} onAdd={addCategory} onDelete={removeCategory} onClose={() => setCategoryModalOpen(false)} />}
    {automationOpen && <AutomationModal settings={automation} message={automationMessage} onSave={(settings) => { storage.saveAutomation(settings); setAutomation(settings); setAutomationError(false); setAutomationMessage('Conexión actualizada'); setAutomationOpen(false); }} onClose={() => setAutomationOpen(false)} />}
    {notificationsOpen && <NotificationModal draft={notificationDraft} setDraft={setNotificationDraft} busy={notificationBusy} message={notificationMessage} onSave={saveNotifications} onTest={() => void testNotifications()} onClose={() => setNotificationsOpen(false)} />}
  </div>;
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>;
}
