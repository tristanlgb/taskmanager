import { CalendarDays, ImagePlus, Pencil, Trash2 } from 'lucide-react';
import type { Category, Task, TaskStatus } from '../types';
import { taskStatusLabels } from '../utils/task';

interface TaskCardProps {
  task: Task;
  category?: Category;
  onEdit: () => void;
  onDelete: () => void;
  onStatus: (status: TaskStatus) => void;
}

export function TaskCard({ task, category, onEdit, onDelete, onStatus }: TaskCardProps) {
  const cover = task.images.find((image) => image.isCover) ?? task.images[0];
  return <article className="task-card">
    {cover && <img className="cover" src={cover.dataUrl} alt={`Adjunto de ${task.title}`} />}
    <div className="task-content">
      <div className="task-top"><span className={`status ${task.status}`}>{taskStatusLabels[task.status]}</span><div className="card-actions">
        <button type="button" aria-label={`Editar ${task.title}`} onClick={onEdit}><Pencil /></button>
        <button type="button" aria-label={`Eliminar ${task.title}`} className="danger-icon" onClick={onDelete}><Trash2 /></button>
      </div></div>
      <h3>{task.title}</h3><p className="description">{task.description || 'Sin descripción.'}</p>
      <div className="task-meta">{category && <span className="category-pill"><i style={{ background: category.color }} />{category.name}</span>}
        {task.dueDate && <span><CalendarDays />{new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}</span>}
        {task.images.length > 0 && <span><ImagePlus />{task.images.length}</span>}
      </div>
      <label className="sr-only" htmlFor={`status-${task.id}`}>Estado de {task.title}</label>
      <select id={`status-${task.id}`} className="quick-status" value={task.status} onChange={(event) => onStatus(event.target.value as TaskStatus)}>
        <option value="pending">Pendiente</option><option value="in_progress">En progreso</option><option value="completed">Completada</option>
      </select>
    </div>
  </article>;
}
