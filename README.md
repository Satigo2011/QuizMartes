# Biblioteca

Proyecto sencillo con una API en Express y una interfaz en Vue.

## Requisitos

Instala Node.js (versión 20 o posterior) desde https://nodejs.org/.

## Iniciar el proyecto

Abre una terminal en esta carpeta y ejecuta:

```bash
npm install
npm run dev
```

Abre http://localhost:5173 para usar la biblioteca.
La documentación de la API está en http://localhost:3000/api-docs.

## API

- `GET /api/libros`: devuelve todos los libros.
- `POST /api/libros`: crea un libro. Envía `titulo` y `autor` como texto JSON.
- `DELETE /api/libros/:id`: elimina el libro con ese id.

Los datos se guardan en una lista en memoria: al reiniciar el servidor vuelven los tres libros de ejemplo. CORS está habilitado para permitir que la página de Vue se conecte a la API.
