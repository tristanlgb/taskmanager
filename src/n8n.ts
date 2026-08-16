import type { AutomationResult, AutomationSettings, Category, Task, User } from './types';

export async function sendTaskToN8n(task: Task, category: Category | undefined, user: User, settings: AutomationSettings): Promise<AutomationResult> {
  if (!settings.enabled || !settings.webhookUrl) throw new Error('Configurá y activá el webhook de n8n primero.');
  const response = await fetch(settings.webhookUrl, {
    method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: JSON.stringify({ source: 'taskflow', task: { id: task.id, title: task.title, description: task.description, status: task.status, dueDate: task.dueDate, category: category?.name || 'Sin categoría' }, user: { name: user.name, email: user.email }, sentAt: new Date().toISOString() }),
  });
  if (!response.ok) throw new Error(`n8n respondió con estado ${response.status}.`);
  return response.json() as Promise<AutomationResult>;
}
