import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let libros = [
  { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez" },
  { id: 2, titulo: "La ciudad y los perros", autor: "Mario Vargas Llosa" },
  { id: 3, titulo: "Ficciones", autor: "Jorge Luis Borges" },
];
let siguienteId = 4;

const documentacion = {
  openapi: "3.0.0",
  info: {
    title: "API de la biblioteca",
    version: "1.0.0",
    description: "API sencilla para consultar y administrar libros.",
  },
  servers: [{ url: "http://localhost:3000" }],
  paths: {
    "/api/libros": {
      get: {
        summary: "Obtener todos los libros",
        responses: {
          200: {
            description: "Lista de libros",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Libro" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Crear",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["titulo", "autor"],
                properties: {
                  titulo: { type: "string" },
                  autor: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "creado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Libro" },
              },
            },
          },
          400: { description: "obligatorio" },
        },
      },
    },
    "/api/libros/{id}": {
      delete: {
        summary: "Eliminar un libro",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          204: { description: "Libro eliminado" },
          404: { description: "No se encontró el libro" },
        },
      },
    },
  },
  components: {
    schemas: {
      Libro: {
        type: "object",
        properties: {
          id: { type: "integer" },
          titulo: { type: "string" },
          autor: { type: "string" },
        },
      },
    },
  },
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(documentacion));

app.get("/api/libros", (_solicitud, respuesta) => {
  respuesta.status(200).json(libros);
});

app.post("/api/libros", (solicitud, respuesta) => {
  const titulo = solicitud.body?.titulo?.trim();
  const autor = solicitud.body?.autor?.trim();

  if (!titulo || !autor) {
    return respuesta
      .status(400)
      .json({ error: "El título y el autor son obligatorios." });
  }

  const libro = { id: siguienteId, titulo, autor };
  siguienteId += 1;
  libros.push(libro);
  return respuesta.status(201).json(libro);
});

app.delete("/api/libros/:id", (solicitud, respuesta) => {
  const id = Number(solicitud.params.id);
  const indice = libros.findIndex((libro) => libro.id === id);

  if (!Number.isInteger(id) || indice === -1) {
    return respuesta.status(404).json({ error: "No se encontró el libro." });
  }

  libros.splice(indice, 1);
  return respuesta.status(204).end();
});

app.listen(port, () => {
  console.log(`API lista en http://localhost:${port}`);
  console.log(`Documentación en http://localhost:${port}/api-docs`);
});
