# TaskFlow — React + TypeScript

Conversión del proyecto Laravel Task Manager a una SPA moderna en React + TypeScript.

## Funcionalidades

- Inicio de sesión local de demostración.
- CRUD de tareas.
- Estados: pendiente, en progreso y completada.
- Fechas límite.
- CRUD de categorías.
- Filtro por categoría y estado.
- Búsqueda de tareas.
- Carga de múltiples imágenes y selección de portada.
- Persistencia mediante `localStorage`.
- Diseño responsive.

## Stack

- React
- TypeScript
- Vite
- CSS moderno
- Lucide React

## Ejecutar

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Automatización con n8n

TaskFlow envía su plan diario a un workflow real de n8n Cloud que calcula prioridad, puntaje y próximos pasos para cada tarea. El webhook se configura desde el engranaje del panel automático o mediante `VITE_N8N_WEBHOOK_URL`.

> Esta versión reemplaza el backend Laravel por persistencia local para que pueda ejecutarse como frontend independiente. Para producción se puede conectar posteriormente a NestJS/Express + MongoDB o a cualquier API REST.
