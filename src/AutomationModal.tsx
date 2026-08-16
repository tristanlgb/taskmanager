import { useState } from 'react';
import { Send, X } from 'lucide-react';
import type { AutomationSettings } from './types';

export function AutomationModal({settings,message,onSave,onClose}:{settings:AutomationSettings;message:string;onSave:(settings:AutomationSettings)=>void;onClose:()=>void}) {
  const [draft,setDraft]=useState(settings);
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal small" onMouseDown={event=>event.stopPropagation()}>
    <div className="modal-head"><div><h2>Automatización con n8n</h2><p>Conectá TaskFlow con IA, Google Sheets y alertas.</p></div><button onClick={onClose}><X/></button></div>
    <div className="form automation-form">
      <label>Webhook de producción<input type="url" value={draft.webhookUrl} onChange={event=>setDraft({...draft,webhookUrl:event.target.value})} placeholder="https://.../webhook/taskflow-prioritize"/></label>
      <label className="switch-row"><input type="checkbox" checked={draft.enabled} onChange={event=>setDraft({...draft,enabled:event.target.checked})}/><span>Activar ejecución externa al automatizar</span></label>
      <div className="automation-flow"><span>TaskFlow</span><b>→</b><span>IA</span><b>→</b><span>Sheets</span><b>→</b><span>Telegram / Gmail</span></div>
      {message&&<p className="automation-message">{message}</p>}
      <small>Importá <b>n8n/taskflow-automation.json</b> en n8n, asigná las credenciales y activá el workflow.</small>
    </div>
    <div className="modal-footer"><button className="secondary" onClick={onClose}>Cerrar</button><button className="primary" onClick={()=>onSave(draft)}><Send/>Guardar conexión</button></div>
  </div></div>;
}
