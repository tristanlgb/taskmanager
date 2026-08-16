import { Bell, Mail, Send, X } from 'lucide-react';
import type { NotificationPreferences } from './types';

export function NotificationModal({draft,setDraft,busy,message,onSave,onTest,onClose}:{draft:NotificationPreferences;setDraft:(value:NotificationPreferences)=>void;busy:boolean;message:string;onSave:()=>void;onTest:()=>void;onClose:()=>void}) {
  const telegramReady = draft.telegramConnected && Boolean(draft.telegramChatId);
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal notification-modal" onMouseDown={event=>event.stopPropagation()}>
    <div className="modal-head"><div><h2>Notificaciones</h2><p>Elegí cómo y cuándo querés recibir alertas.</p></div><button aria-label="Cerrar notificaciones" onClick={onClose}><X/></button></div>
    <div className="form notification-form">
      <section className="notification-channel"><div className="channel-title"><Mail/><div><strong>Email</strong><small>Usamos inicialmente el email de tu perfil.</small></div><label className="toggle"><input type="checkbox" checked={draft.emailEnabled} onChange={event=>setDraft({...draft,emailEnabled:event.target.checked})}/><span/></label></div><label>Email de destino<input type="email" disabled={!draft.emailEnabled} value={draft.emailAddress} onChange={event=>setDraft({...draft,emailAddress:event.target.value})} placeholder="nombre@ejemplo.com"/></label></section>
      <section className="notification-channel"><div className="channel-title"><Send/><div><strong>Telegram</strong><small>{telegramReady?'Bot conectado':'Conectá el bot y presioná Start para autorizar el chat.'}</small></div><span className={`connection-badge ${telegramReady?'connected':''}`}>{telegramReady?'Conectado':'Pendiente'}</span></div><button className="secondary telegram-connect" disabled type="button">{telegramReady?'Telegram conectado':'Bot pendiente de configurar en n8n'}</button></section>
      <section className="notification-options"><div className="channel-title"><Bell/><div><strong>Tipos de alerta</strong><small>Podés cambiar estas opciones cuando quieras.</small></div></div>
        <label className="check-row"><input type="checkbox" checked={draft.urgentAlerts} onChange={event=>setDraft({...draft,urgentAlerts:event.target.checked})}/><span>Tareas urgentes</span></label>
        <label className="check-row"><input type="checkbox" checked={draft.dueAlerts} onChange={event=>setDraft({...draft,dueAlerts:event.target.checked})}/><span>Próximos vencimientos</span></label>
        <label className="check-row"><input type="checkbox" checked={draft.dailySummary} onChange={event=>setDraft({...draft,dailySummary:event.target.checked})}/><span>Resumen diario</span></label>
        <div className="two"><label>Anticipación<select value={draft.advanceHours} onChange={event=>setDraft({...draft,advanceHours:Number(event.target.value)})}><option value={1}>1 hora antes</option><option value={6}>6 horas antes</option><option value={12}>12 horas antes</option><option value={24}>24 horas antes</option><option value={48}>48 horas antes</option></select></label><label>Horario del resumen<input type="time" disabled={!draft.dailySummary} value={draft.dailyTime} onChange={event=>setDraft({...draft,dailyTime:event.target.value})}/></label></div>
      </section>
      {message&&<p className="automation-message" role="status">{message}</p>}
      <small className="privacy-note">Las credenciales de correo y Telegram permanecen en n8n. TaskFlow solo guarda tus preferencias en este navegador.</small>
    </div>
    <div className="modal-footer"><button className="secondary" disabled={busy||(!draft.emailEnabled&&!telegramReady)} onClick={onTest}><Send/>{busy?'Enviando…':'Enviar prueba'}</button><button className="primary" onClick={onSave}>Guardar preferencias</button></div>
  </div></div>;
}
