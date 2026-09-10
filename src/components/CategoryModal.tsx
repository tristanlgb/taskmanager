import { useState, type FormEvent } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import type { Category } from '../types';

interface Props { categories: Category[]; onAdd: (name: string) => void; onDelete: (id: string) => void; onClose: () => void }

export function CategoryModal({ categories, onAdd, onDelete, onClose }: Props) {
  const [name, setName] = useState('');
  const submit = (event: FormEvent) => { event.preventDefault(); if (name.trim()) { onAdd(name); setName(''); } };
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal small" onMouseDown={(event) => event.stopPropagation()}>
    <div className="modal-head"><div><h2>Categorías</h2><p>Organizá tus tareas por contexto.</p></div><button type="button" aria-label="Cerrar" onClick={onClose}><X /></button></div>
    <form className="category-add" onSubmit={submit}><input aria-label="Nombre de la nueva categoría" placeholder="Nueva categoría" value={name} onChange={(event) => setName(event.target.value)} /><button className="primary" type="submit" aria-label="Agregar categoría"><Plus /></button></form>
    <div className="category-manager">{categories.map((category) => <div key={category.id}><span><i style={{ background: category.color }} />{category.name}</span><button type="button" aria-label={`Eliminar ${category.name}`} onClick={() => onDelete(category.id)}><Trash2 /></button></div>)}</div>
  </div></div>;
}
