import type { AutomationSettings, Category, NotificationPreferences, Task, User } from './types';

const TASKS_KEY = 'taskflow.tasks.v2';
const CATEGORIES_KEY = 'taskflow.categories.v2';
const USER_KEY = 'taskflow.user';
const AUTOMATION_KEY = 'taskflow.automation.v1';
const NOTIFICATIONS_KEY = 'taskflow.notifications.v1';
const dateFromNow = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

const seedCategories: Category[] = [
  { id: 'work', name: 'Trabajo', color: '#7c3aed' },
  { id: 'personal', name: 'Personal', color: '#14b8a6' },
  { id: 'study', name: 'Estudio', color: '#f59e0b' },
];

const seedTasks: Task[] = [
  { id: '1', title: 'Preparar presentación del proyecto', description: 'Revisar los últimos cambios y preparar una demo breve para el equipo.', status: 'in_progress', dueDate: dateFromNow(1), categoryId: 'work', images: [], createdAt: new Date().toISOString() },
  { id: '2', title: 'Repasar React + TypeScript', description: 'Hooks, tipos discriminados y manejo de formularios.', status: 'pending', dueDate: dateFromNow(3), categoryId: 'study', images: [], createdAt: new Date(Date.now() - 86_400_000).toISOString() },
  { id: '3', title: 'Organizar pendientes semanales', description: 'Cerrar tareas pequeñas y ordenar las prioridades de la semana.', status: 'completed', dueDate: dateFromNow(0), categoryId: 'personal', images: [], createdAt: new Date(Date.now() - 172_800_000).toISOString() },
];

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`No se pudo guardar ${key} en el navegador.`, error);
  }
}

function normalizeTasks(tasks: Task[]): Task[] {
  if (!Array.isArray(tasks)) return seedTasks;
  return tasks.filter((task) => task && typeof task.id === 'string').map((task) => ({
    ...task,
    title: typeof task.title === 'string' ? task.title : '',
    description: typeof task.description === 'string' ? task.description : '',
    dueDate: typeof task.dueDate === 'string' ? task.dueDate : '',
    categoryId: typeof task.categoryId === 'string' ? task.categoryId : null,
    images: Array.isArray(task.images) ? task.images : [],
    createdAt: typeof task.createdAt === 'string' ? task.createdAt : new Date().toISOString(),
  }));
}

export const storage = {
  getTasks: () => normalizeTasks(read<Task[]>(TASKS_KEY, seedTasks)),
  saveTasks: (tasks: Task[]) => write(TASKS_KEY, tasks),
  getCategories: () => read<Category[]>(CATEGORIES_KEY, seedCategories),
  saveCategories: (categories: Category[]) => write(CATEGORIES_KEY, categories),
  getUser: () => read<User | null>(USER_KEY, null),
  saveUser: (user: User | null) => {
    try {
      if (user) write(USER_KEY, user);
      else localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('No se pudo actualizar la sesión local.', error);
    }
  },
  getAutomation: () => {
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://tristanlgb.app.n8n.cloud/webhook/taskflow-prioritize';
    const saved = read<AutomationSettings>(AUTOMATION_KEY, { webhookUrl, enabled: true });
    return saved.webhookUrl ? saved : { webhookUrl, enabled: true };
  },
  saveAutomation: (settings: AutomationSettings) => write(AUTOMATION_KEY, settings),
  getNotifications: (email = '') => read<NotificationPreferences>(NOTIFICATIONS_KEY, {
    emailEnabled: false, emailAddress: email, telegramEnabled: false, telegramConnected: false,
    urgentAlerts: true, dueAlerts: true, dailySummary: false, advanceHours: 24, dailyTime: '09:00',
  }),
  saveNotifications: (settings: NotificationPreferences) => write(NOTIFICATIONS_KEY, settings),
};
