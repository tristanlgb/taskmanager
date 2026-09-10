import { useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import { ImagePlus, X } from 'lucide-react';
import type { Category, TaskImage, TaskStatus } from '../types';
import { createId } from '../utils/task';

export interface TaskForm { title: string; description: string; status: TaskStatus; dueDate: string; categoryId: string; images: TaskImage[] }
export const emptyTaskForm: TaskForm = { title: '', description: '', status: 'pending', dueDate: '', categoryId: '', images: [] };
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

interface TaskModalProps {
  form: TaskForm;
  setForm: Dispatch<SetStateAction<TaskForm>>;
  categories: Category[];
  editing: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export function TaskModal({ form, setForm, categories, editing, onClose, onSubmit }: TaskModalProps) {
  const [uploadError, setUploadError] = useState('');
  const upload = async (files: FileList | null) => {
    if (!files) return;
    const validFiles = [...files].filter((file) => file.type.startsWith('image/') && file.size <= MAX_IMAGE_BYTES);
    setUploadError(validFiles.length === files.length ? '' : 'Solo se admiten imágenes de hasta 5 MB.');
    const images = await Promise.all(validFiles.map((file) => new Promise<TaskImage>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ id: createId(), dataUrl: String(reader.result), isCover: false });
      reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer la imagen.'));
      reader.readAsDataURL(file);
    })));
    setForm((current) => ({ ...current, images: [...current.images, ...images] }));
  };
  const submit = (event: FormEvent) => { event.preventDefault(); onSubmit(); };

  return <div className="modal-backdrop" onMouseDown={onClose}><form className="modal" onSubmit={submit} onMouseDown={(event) => event.stopPropagation()}>
    <div className="modal-head"><div><h2>{editing ? 'Editar tarea' : 'Nueva tarea'}</h2><p>{editing ? 'Actualizá la información de la tarea.' : 'Agregá una nueva tarea a tu espacio.'}</p></div><button type="button" aria-label="Cerrar" onClick={onClose}><X /></button></div>
    <div className="form">
      <label>Título<input required autoFocus value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ej. Preparar entrega final" /></label>
      <label>Descripción<textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Añadí contexto, notas o próximos pasos..." /></label>
      <div className="two"><label>Estado<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as TaskStatus })}><option value="pending">Pendiente</option><option value="in_progress">En progreso</option><option value="completed">Completada</option></select></label><label>Fecha límite<input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} /></label></div>
      <label>Categoría<select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}><option value="">Sin categoría</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      <label className="upload"><ImagePlus /><span>Agregar imágenes</span><small>PNG, JPG o WEBP · máximo 5 MB</small><input type="file" accept="image/*" multiple onChange={(event) => void upload(event.target.files)} /></label>
      {uploadError && <p className="automation-message" role="alert">{uploadError}</p>}
      {form.images.length > 0 && <div className="image-list">{form.images.map((image) => <div key={image.id}><img src={image.dataUrl} alt="Vista previa" /><button type="button" title="Portada" className={image.isCover ? 'cover-btn active' : 'cover-btn'} onClick={() => setForm({ ...form, images: form.images.map((item) => ({ ...item, isCover: item.id === image.id })) })}>★</button><button type="button" aria-label="Quitar imagen" className="remove-img" onClick={() => setForm({ ...form, images: form.images.filter((item) => item.id !== image.id) })}><X /></button></div>)}</div>}
    </div>
    <div className="modal-footer"><button type="button" className="secondary" onClick={onClose}>Cancelar</button><button className="primary" type="submit">{editing ? 'Guardar cambios' : 'Crear tarea'}</button></div>
  </form></div>;
}
