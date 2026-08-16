export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Category { id: string; name: string; color: string; }
export interface TaskImage { id: string; dataUrl: string; isCover: boolean; }
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  categoryId: string | null;
  images: TaskImage[];
  createdAt: string;
}
export interface User { id: string; name: string; email: string; }
export interface AutomationSettings { webhookUrl: string; enabled: boolean; }
export type DeliveryStatus = 'sent'|'skipped'|'not_configured'|'failed';
export interface NotificationPreferences {
  emailEnabled: boolean;
  emailAddress: string;
  telegramEnabled: boolean;
  telegramConnected: boolean;
  telegramChatId?: string;
  urgentAlerts: boolean;
  dueAlerts: boolean;
  dailySummary: boolean;
  advanceHours: number;
  dailyTime: string;
}
export interface AutomationResult {
  priority: 'low'|'medium'|'high'|'critical';
  score: number;
  summary: string;
  reason?: string;
  nextSteps: string[];
  delivery: { email: DeliveryStatus; telegram: DeliveryStatus };
  processedAt?: string;
  taskId?: string;
}
