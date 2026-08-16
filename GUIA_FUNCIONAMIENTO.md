# Cómo funciona TaskFlow

TaskFlow es una aplicación web para organizar tareas y convertir una lista de pendientes en un plan de trabajo priorizado. La aplicación guarda la información en el navegador y utiliza un workflow real de n8n Cloud para analizar las tareas más importantes.

## 1. Ingreso a la aplicación

1. Abrí [TaskFlow](https://taskmanagerreact-pi.vercel.app).
2. Escribí tu nombre y correo electrónico.
3. Pulsá **Ingresar**.
4. La sesión se guarda localmente en el navegador; no se envía una contraseña ni se crea una cuenta en un servidor.

## 2. Panel principal

Al ingresar se muestra el tablero **Mis tareas**. En la parte superior aparecen cuatro indicadores:

- **Total:** cantidad completa de tareas.
- **Pendientes:** tareas que todavía no comenzaron.
- **En progreso:** tareas que se están realizando.
- **Completadas:** tareas terminadas.

Debajo aparece el panel **Asistente automático**, seguido por los controles de búsqueda, filtros y las tarjetas de tareas.

## 3. Crear una tarea

1. Pulsá **Nueva tarea**.
2. Escribí un título obligatorio.
3. Agregá una descripción con el contexto necesario.
4. Elegí el estado: pendiente, en progreso o completada.
5. Seleccioná una fecha límite.
6. Asigná una categoría si corresponde.
7. Opcionalmente, adjuntá una o varias imágenes y elegí una como portada.
8. Pulsá **Crear tarea**.

La tarea aparece inmediatamente en el tablero y queda guardada en `localStorage`, el almacenamiento local del navegador.

## 4. Editar, completar o eliminar tareas

- El botón con forma de lápiz abre el formulario de edición.
- El selector inferior de cada tarjeta permite cambiar rápidamente el estado.
- El botón con forma de papelera elimina la tarea después de pedir confirmación.
- Las modificaciones se guardan automáticamente en el navegador.

## 5. Organizar mediante categorías

1. Pulsá el símbolo **+** junto al título **Categorías**.
2. Escribí el nombre de la nueva categoría.
3. Confirmá con el botón **+** o presionando Enter.
4. Al crear o editar una tarea, podés asignarle esa categoría.
5. Pulsá una categoría en la barra lateral para mostrar únicamente sus tareas.

Si eliminás una categoría, sus tareas permanecen guardadas, pero pasan a estar sin categoría.

## 6. Buscar y filtrar

- El buscador compara el texto escrito con el título y la descripción de cada tarea.
- El filtro de estado permite mostrar todas, pendientes, en progreso o completadas.
- Los filtros de categoría, estado y búsqueda funcionan al mismo tiempo.

## 7. Priorización local

Antes de llamar a n8n, TaskFlow realiza una primera selección en el navegador:

1. Ignora las tareas completadas.
2. Calcula cuántos días faltan para cada vencimiento.
3. Da mayor importancia a tareas vencidas, que vencen hoy o dentro de los próximos días.
4. También considera si una tarea ya está en progreso.
5. Ordena los resultados y muestra las tres tareas con mayor prioridad en el **Plan de foco sugerido**.

Esta selección permite que la aplicación siga siendo útil incluso si n8n está temporalmente desconectado.

## 8. Automatización real con n8n

Al pulsar **Automatizar jornada** ocurre el siguiente proceso:

1. TaskFlow cambia a **En progreso** las tareas seleccionadas que todavía estaban pendientes.
2. Envía cada una de las tres tareas prioritarias mediante una solicitud `POST` al webhook de producción:

   `https://tristanlgb.app.n8n.cloud/webhook/taskflow-prioritize`

3. El webhook recibe el título, descripción, estado, vencimiento, categoría y datos básicos del usuario.
4. El nodo **Calcular prioridad en n8n** evalúa el estado y la cercanía del vencimiento.
5. n8n genera:

   - una prioridad: `low`, `medium`, `high` o `critical`;
   - un puntaje entre 0 y 100;
   - un resumen breve;
   - tres próximos pasos;
   - una indicación de urgencia.

6. El nodo **Responder a TaskFlow** devuelve el resultado en formato JSON.
7. TaskFlow muestra un mensaje indicando cuántas tareas fueron procesadas y cuántas resultaron prioritarias.

El workflow funciona dentro de n8n Cloud y no necesita claves de OpenAI, Google Sheets, Gmail ni Telegram.

## 9. Configurar otro webhook

El engranaje del panel automático abre la configuración de n8n.

1. Pegá la URL de otro webhook de producción.
2. Activá **Ejecución externa al automatizar**.
3. Pulsá **Guardar conexión**.

La configuración queda guardada localmente. Si no existe una configuración anterior, TaskFlow utiliza y activa automáticamente el webhook oficial del proyecto.

## 10. Persistencia de datos

TaskFlow utiliza estas entradas de `localStorage`:

- `taskflow.tasks.v2`: tareas.
- `taskflow.categories.v2`: categorías.
- `taskflow.user`: sesión local.
- `taskflow.automation.v1`: URL y estado de la automatización.

Esto significa que los datos permanecen al recargar la página, pero son específicos del navegador y dispositivo utilizados. Limpiar los datos del sitio elimina la información local.

## 11. Flujo técnico resumido

```text
Usuario
  → crea y organiza tareas en React
  → TaskFlow guarda los datos en localStorage
  → el plan local elige hasta tres tareas
  → TaskFlow envía cada tarea al webhook
  → n8n calcula prioridad y próximos pasos
  → n8n responde en JSON
  → TaskFlow informa el resultado al usuario
```

## 12. Tecnologías utilizadas

- React y TypeScript para la interfaz.
- Vite para desarrollo y compilación.
- CSS responsive para escritorio y dispositivos móviles.
- `localStorage` para persistencia local.
- n8n Cloud para la automatización externa.
- GitHub para control de versiones.
- Vercel para el despliegue de producción.

## 13. Ejecutar el proyecto localmente

```bash
npm install
npm run dev
```

Para verificar la compilación de producción:

```bash
npm run build
```

La URL del webhook también puede definirse durante la compilación mediante la variable `VITE_N8N_WEBHOOK_URL`.
