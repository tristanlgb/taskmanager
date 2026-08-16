# Automatización real de TaskFlow con n8n

El workflow recibe tareas desde TaskFlow, calcula prioridad y próximos pasos dentro de n8n y devuelve un resultado estructurado a la aplicación.

## Flujo activo

1. `TaskFlow Webhook` recibe la tarea por `POST`.
2. `Calcular prioridad en n8n` evalúa estado y vencimiento.
3. `Responder a TaskFlow` devuelve prioridad, puntaje, resumen y próximos pasos.

El workflow no necesita credenciales externas. La URL puede reemplazarse con `VITE_N8N_WEBHOOK_URL` o desde la configuración de TaskFlow.
