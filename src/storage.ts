import type { Category, Task, User } from './types';

const TASKS_KEY = 'taskflow.tasks.v2';
const CATEGORIES_KEY = 'taskflow.categories.v2';
const USER_KEY = 'taskflow.user';
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

export const storage = {
  getTasks: () => read<Task[]>(TASKS_KEY, seedTasks),
  saveTasks: (tasks: Task[]) => localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)),
  getCategories: () => read<Category[]>(CATEGORIES_KEY, seedCategories),
  saveCategories: (categories: Category[]) => localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories)),
  getUser: () => read<User | null>(USER_KEY, null),
  saveUser: (user: User | null) => user ? localStorage.setItem(USER_KEY, JSON.stringify(user)) : localStorage.removeItem(USER_KEY),
};
