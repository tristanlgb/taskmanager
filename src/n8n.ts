import type { AutomationResult, AutomationSettings, Category, NotificationPreferences, Task, User } from './types';

async function postToN8n(payload: object, settings: AutomationSettings): Promise<AutomationResult> {
  if (!settings.enabled || !settings.webhookUrl) throw new Error('Configurá y activá el webhook de n8n primero.');
  const response = await fetch(settings.webhookUrl, {
    method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`n8n respondió con estado ${response.status}.`);
  return response.json() as Promise<AutomationResult>;
}

export function sendTaskToN8n(task: Task, category: Category | undefined, user: User, settings: AutomationSettings, notifications: NotificationPreferences): Promise<AutomationResult> {
  return postToN8n({ source: 'taskflow', event: 'task_prioritized', task: { id: task.id, title: task.title, description: task.description, status: task.status, dueDate: task.dueDate, category: category?.name || 'Sin categoría' }, user: { name: user.name, email: user.email }, notifications, sentAt: new Date().toISOString() }, settings);
}

export function sendNotificationTest(user: User, settings: AutomationSettings, notifications: NotificationPreferences): Promise<AutomationResult> {
  return postToN8n({ source: 'taskflow', event: 'notification_test', task: { id: `test-${Date.now()}`, title: 'Prueba de notificaciones de TaskFlow', description: 'Mensaje de verificación solicitado desde el perfil.', status: 'pending', dueDate: new Date().toISOString().slice(0,10), category: 'Sistema' }, user: { name: user.name, email: user.email }, notifications, sentAt: new Date().toISOString() }, settings);
}
