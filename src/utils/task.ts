import type { Task, TaskStatus } from '../types';

export const DAY_MS = 86_400_000;

export const taskStatusLabels: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completada',
};

export function createId(): string {
  return crypto.randomUUID();
}

export function daysUntil(dueDate: string, now = new Date()): number {
  if (!dueDate) return Number.POSITIVE_INFINITY;
  const [year, month, day] = dueDate.split('-').map(Number);
  if (!year || !month || !day) return Number.POSITIVE_INFINITY;
  const due = new Date(year, month - 1, day, 23, 59, 59, 999);
  return Math.ceil((due.getTime() - now.getTime()) / DAY_MS);
}

export function getFocusTasks(tasks: Task[]) {
  return tasks
    .filter((task) => task.status !== 'completed')
    .map((task) => {
      const days = daysUntil(task.dueDate);
      const score = (task.status === 'in_progress' ? 25 : 0)
        + (days < 0 ? 100 : days === 0 ? 80 : days <= 2 ? 60 : days <= 7 ? 30 : 0);
      return { task, days, score };
    })
    .sort((a, b) => b.score - a.score || a.days - b.days)
    .slice(0, 3);
}

export function formatDueDays(days: number): string {
  if (!Number.isFinite(days)) return 'Sin fecha';
  if (days < 0) return `${Math.abs(days)}d vencida`;
  if (days === 0) return 'Hoy';
  return `${days}d`;
}
