# Automatización de TaskFlow con n8n

Recibe tareas desde TaskFlow, usa IA para calcular prioridad y próximos pasos, registra cada análisis en Google Sheets y envía alertas por Telegram y Gmail cuando una tarea es urgente.

## Activación

1. En n8n, usá **Import from file** con `taskflow-automation.json`.
2. Asigná credenciales válidas a OpenAI, Google Sheets, Telegram y Gmail.
3. Creá una hoja `Tareas` con: `Fecha`, `Tarea`, `Responsable`, `Prioridad`, `Puntaje` y `Resumen`.
4. Reemplazá `REEMPLAZAR_SPREADSHEET_ID` y `REEMPLAZAR_CHAT_ID`.
5. Probá, activá el workflow y copiá la URL de producción del webhook.
6. Pegala en el engranaje del panel automático de TaskFlow y activá la conexión.

Las credenciales permanecen en n8n. TaskFlow solo transmite los datos de las tareas seleccionadas cuando el usuario pulsa **Automatizar jornada**.
